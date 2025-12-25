(function () {
  const getProfileData = () => {
    const nameEl = document.querySelector("h1") || document.querySelector("[data-anonymize='person-name']");
    const name = nameEl ? nameEl.textContent?.trim() || "" : "";

    let companyName = "";
    let domain = "";
    let companyUrl = "";
    const experienceCompanyLink =
      document.querySelector('section[data-section="experience"] a[href*="linkedin.com/company"]') ||
      document.querySelector('section[id*="experience"] a[href*="linkedin.com/company"]') ||
      document.querySelector(".experience-section a[href*='linkedin.com/company']");

    const fallbackCompanyLink = document.querySelector("a[href*='linkedin.com/company']");
    const companyLink = experienceCompanyLink || fallbackCompanyLink;

    if (companyLink) {
      companyName = companyLink.textContent?.trim() || "";
      const href = companyLink.getAttribute("href") || "";
      if (href) {
        companyUrl = href.startsWith("http") ? href : `https://www.linkedin.com${href}`;
      }
      const slugMatch = companyUrl.match(/linkedin\.com\/company\/([^\/?#]+)/i);
      const slug = slugMatch?.[1] || "";
      if (slug) {
        const cleaned = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase();
        if (cleaned) {
          domain = `${cleaned}.com`;
        }
      }
    }

    return { name, domain, companyName, companyUrl };
  };

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "getProfileData") {
      sendResponse(getProfileData());
    }
  });
})();

