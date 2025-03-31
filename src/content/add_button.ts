function createButton(target: Element) {
  const lists = target.querySelectorAll("#metadata-line");

  lists.forEach((list) => {
    const buttonExists = list.querySelector(".g-button");

    if (buttonExists) return;
    else {
      const spanContainer = document.createElement("span");
      const button = document.createElement("button");
      const img = document.createElement("img");

      spanContainer.classList.add(
        "inline-metadata-item",
        "style-scope",
        "ytd-video-meta-block",
        "g-container",
      );

      button.classList.add("g-button");

      img.src = chrome.runtime.getURL("icons/icon128.png");
      img.classList.add("g-icon");

      button.appendChild(img);
      spanContainer.appendChild(button);
      list.appendChild(spanContainer);

      const videoContainer = list.closest(
        "ytd-rich-grid-media, ytd-video-renderer",
      );

      const linkElement = videoContainer?.querySelector("a#thumbnail");
      const videoUrl = linkElement
        ? `https://www.youtube.com${linkElement.getAttribute("href")}`
        : null;

      const titleElement = videoContainer?.querySelector("#video-title");
      const videoTitle =
        titleElement && titleElement.textContent
          ? titleElement.textContent.trim()
          : "Unknown Title";

      button.addEventListener("click", () => {
        if (videoUrl) {
          chrome.storage.local.get("popupIsOpen", (result) => {
            if (!result.popupIsOpen) {
              chrome.runtime.sendMessage({
                action: "openPopup",
                url: videoUrl,
                title: videoTitle,
              });
            } else {
              chrome.runtime.sendMessage({ action: "closePopup" });
            }
          });
        }
      });
    }
  });
}

function waitForElement(
  selector: string,
  callback: (element: Element) => void,
) {
  const targets = document.querySelectorAll(selector);
  if (targets.length >= 1) {
    targets.forEach((target) => callback(target));
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length >= 1) {
        elements.forEach((target) => callback(target));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

waitForElement("#contents.ytd-rich-grid-renderer", (target) => {
  const observer = new MutationObserver(() => {
    createButton(target);
  });

  observer.observe(target, { childList: true, subtree: true });
});
