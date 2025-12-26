const qs = (sel) => document.querySelector(sel);
// Point the extension at the current sandbox deployment.
const DEFAULT_API_BASE = "https://emailfinderproj-9gpn7d42a-ss-projects-ef994bdf.vercel.app";

const nameInput = qs("#full-name");
const domainInput = qs("#domain");
const statusEl = qs("#status");
const resultCard = qs("#result-card");
const resultEmailEl = qs("#result-email");
const resultNoteEl = qs("#result-note");
const resultStatusEl = qs("#result-status");
const copyBtn = qs("#copy-btn");
const saveBtn = qs("#save-btn");
const listSelect = qs("#list-select");
const listStatus = qs("#list-status");
const findBtn = qs("#find-btn");
const refreshBtn = qs("#refresh-btn");
const signinBtn = qs("#signin-btn");

let listsLoaded = false;

const ensureContentScript = (tabId) =>
  new Promise((resolve) => {
    chrome.scripting.executeScript(
      { target: { tabId }, files: ["content-script.js"] },
      () => resolve()
    );
  });

const setStatus = (text) => {
  statusEl.textContent = text || "";
};

const setListStatus = (text) => {
  listStatus.textContent = text || "";
};

const showToast = (message, type = "info") => {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("error", type === "error");
  el.hidden = false;
  setTimeout(() => {
    el.hidden = true;
    el.classList.remove("error");
    el.textContent = "";
  }, 2400);
};

const getProfileData = () =>
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return resolve({ name: "", domain: "", companyName: "", companyUrl: "" });
      chrome.tabs.sendMessage(tab.id, { type: "getProfileData" }, async (resp) => {
        if (chrome.runtime.lastError) {
          await ensureContentScript(tab.id);
          chrome.tabs.sendMessage(tab.id, { type: "getProfileData" }, (resp2) => {
            resolve(resp2 || { name: "", domain: "", companyName: "", companyUrl: "" });
          });
          return;
        }
        resolve(resp || { name: "", domain: "", companyName: "", companyUrl: "" });
      });
    });
  });

const scrapeCompanyDomainViaContent = (companyUrl) =>
  new Promise((resolve) => {
    if (!companyUrl) return resolve("");
    const aboutUrl = companyUrl.includes("/about") ? companyUrl : `${companyUrl.replace(/\/$/, "")}/about`;

    const scrapeViaMessage = () =>
      new Promise((res) => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          const tab = tabs[0];
          if (!tab?.id) return res("");
          await ensureContentScript(tab.id);
          chrome.tabs.sendMessage(tab.id, { type: "scrapeCompanyDomain", companyUrl }, (resp) => {
            if (resp?.debug && typeof window !== "undefined") {
              window.debugLinkedInScrape = resp.debug;
            }
            res(resp?.domain || "");
          });
        });
      });

    const scrapeViaBackgroundTab = () =>
      new Promise((res) => {
        chrome.tabs.create({ url: aboutUrl, active: false }, (tab) => {
          if (!tab?.id) return res("");
          const tabId = tab.id;

          const extractDomain = () =>
            new Promise((innerRes) => {
              chrome.scripting.executeScript(
                {
                  target: { tabId },
                  func: () => {
                    const normalize = (val) => {
                      if (!val) return "";
                      const t = val.trim();
                      try {
                        const u = new URL(t.startsWith("http") ? t : `https://${t}`);
                        return u.hostname.replace(/^www\./, "");
                      } catch {
                        const noProto = t.replace(/^https?:\/\//i, "");
                        return noProto.split("/")[0].split("?")[0].replace(/^www\./, "");
                      }
                    };
                    const isGood = (host) => {
                      if (!host) return false;
                      const h = host.toLowerCase();
                      return (
                        !h.includes("linkedin.com") &&
                        !h.includes("licdn.com") &&
                        !h.includes("w3.org") &&
                        !h.includes("w3.com") &&
                        !h.includes("schema.org")
                      );
                    };
                    const dts = Array.from(document.querySelectorAll("dt"));
                    for (const dt of dts) {
                      const label = (dt.textContent || "").trim().toLowerCase();
                      if (!label.includes("website")) continue;
                      const dd = dt.nextElementSibling;
                      if (!dd) continue;
                      const anchor = dd.querySelector("a[href]");
                      if (!anchor) continue;
                      const href = anchor.getAttribute("href") || "";
                      const text = (anchor.textContent || "").trim();
                      const fromHref = normalize(href);
                      if (isGood(fromHref)) return fromHref;
                      const fromText = normalize(text);
                      if (isGood(fromText)) return fromText;
                    }
                    // Fallback: scan for websiteUrl in embedded JSON.
                    const html = document.documentElement.innerHTML;
                    const jsonMatch = html.match(/"websiteUrl":"(https?:\\\/\\\/[^"]+)"/);
                    if (jsonMatch?.[1]) {
                      const unescaped = jsonMatch[1].replace(/\\\//g, "/");
                      const d = normalize(unescaped);
                      if (isGood(d)) return d;
                    }
                    const linkMatch = html.match(
                      /https?:\/\/(?![^"']*linkedin\.com)(?![^"']*licdn\.com)(?![^"']*w3\.org)(?![^"']*w3\.com)(?![^"']*schema\.org)[^"'\s]+/i
                    );
                    if (linkMatch?.[0]) {
                      const d = normalize(linkMatch[0]);
                      if (isGood(d)) return d;
                    }
                    return "";
                  },
                },
                (results) => {
                  const domain = results?.[0]?.result || "";
                  innerRes(domain);
                }
              );
            });

          const listener = async (tabIdUpdated, info) => {
            if (tabIdUpdated === tabId && info.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              const domain = await extractDomain();
              chrome.tabs.remove(tabId);
              res(domain);
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        });
      });

    (async () => {
      const domain = await scrapeViaMessage();
      if (domain) return resolve(domain);
      const fallback = await scrapeViaBackgroundTab();
      resolve(fallback);
    })();
  });

const getApiBase = async () => {
  return DEFAULT_API_BASE;
};

const checkSession = async (apiBase) => {
  if (!apiBase) return false;
  try {
    const res = await fetch(`${apiBase}/api/me`, { credentials: "include" });
    return res.ok;
  } catch (_e) {
    return false;
  }
};

const fetchLists = async (apiBase) => {
  const res = await fetch(`${apiBase}/api/lead-lists`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to load lists (${res.status})`);
  const data = await res.json();
  const lists = data.lists || [];
  listSelect.innerHTML = "";
  lists.forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = l.name;
    listSelect.appendChild(opt);
  });
  listsLoaded = true;
};

const showResult = (email, note, status) => {
  resultEmailEl.textContent = email || "No result";
  resultNoteEl.textContent = note || "";
  resultStatusEl.textContent = status === "found" ? "Found" : status === "not_found" ? "Not found" : "Error";
  resultStatusEl.dataset.state = status;
  resultStatusEl.classList.toggle("not-found", status === "not_found");
  resultCard.hidden = false;

  // Hide copy button if not found.
  if (status === "found") {
    copyBtn.hidden = false;
  } else {
    copyBtn.hidden = true;
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    setListStatus("Copied!");
    setTimeout(() => setListStatus(""), 1500);
  } catch (err) {
    setListStatus(err instanceof Error ? err.message : "Failed to copy");
  }
};

const onFind = async () => {
  const apiBase = await getApiBase();

  const fullName = nameInput.value.trim();
  const domain = domainInput.value.trim();
  if (!fullName || !domain) {
    setStatus("Name and domain are required.");
    return;
  }

  setStatus("Finding email…");
  resultCard.hidden = true;
  setListStatus("");

  try {
    // brief UX delay
    await new Promise((r) => setTimeout(r, 400));
    const res = await fetch(`${apiBase}/api/find-contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ fullName, domain }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Lookup failed (${res.status})`);
    }
    const data = await res.json();
    const isFound = data.result === "ok" && data.email;
    if (isFound) {
      showResult(data.email, data.status ?? "Found", "found");
      setStatus("Found");
      if (!listsLoaded) {
        try {
          await fetchLists(apiBase);
        } catch (err) {
          setListStatus(err instanceof Error ? err.message : "Failed to load lists");
        }
      }
    } else {
      showResult("No result", "No email found", "not_found");
      setStatus("No email found");
      showToast("No email found", "error");
    }
  } catch (err) {
    showResult("Lookup failed", err instanceof Error ? err.message : "Unknown error", "error");
    setStatus(err instanceof Error ? err.message : "Lookup failed");
    showToast("Lookup failed", "error");
  }
};

const onSave = async () => {
  const apiBase = await getApiBase();
  const email = resultEmailEl.textContent || "";
  if (!email || email === "No result" || email === "Lookup failed") {
    setListStatus("No email to save.");
    return;
  }
  const fullName = nameInput.value.trim();
  const domain = domainInput.value.trim();
  const listId = listSelect.value;
  if (!listId) {
    setListStatus("Choose a list.");
    return;
  }
  setListStatus("Saving…");
  try {
    const res = await fetch(`${apiBase}/api/lead-lists/${listId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: fullName || null, email, domain }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to save (${res.status})`);
    }
    setListStatus("Saved to list");
  } catch (err) {
    setListStatus(err instanceof Error ? err.message : "Failed to save");
  }
};

const isLikelyDomain = (val) => {
  if (!val) return false;
  const trimmed = val.trim();
  const base = trimmed.split(".")[0] || trimmed;
  const host = trimmed.toLowerCase();
  const hasLetter = /[a-zA-Z]/.test(base);
  const isLinkedInHost = host.includes("linkedin.com") || host.includes("licdn.com");
  return hasLetter && !isLinkedInHost;
};

const init = async () => {
  const apiBase = await getApiBase();
  const isAuthed = await checkSession(apiBase);
  if (!isAuthed) {
    setStatus("Not signed in. Please sign in first.");
  }

  const profile = await getProfileData();
  if (profile?.name) nameInput.value = profile.name;

  // Always prefer scraping the About page via content script; do not use slug guesses.
  if (profile?.companyUrl) {
    setStatus("Fetching company website…");
    const scrapedDomain = await scrapeCompanyDomainViaContent(profile.companyUrl);
    if (scrapedDomain && isLikelyDomain(scrapedDomain)) {
      domainInput.value = scrapedDomain;
      setStatus("Company domain detected.");
      showToast(`Domain detected: ${scrapedDomain}`, "info");
    } else {
      setStatus("Company domain not detected—please enter it.");
      showToast("Domain not detected.", "error");
    }
  } else if (profile?.companyName) {
    setStatus("Company domain not detected—please enter it.");
    showToast("Domain not detected.", "error");
  }

  findBtn.addEventListener("click", onFind);
  copyBtn.addEventListener("click", () => copyToClipboard(resultEmailEl.textContent || ""));
  saveBtn.addEventListener("click", onSave);
  refreshBtn.addEventListener("click", async () => {
    const refreshed = await getProfileData();
    if (refreshed?.name) nameInput.value = refreshed.name;
    if (refreshed?.companyUrl) {
      setStatus("Fetching company website…");
      const scrapedDomain = await scrapeCompanyDomainViaContent(refreshed.companyUrl);
      if (scrapedDomain && isLikelyDomain(scrapedDomain)) {
        domainInput.value = scrapedDomain;
        setStatus("Company domain detected.");
        showToast(`Domain detected: ${scrapedDomain}`, "info");
      } else {
        setStatus("Company domain not detected—please enter it.");
        showToast("Domain not detected.", "error");
      }
    }
  });
  signinBtn.addEventListener("click", async () => {
    const apiBase = await getApiBase();
    chrome.tabs.create({ url: `${apiBase}/signin` });
  });
};

document.addEventListener("DOMContentLoaded", init);

