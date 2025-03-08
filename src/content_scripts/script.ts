function createButton() {
  const lists = document.querySelectorAll("#metadata-line");

  lists.forEach((list) => {
    const spanContainer = document.createElement("span");
    const button = document.createElement("button");
    const img = document.createElement("img");

    spanContainer.classList.add(
      "inline-metadata-item",
      "style-scope",
      "ytd-video-meta-block",
      "g-container"
    );

    button.classList.add("g-button");

    img.src = chrome.runtime.getURL("icons/icon128.png");
    img.classList.add("g-icon");

    button.appendChild(img);
    spanContainer.appendChild(button);
    list.appendChild(spanContainer);

    const videoContainer = list.closest(
      "ytd-rich-grid-media, ytd-video-renderer"
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
        chrome.runtime.sendMessage({
          action: "openPopup",
          url: videoUrl,
          title: videoTitle,
        });
      } else {
        console.error("Could not get video URL");
      }
    });
  });
}

createButton();
