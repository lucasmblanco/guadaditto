function elementMatchesSelectors(element) {
  const selectors = [
    "div.ytd-rich-grid-renderer:nth-child(6)",
    "ytd-browse.style-scope:nth-child(3) > ytd-two-column-browse-results-renderer:nth-child(11) > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)",
    "ytd-two-column-browse-results-renderer.grid-5-columns > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)",
    "ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > div:nth-child(3)",
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
        console.log("Elemento encontrado:", node);
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

  // También verificar si los elementos ya existen en el DOM
  // const existingElements = [];

  // try {
  //   existingElements.push(
  //     ...document.querySelectorAll("div.ytd-rich-grid-renderer:nth-child(6)"),
  //   );
  //   existingElements.push(
  //     ...document.querySelectorAll(
  //       "ytd-browse.style-scope:nth-child(3) > ytd-two-column-browse-results-renderer:nth-child(11) > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)",
  //     ),
  //   );
  //   existingElements.push(
  //     ...document.querySelectorAll(
  //       "ytd-two-column-browse-results-renderer.grid-5-columns > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)",
  //     ),
  //   );
  // } catch (error) {
  //   console.error("Error al buscar elementos existentes:", error);
  // }

  // for (const element of existingElements) {
  //   console.log("Elemento existente encontrado:", element);
  //   // Aquí puedes ejecutar la lógica que necesites con los elementos ya existentes
  // }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObserving);
} else {
  startObserving();
}

// Para detener el observer cuando ya no lo necesites
// function stopObserving() {
//   observer.disconnect();
//   console.log('Observer detenido');
// }

// Ejemplo de cómo detener el observer después de un tiempo
// setTimeout(stopObserving, 60000); // Detener después de 1 minuto

//ytd-compact-video-renderer.style-scope:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > div:nth-child(2) > ytd-video-meta-block:nth-child(1) > div:nth-child(1) > div:nth-child(2)
// ytd-browse.style-scope:nth-child(2) > ytd-two-column-browse-results-renderer:nth-child(11) > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6) > ytd-rich-item-renderer:nth-child(3) > div:nth-child(1) > ytd-rich-grid-media:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > ytd-video-meta-block:nth-child(2) > div:nth-child(1) > div:nth-child(2)
// ytd-browse.style-scope:nth-child(3) > ytd-two-column-browse-results-renderer:nth-child(11) > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6) > ytd-rich-item-renderer:nth-child(7) > div:nth-child(1) > ytd-rich-grid-media:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > ytd-video-meta-block:nth-child(2) > div:nth-child(1) > div:nth-child(2)
function createButton(target: Element) {
  // const lists = target.querySelectorAll("#metadata-line");
  //#dismissible
  const lists = target.querySelectorAll("#dismissible");

  lists.forEach((list) => {
    const buttonExists = list.querySelector(".g-button");
    // const firstEl = list.querySelector("#metadata-line > span:nth-child(3)");

    if (buttonExists) {
      console.log("Button already exists, skipping creation.");
      return;
    } else {
      // const spanContainer = document.createElement("span");
      const button = document.createElement("button");
      const img = document.createElement("img");

      // spanContainer.classList.add(
      //   // "inline-metadata-item",
      //   // "style-scope",
      //   // "ytd-video-meta-block",
      //   "g-container",
      // );

      button.classList.add("g-button");

      img.src = chrome.runtime.getURL("icons/icon128.png");
      img.classList.add("g-icon");
      list.style.position = "relative";
      button.appendChild(img);
      list.appendChild(button);
      // spanContainer.appendChild(button);
      // list.appendChild(spanContainer);
      // detailEl?.appendChild(spanContainer);

      let videoContainer = list.closest(
        "ytd-rich-grid-media, ytd-video-renderer",
      );

      const videoRelatedContainer = list.closest(
        "ytd-compact-video-renderer, ytd-video-renderer",
      );

      if (videoRelatedContainer) {
        videoContainer = videoRelatedContainer;
      }
      //ytd-compact-video-renderer

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

// function waitForElement(
//   selector: string,
//   callback: (element: Element) => void,
// ) {
//   // const targets = document.querySelectorAll(selector);
//   // if (targets.length >= 1) {
//   //   targets.forEach((target) => callback(target));
//   // } else {

//   const observer = new MutationObserver((mutations, obs) => {
//     const elements = document.querySelectorAll(selector);
//     if (elements.length >= 1) {
//       elements.forEach((target) => callback(target));
//     }
//   });
//   observer.observe(document.body, { childList: true, subtree: true });

//   // }
// }

// waitForElement("#contents.ytd-rich-grid-renderer", (target) => {
//   const observer = new MutationObserver(() => {
//     createButton(target);
//   });

//   observer.observe(target, { childList: true, subtree: true });
// });

// // div.ytd-rich-grid-renderer:nth-child(6)
// // ytd-browse.style-scope:nth-child(3) > ytd-two-column-browse-results-renderer:nth-child(11) > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)
// // ytd-two-column-browse-results-renderer.grid-5-columns > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)
