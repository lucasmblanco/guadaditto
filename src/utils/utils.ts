export function urlChecker(url: string): boolean {
  const youtubeRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/;
  return youtubeRegex.test(url);
}
