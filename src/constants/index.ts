export const YOUTUBE_VIDEOS_CONTAINER = {
  homepage: "div.ytd-rich-grid-renderer:nth-child(6)",
  subscription_page:
    "ytd-browse.style-scope:nth-child(3) > ytd-two-column-browse-results-renderer:nth-child(11) > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)",
  channel_videos_page:
    "ytd-two-column-browse-results-renderer.grid-5-columns > div:nth-child(1) > ytd-rich-grid-renderer:nth-child(1) > div:nth-child(6)",
  related_videos:
    "ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > div:nth-child(3)",
  search_videos: "ytd-search.style-scope",
};

export const YOUTUBE_VIDEO_INFO_CONTAINER = {
  main_video_container: "ytd-rich-grid-media",
  // main_video_container: "div#content.ytd-rich-item-renderer", // experimental, also selects shorts and playlist containers
  related_video_container: "ytd-compact-video-renderer",
  search_videos_container: "ytd-video-renderer",
};
