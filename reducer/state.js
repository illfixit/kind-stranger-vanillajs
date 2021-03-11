export let state = {
  currentSubreddit: {
    name: `https://www.reddit.com/r/itookapicture/hot.json?`,
    previousPosts: [],
    currentPost: {},
    nextPosts: [],
    after: '',
    urlsForPreload: [],
    preloadingAfter: '',
  },
  previousSubreddit: {},
  slideshowInterval: 0,
  preloadingInterval: 0,
};
