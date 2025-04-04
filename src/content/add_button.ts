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
    const dismissibleElement =
      container.querySelector<HTMLElement>("#dismissible");

    if (!dismissibleElement) {
      return;
    }

    const buttonExists =
      dismissibleElement.querySelector<HTMLElement>(".g-button");

    if (buttonExists) {
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

      button.addEventListener("click", (e) =>
        addOpenPopupFunctionality(e, container),
      );
    }
  });
}

function addOpenPopupFunctionality(e: MouseEvent, container: HTMLElement) {
  e.stopPropagation();
  const linkElement = container.querySelector("a#thumbnail");
  const videoUrl = linkElement
    ? `https://www.youtube.com${linkElement.getAttribute("href")}`
    : null;

  const titleElement = container.querySelector("#video-title");
  const videoTitle =
    titleElement && titleElement.textContent
      ? titleElement.textContent.trim()
      : "Unknown Title";
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
