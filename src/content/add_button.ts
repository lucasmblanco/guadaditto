import { YOUTUBE_VIDEO_SELECTOR } from "../constants";

function elementMatchesSelectors(element: HTMLElement) {
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

function checkAddedNodes(addedNodes: NodeList) {
  for (const node of addedNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (elementMatchesSelectors(node as HTMLElement)) {
        const observer = new MutationObserver(() => {
          createButton(node as HTMLElement);
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

function createButton(target: HTMLElement) {
  // const lists = target.querySelectorAll<HTMLElement>("#dismissible");
  let containers;
  const gridContainers = target.querySelectorAll<HTMLElement>(
    "ytd-rich-grid-media",
  );
  const relatedContainers = target.querySelectorAll<HTMLElement>(
    "ytd-compact-video-renderer",
  );

  if (relatedContainers.length > 0) {
    containers = relatedContainers;
  } else {
    containers = gridContainers;
  }

  containers.forEach((container) => {
    let videoUrl;
    let videoTitle;
    const dismissibleElement =
      container.querySelector<HTMLElement>("#dismissible");

    if (!dismissibleElement) {
      return;
    }

    const buttonExists =
      dismissibleElement.querySelector<HTMLElement>(".g-button");

    if (buttonExists) {
      const linkElement = container?.querySelector("a#thumbnail");
      videoUrl = linkElement
        ? `https://www.youtube.com${linkElement.getAttribute("href")}`
        : null;

      const titleElement = container?.querySelector("#video-title");
      videoTitle =
        titleElement && titleElement.textContent
          ? titleElement.textContent.trim()
          : "Unknown Title";

      buttonExists.addEventListener("click", (e) =>
        addOpenPopupFunctionality(e, videoUrl, videoTitle),
      );

      return;
    } else {
      const button = document.createElement("button");
      const img = document.createElement("img");

      button.classList.add("g-button");

      img.src = chrome.runtime.getURL("icons/icon128.png");
      img.classList.add("g-icon");
      dismissibleElement.style.position = "relative";
      button.appendChild(img);
      dismissibleElement.appendChild(button);

      // let videoContainer = list.closest(
      //   "ytd-rich-grid-media, ytd-video-renderer",
      // );

      // const videoRelatedContainer = list.closest(
      //   "ytd-compact-video-renderer, ytd-video-renderer",
      // );

      // if (videoRelatedContainer) {
      //   videoContainer = videoRelatedContainer;
      // }

      const linkElement = container?.querySelector("a#thumbnail");
      videoUrl = linkElement
        ? `https://www.youtube.com${linkElement.getAttribute("href")}`
        : null;

      const titleElement = container?.querySelector("#video-title");
      videoTitle =
        titleElement && titleElement.textContent
          ? titleElement.textContent.trim()
          : "Unknown Title";

      button.addEventListener("click", (e) =>
        addOpenPopupFunctionality(e, videoUrl, videoTitle),
      );
    }
  });
}

function addOpenPopupFunctionality(e, videoUrl, videoTitle) {
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
  }
}
