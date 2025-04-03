import { YOUTUBE_VIDEO_SELECTOR } from "../constants";

function elementMatchesSelectors(element) {
  const selectors = [
    YOUTUBE_VIDEO_SELECTOR.homepage,
    YOUTUBE_VIDEO_SELECTOR.subscription_page,
    YOUTUBE_VIDEO_SELECTOR.channel_videos_page,
    YOUTUBE_VIDEO_SELECTOR.related_videos,
  ];

  return selectors.some((selector) => {
    try {
      return element.matches(selector);
    } catch (error) {
      return false;
    }
  });
}

function checkAddedNodes(addedNodes) {
  for (const node of addedNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (elementMatchesSelectors(node)) {
        const observer = new MutationObserver(() => {
          createButton(node);
        });
        observer.observe(node, { childList: true, subtree: true });
      }
    }
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      checkAddedNodes(mutation.addedNodes);
    }
  }
});

function startObserving() {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObserving);
} else {
  startObserving();
}

function createButton(target: Element) {
  const lists = target.querySelectorAll("#dismissible");

  lists.forEach((list) => {
    const buttonExists = list.querySelector(".g-button");

    if (buttonExists) {
      console.log("Button already exists, skipping creation.");
      return;
    } else {
      const button = document.createElement("button");
      const img = document.createElement("img");

      button.classList.add("g-button");

      img.src = chrome.runtime.getURL("icons/icon128.png");
      img.classList.add("g-icon");
      list.style.position = "relative";
      button.appendChild(img);
      list.appendChild(button);

      let videoContainer = list.closest(
        "ytd-rich-grid-media, ytd-video-renderer",
      );

      const videoRelatedContainer = list.closest(
        "ytd-compact-video-renderer, ytd-video-renderer",
      );

      if (videoRelatedContainer) {
        videoContainer = videoRelatedContainer;
      }

      const linkElement = videoContainer?.querySelector("a#thumbnail");
      const videoUrl = linkElement
        ? `https://www.youtube.com${linkElement.getAttribute("href")}`
        : null;

      const titleElement = videoContainer?.querySelector("#video-title");
      const videoTitle =
        titleElement && titleElement.textContent
          ? titleElement.textContent.trim()
          : "Unknown Title";

      button.addEventListener("click", (e) => {
        e.stopPropagation();
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
        } else {
          console.log("Video URL not found.");
        }
      });
    }
  });
}
