const qs = (sel) => document.querySelector(sel);
const DEFAULT_API_BASE = "https://emailfinderproj.vercel.app";

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

const setStatus = (text) => {
  statusEl.textContent = text || "";
};

const setListStatus = (text) => {
  listStatus.textContent = text || "";
};

const getProfileData = () =>
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return resolve({ name: "", domain: "", companyName: "", companyUrl: "" });
      chrome.tabs.sendMessage(tab.id, { type: "getProfileData" }, (resp) => {
        resolve(resp || { name: "", domain: "", companyName: "", companyUrl: "" });
      });
    });
  });

const scrapeCompanyDomain = async (companyUrl) => {
  if (!companyUrl) return "";
  return new Promise((resolve) => {
    chrome.tabs.create({ url: companyUrl, active: false }, (tab) => {
      if (!tab?.id) return resolve("");
      const tabId = tab.id;
      const timeout = setTimeout(() => {
        chrome.tabs.remove(tabId);
        resolve("");
      }, 8000);
      chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
        if (updatedTabId === tabId && info.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.scripting.executeScript(
            {
              target: { tabId },
              func: () => {
                const link = document.querySelector('a[data-tracking-control-name*="website"], a[href^="http"]');
                const href = link?.getAttribute("href") || "";
                try {
                  const url = new URL(href);
                  return url.hostname.replace(/^www\./, "");
                } catch {
                  return "";
                }
              },
            },
            (results) => {
              clearTimeout(timeout);
              chrome.tabs.remove(tabId);
              if (chrome.runtime.lastError) return resolve("");
              const domain = results?.[0]?.result || "";
              resolve(domain);
            }
          );
        }
      });
    });
  });
};

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
  resultCard.hidden = false;
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
    if (data.email) {
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
      showResult("No result", data.status ?? "No email found", "not_found");
      setStatus("No email found");
    }
  } catch (err) {
    showResult("Lookup failed", err instanceof Error ? err.message : "Unknown error", "error");
    setStatus(err instanceof Error ? err.message : "Lookup failed");
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

const init = async () => {
  const apiBase = await getApiBase();
  const isAuthed = await checkSession(apiBase);
  if (!isAuthed) {
    setStatus("Not signed in. Please sign in first.");
  }

  const profile = await getProfileData();
  if (profile?.name) nameInput.value = profile.name;
  if (profile?.domain) {
    domainInput.value = profile.domain;
  } else if (profile?.companyUrl) {
    setStatus("Fetching company website…");
    const scrapedDomain = await scrapeCompanyDomain(profile.companyUrl);
    if (scrapedDomain) {
      domainInput.value = scrapedDomain;
      setStatus("Company domain detected.");
    } else {
      setStatus("Company domain not detected—please enter it.");
    }
  } else if (profile?.companyName) {
    setStatus("Company domain not detected—please enter it.");
  }

  findBtn.addEventListener("click", onFind);
  copyBtn.addEventListener("click", () => copyToClipboard(resultEmailEl.textContent || ""));
  saveBtn.addEventListener("click", onSave);
  refreshBtn.addEventListener("click", async () => {
    const refreshed = await getProfileData();
    if (refreshed?.name) nameInput.value = refreshed.name;
    if (refreshed?.domain) domainInput.value = refreshed.domain;
  });
  signinBtn.addEventListener("click", async () => {
    const apiBase = await getApiBase();
    chrome.tabs.create({ url: `${apiBase}/signin` });
  });
};

document.addEventListener("DOMContentLoaded", init);

