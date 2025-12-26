(function () {
  const getDebug = () => {
    if (typeof window === "undefined") return null;
    if (!window.debugLinkedInScrape) window.debugLinkedInScrape = {};
    return window.debugLinkedInScrape;
  };

  const normalizeDomain = (val) => {
    if (!val) return "";
    const trimmed = val.trim();
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      return url.hostname.replace(/^www\./, "");
    } catch {
      const noProto = trimmed.replace(/^https?:\/\//i, "");
      const host = noProto.split("/")[0].split("?")[0];
      return host.replace(/^www\./, "");
    }
  };

  const isExternalGood = (host) => {
    if (!host) return false;
    const h = host.toLowerCase();
    return (
      !h.includes("linkedin.com") &&
      !h.includes("licdn.com") &&
      !h.includes("cloudflare.com") &&
      !h.includes("cloudflare.net") &&
      !h.includes("w3.org") &&
      !h.includes("w3.com") &&
      !h.includes("schema.org")
    );
  };

  const findWebsiteAnchor = (doc) => {
    const dts = Array.from(doc.querySelectorAll("dt"));
    for (const dt of dts) {
      const label = (dt.textContent || "").trim().toLowerCase();
      if (!label.includes("website")) continue;
      const dd = dt.nextElementSibling;
      if (!dd) continue;
      const anchor = dd.querySelector("a[href]");
      if (anchor) return anchor;
    }
    return null;
  };

  const parseWebsiteFromDoc = (doc) => {
    const anchor = findWebsiteAnchor(doc);
    if (!anchor) return { domain: "", debug: { href: "", text: "", note: "no website dt/dd" } };
    const href = anchor.getAttribute("href") || "";
    const text = (anchor.textContent || "").trim();
    const fromHref = normalizeDomain(href);
    const fromText = normalizeDomain(text);
    const domain = isExternalGood(fromHref) ? fromHref : isExternalGood(fromText) ? fromText : "";
    return { domain, debug: { href, text } };
  };

  const pollDocumentForWebsite = async (docProvider, attempts = 60, delay = 200) => {
    for (let i = 0; i < attempts; i++) {
      const { domain, debug } = parseWebsiteFromDoc(docProvider());
      if (domain) return { domain, debug, attempt: i + 1 };
      await new Promise((r) => setTimeout(r, delay));
    }
    return { domain: "", debug: { href: "", text: "", note: "poll exhausted" }, attempt: attempts };
  };

  const extractDomainFromJson = (html) => {
    // Look for websiteUrl in embedded JSON.
    const jsonMatch = html.match(/"websiteUrl":"(https?:\\\/\\\/[^"]+)"/);
    if (jsonMatch?.[1]) {
      const unescaped = jsonMatch[1].replace(/\\\//g, "/");
      const d = normalizeDomain(unescaped);
      if (d && isExternalGood(d)) return { domain: d, note: "json websiteUrl" };
    }
    return { domain: "", note: "no json domain" };
  };

  const scrapeCompanyDomain = async (companyUrl) => {
    if (!companyUrl) return "";
    const targetUrl = companyUrl.includes("/about") ? companyUrl : `${companyUrl.replace(/\/$/, "")}/about`;
    const dbg = getDebug();

    // If already on About, poll live DOM for up to ~12s.
    if (location && location.href && location.href.startsWith(targetUrl)) {
      const { domain, debug, attempt } = await pollDocumentForWebsite(() => document);
      if (dbg) {
        dbg.lastAnchor = debug;
        dbg.from = "live-dom";
        dbg.attempts = attempt;
      }
      if (domain) return domain;
    }

    // Fetch About page when not on it, then poll the parsed HTML for Website dt/dd.
    const fetchWithRetry = async () => {
      const maxAttempts = 4;
      const delay = 600;
      for (let i = 0; i < maxAttempts; i++) {
        try {
          const resp = await fetch(targetUrl, { credentials: "include" });
          if (!resp.ok) continue;
          const html = await resp.text();
          if (html && html.length > 0) return html;
        } catch {
          // ignore and retry
        }
        await new Promise((r) => setTimeout(r, delay));
      }
      return "";
    };

    try {
      const html = await fetchWithRetry();
      if (!html) {
        if (dbg) dbg.lastFetchedHtmlSnippet = "";
        return "";
      }
      const doc = new DOMParser().parseFromString(html, "text/html");
      const { domain, debug, attempt } = await pollDocumentForWebsite(() => doc);
      let finalDomain = domain;
      let finalDebug = debug;
      if (!finalDomain) {
        const jsonResult = extractDomainFromJson(html);
        finalDomain = jsonResult.domain;
        finalDebug = { ...debug, note: jsonResult.note, href: debug.href, text: debug.text };
      }
      if (dbg) {
        dbg.lastAnchor = finalDebug;
        dbg.lastFetchedHtmlSnippet = html.slice(0, 2000);
        dbg.from = "fetched";
        dbg.attempts = attempt;
        dbg.h3Count = doc.querySelectorAll("h3").length;
        dbg.dtCount = doc.querySelectorAll("dt").length;
      }
      return finalDomain;
    } catch (_e) {
      return "";
    }
  };

  const getProfileData = () => {
    const nameEl = document.querySelector("h1") || document.querySelector("[data-anonymize='person-name']");
    const name = nameEl ? nameEl.textContent?.trim() || "" : "";

    let companyName = "";
    let domain = "";
    let companyUrl = "";

    // Grab the most recent company from the Experience section (first match).
    const experienceSection =
      document.querySelector('section[data-section="experience"]') ||
      document.querySelector('section[id*="experience"]') ||
      document.querySelector(".experience-section");

    let companyLink = null;
    if (experienceSection) {
      const companyLinks = Array.from(
        experienceSection.querySelectorAll("a[href*='linkedin.com/company']")
      );
      companyLink = companyLinks[0] || null; // most recent experience is rendered first
    }

    // Fallback: any company link on the page.
    if (!companyLink) {
      companyLink = document.querySelector("a[href*='linkedin.com/company']");
    }

    if (companyLink) {
      companyName = companyLink.textContent?.trim() || "";
      const href = companyLink.getAttribute("href") || "";
      if (href) {
        companyUrl = href.startsWith("http") ? href : `https://www.linkedin.com${href}`;
      }
      // Do not guess from slug here; let the popup fetch the About page to get the actual website.
      domain = "";
    }

    return { name, domain, companyName, companyUrl };
  };

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "getProfileData") {
      sendResponse(getProfileData());
    } else if (msg?.type === "scrapeCompanyDomain") {
      (async () => {
        const domain = await scrapeCompanyDomain(msg.companyUrl || "");
        const dbg = getDebug();
        sendResponse({ domain, debug: dbg || {} });
      })();
      return true; // keep the message channel open for async sendResponse
    }
  });
})();

