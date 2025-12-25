(function () {
  const getProfileData = () => {
    const nameEl = document.querySelector("h1") || document.querySelector("[data-anonymize='person-name']");
    const name = nameEl ? nameEl.textContent?.trim() || "" : "";

    let domain = "";
    const companyLink = document.querySelector("a[href*='linkedin.com/company']");
    if (companyLink && companyLink.textContent) {
      const companyText = companyLink.textContent.trim().toLowerCase().replace(/\s+/g, "");
      if (companyText) {
        domain = companyText + ".com";
      }
    }

    return { name, domain };
  };

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "getProfileData") {
      sendResponse(getProfileData());
    }
  });
})();

