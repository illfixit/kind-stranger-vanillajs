import { checkIfSubredditExists } from './redditAPIMethods.js';
import { reducer } from './reducer/reducer.js';
import { actions } from './reducer/actions.js';
import { store } from './reducer/store.js';

import {
  postIncludesProperImageOrVideo,
  getProperImageUrlFromPost,
} from './utils/utils.js';
import basicSubreddits from './utils/basicSubreddits.js';

const description = document.getElementById('description');
const results = document.getElementById('results');
const search = document.getElementById('search');
const image = document.getElementById('image');
const title = document.getElementById('title');
const video = document.getElementById('video');

const toggleButton = document.getElementById('toggle-button');
const sliderText = document.getElementById('slider-text');
const range = document.getElementById('range');

const menuClose = document.getElementById('menu-close');
const menuBtn = document.getElementById('menuBtn');
const menuImg = document.getElementById('menuImg');
const menu = document.getElementById('menu');

const slideshowToggle = document.getElementById('slideshow-toggle-button');
const screenToggle = document.getElementById('screenToggle');
slideshowToggle.checked = false;

const welcome = document.getElementById('welcome');

results.innerHTML = basicSubreddits;

let preloading;
let afterDownloadNextPosts = '';

downloadNextPost();

function downloadNextPost(
  url = store.currentSubreddit.name,
  after = store.currentSubreddit.after
) {
  fetch(`${url}&limit=1&after=${after}`)
    .then((response) => response.json())
    .then((data) => {
      data = data.data;
      store.currentSubreddit.after = data.after;

      let post = data.children[0].data;

      if (post.preview && postIncludesProperImageOrVideo(post)) {
        // don't push to previousPosts if currentPost is empty
        store.currentSubreddit.currentPost.preview &&
          store.currentSubreddit.previousPosts.push(
            store.currentSubreddit.currentPost
          );

        store.currentSubreddit.currentPost = post;

        // if (store.currentSubreddit.previousPosts.length > 0) {
        // console.log(posts.length);

        // }

        showPost(post);
      } else {
        // console.log('next');
        downloadNextPost();
      }
    })
    .catch((e) => {
      console.log(e);
      downloadNextPost();
    });
}

function downloadNextPosts(url, limit = 35) {
  // // console.log(url);
  nextURLS = [];
  let nextPosts = new XMLHttpRequest();
  nextPosts.open(
    'GET',
    `${url}&limit=${limit}&after=${afterDownloadNextPosts}`
  );
  nextPosts.responseType = 'json';
  nextPosts.send();
  nextPosts.onerror = function (e) {
    // // console.log(e);
  };
  nextPosts.onload = function (data) {
    // debugger;
    if (
      data.currentTarget.readyState === 4 &&
      data.currentTarget.status === 200
    ) {
      let nextPostsData = nextPosts.response.data.children;
      // // console.log(nextPostsData.response);
      afterDownloadNextPosts = nextPosts.response.data.after;
      nextPostsData.forEach((p) => {
        try {
          nextURLS.push(
            p.data.preview.images[0].resolutions[
              p.data.preview.images[0].resolutions.length - 1
            ].url.replace(/amp;/gi, '')
          );
        } catch (e) {
          // console.log('skip');
        }
      });
      index = 0;
      function preload() {
        // // console.log('preloading!');
        let cachedImg = new Image();
        try {
          // // console.log('try', index);
          cachedImg.src = nextURLS[index];
          index++;
        } catch (e) {
          console.log(e);
        }
        if (index !== 0 && index % 25 === 0) {
          clearInterval(preloading);
        }
      }
      if (nextURLS.length) {
        // // console.log(nextURLS.length);
        preloading = setInterval(preload, 1000);
      } else {
        clearInterval(preloading);
        downloadNextMultiplePosts(url);
      }
    } else {
      clearInterval(preloading);
      downloadNextMultiplePosts(url);
    }
  };
}

function showPost(post) {
  image.classList.remove('hidden');

  image.src = getProperImageUrlFromPost(post);

  video.classList.add('hidden');

  image.onload = function () {
    description.classList.remove('loading');
    search.classList.remove('loading');
    title.innerText = post['title'].trim();
    a.href = `https://www.reddit.com${post['permalink']}`;
  };

  video.onerror = function () {
    image.classList.remove('hidden');
  };

  console.log(post.url);
  if (post && post.crosspost_parent != null) {
    post = post.crosspost_parent_list[0];
  }

  if (post.url && post.url.includes('redd') && post.url.includes('.gif')) {
    console.log(`post.url.includes('redd') && post.url.includes('.gif')`);
    image.src = post.url;
  }

  if (post.url && post.url.includes('.gifv') && !post.url.includes('redd')) {
    console.log(`post.url.includes('.gifv') && !post.url.includes('redd')`);
    image.classList.add('hidden');
    video.src = post.url.replace('gifv', 'mp4');
    video.classList.remove('hidden');
  } else if (
    post.url &&
    post.url.includes('.gif') &&
    !post.url.includes('redd')
  ) {
    console.log(`post.url.includes('.gif') && !post.url.includes('redd')`);
    image.classList.add('hidden');
    video.src = post.url.replace('gif', 'mp4');
    video.classList.remove('hidden');
  }

  if (post.media && post.media.reddit_video != null) {
    console.log(`post.media.reddit_video != null`);
    image.classList.add('hidden');
    video.src = post.media.reddit_video.fallback_url;
    video.classList.remove('hidden');
  } else {
    video.classList.add('hidden');
  }

  if (post.url && post.url.includes('gfycat')) {
    console.log(`post.url.includes('gfycat')`);
    image.src = post.secure_media.oembed.thumbnail_url;
  }

  if (post.url && post.url.includes('redgif')) {
    console.log(`post.url.includes('redgif')`);
    image.classList.add('hidden');
    video.src = post.preview.reddit_video_preview.fallback_url;
    video.classList.remove('hidden');
  }
}

function searchSubreddits(s) {
  let listOfSubreddits = new XMLHttpRequest();
  listOfSubreddits.open(
    'GET',
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${s}&raw_json=1&gilding_detail=1`
  );

  listOfSubreddits.responseType = 'json';
  listOfSubreddits.send();

  listOfSubreddits.onerror = function (e) {
    // // console.log(e);
  };

  listOfSubreddits.onload = function () {
    results.innerHTML = '';

    let list = listOfSubreddits.response.data.children;

    list.forEach(function (element) {
      let imageSource = element.data.community_icon
        ? element.data.community_icon
        : element.data.icon_img ||
          `https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png`;

      // // console.log(element.data);
      element.data.url == null
        ? null
        : (results.innerHTML += `<div class="result">
        <img src="${imageSource}" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">
        ${element.data.url} - ${new Intl.NumberFormat().format(
            element.data.subscribers
          )} subscribers</div>`);
    });
  };
}

function getNextPost() {
  description.classList.add('loading');
  if (store.currentSubreddit.nextPosts.length) {
    store.currentSubreddit.previousPosts.push(
      store.currentSubreddit.currentPost
    );

    store.currentSubreddit.currentPost = store.currentSubreddit.nextPosts.pop();
    showPost(store.currentSubreddit.currentPost);
  } else {
    downloadNextPost();
  }
}

function getPreviousPost() {
  search.classList.add('loading');
  setTimeout(() => {
    if (store.currentSubreddit.previousPosts.length) {
      store.currentSubreddit.nextPosts.push(store.currentSubreddit.currentPost);

      store.currentSubreddit.currentPost = store.currentSubreddit.previousPosts.pop();
      showPost(store.currentSubreddit.currentPost);
    }
  }, 350);
}

function openMenu() {
  window.removeEventListener('click', clickHandler);
  menuBtn.children[0].style.filter = 'invert(1)';
  menuBtn.children[0].src =
    'https://www.flaticon.com/svg/static/icons/svg/57/57165.svg';
  menu.style.right = 0;
  menuClose.style.left = 0;
}

function closeMenu() {
  window.addEventListener('click', clickHandler);
  menuBtn.children[0].style.filter = 'invert(0)';
  menuBtn.children[0].src = './icon.png';
  menu.style.right = '-80vw';
  menuClose.style.left = '-20vw';
}

function toggleMenu() {
  menu.style.right === '0px' ? closeMenu() : openMenu();
}

menuBtn.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', closeMenu);

function toggleNightMode() {
  if (toggleButton.checked) {
    image.style.filter = `brightness(${range.value / 100})`;
    video.style.filter = `brightness(${range.value / 100})`;
    search.style.opacity = range.value / 100;
    description.style.opacity = range.value / 100;
    menuImg.style.opacity = range.value / 100 + 0.12;
    range.classList.toggle('hidden');
    sliderText.classList.toggle('hidden');
  } else {
    image.style.filter = 'brightness(1)';
    video.style.filter = 'brightness(1)';
    search.style.opacity = 1;
    description.style.opacity = 1;
    menuImg.style.opacity = 1;
    range.classList.toggle('hidden');
    sliderText.classList.toggle('hidden');
  }
}

function toggleSlideShow() {
  if (slideshowToggle.checked) {
    // // console.log('start slide show');
    try {
      if (slideshow !== null) {
        clearInterval(slideshow);
      }
    } catch (e) {}
    slideshow = setInterval(function () {
      downloadNextPost(url);
    }, 5000);
  } else {
    // // console.log('stop slide show');
    clearInterval(slideshow);
  }
}

slideshowToggle.addEventListener('click', toggleSlideShow);

range.oninput = function () {
  // // console.log(`brightness(${range.value / 100})`);
  image.style.filter = `brightness(${range.value / 100})`;
  video.style.filter = `brightness(${range.value / 100})`;
  search.style.opacity = range.value / 100;
  description.style.opacity = range.value / 100;
  menuImg.style.opacity = range.value / 100 + 0.12;
};

toggleButton.addEventListener('click', toggleNightMode);

// Keyboard Handler (both desktop & mobile)
async function keyboardButtonsHandler(e) {
  if (e.which == 13 || e.keyCode == 13 || e.key === 'Enter') {
    if (search.value.trim()) {
      let res = search.value.trim();
      // console.log(res);
      if (res[0] === '/' && res[1] === 'r' && res[2] === '/') {
        res = res.slice(2);
      } else if (res[0] === 'r' && res[1] === '/') {
        res = res.slice(1);
      } else if (res[0] === '/') {
        res = res.slice(0);
      }

      clearInterval(preloading);

      results.classList.add('hidden');

      try {
        if (slideshow !== null) {
          clearInterval(slideshow);
        }
      } catch (e) {}
      slideshowToggle.checked = false;

      let sub = res.replace(/[^a-z\d\_\s\+]+/gi, '');
      let subredditExists = await checkIfSubredditExists(sub);

      if (subredditExists) {
        search.value = '';
        title.innerText = `loading r/${sub}/`;

        store.previousSubreddit = store.currentSubreddit;

        store.currentSubreddit = {
          name: `https://www.reddit.com/r/${sub}/hot.json?`,
          previousPosts: [],
          currentPost: {},
          nextPosts: [],
          after: '',
        };

        downloadNextPost();
        // downloadNextPosts(url);
      }
    }
  } else if (
    e.which == 39 ||
    e.keyCode == 39 ||
    e.key === 'ArrowDown' ||
    e.which == 40 ||
    e.keyCode == 40 ||
    e.key === 'ArrowRight'
  ) {
    if (counter > 0) {
      counter--;
      showPost(posts[posts.length - counter - 1]);
    } else {
      toggleSlideShow();
    }
  } else if (
    e.which == 37 ||
    e.keyCode == 37 ||
    e.key === 'ArrowLeft' ||
    e.which == 38 ||
    e.keyCode == 38 ||
    e.key === 'ArrowUp'
  ) {
    counter++;
    if (counter > posts.length - 1) {
      counter = posts.length - 1;
    }
    // // console.log(counter)
    showPost(posts[posts.length - counter - 1]);
  }
}

// Desktop mouse click handler
async function clickHandler(e) {
  if (e.target.className === 'search') {
    search.focus();
    if (results.innerHTML.trim() == '') {
      results.innerHTML = basicSubreddits;
    }
    results.classList.remove('hidden');
  }

  if (e.target.className === 'image') {
    results.classList.add('hidden');
  }

  // mouse click
  if (e.target.className === 'result') {
    clearInterval(preloading);
    let sub = e.target.innerText
      .split('-')[0]
      .trim()
      .replace(/[^a-z\d\_\s]+/gi, '')
      .substring(1);

    results.classList.add('hidden');
    results.innerHTML = '';
    slideshowToggle.checked = false;

    try {
      if (slideshow !== null) {
        clearInterval(slideshow);
      }
    } catch (e) {}

    let subredditExists = await checkIfSubredditExists(sub);

    if (subredditExists) {
      search.value = '';
      title.innerText = `loading r/${sub}/`;

      store.previousSubreddit = store.currentSubreddit;

      store.currentSubreddit = {
        name: `https://www.reddit.com/r/${sub}/hot.json?`,
        previousPosts: [],
        currentPost: {},
        nextPosts: [],
        after: '',
      };

      downloadNextPost();
      // downloadNextPosts(url);
    }
  }

  if (e.target.id === 'closeWelcome') {
    welcome.style.display = 'none';
    search.classList.remove('hidden');
    image.classList.remove('blurred');
    description.classList.remove('hidden');
    menuBtn.classList.remove('hidden');

    // setTimeout(() => {
    //   downloadNextPosts(startUrl);
    // }, 1000);
  }
}

// Desktop mouse wheel handler
function wheelScroll(e) {
  // // console.log(e)
  if (e.deltaY > 0) {
    window.removeEventListener('wheel', wheelScroll);
    setTimeout(function () {
      window.addEventListener('wheel', wheelScroll);
    }, 300);
    getNextPost();
  } else if (e.deltaY < 0) {
    window.removeEventListener('wheel', wheelScroll);
    setTimeout(function () {
      window.addEventListener('wheel', wheelScroll);
    }, 300);
    getPreviousPost();
  }
}

// Mobile touch handlers
let y = []; // array is used to store touch coordinates and calculate delta
// let previousTouch = 0;

async function touchStartHandlerY(e) {
  let previousTouch = e.timeStamp || 0; // added || 0

  if (e.target.className.includes('slider')) {
    return;
  }

  if (e.target.className === 'search') {
    search.focus();
    if (results.innerHTML.trim() == '') {
      results.innerHTML = basicSubreddits;
    }
    results.classList.remove('hidden');
  }

  if (e.target.className === 'image' || e.target.className === 'video') {
    // e.preventDefault();
    y.push(e.targetTouches[0].clientY);
    // x.push(e.targetTouches[0].clientX);
    results.classList.add('hidden');

    // if(counter = 0) {  downloadNextPost(url)};
  }

  // touch
  if (e.target.className === 'result') {
    clearInterval(preloading);
    let sub = e.target.innerText
      .split('-')[0]
      .trim()
      .replace(/[^a-z\d\_\s]+/gi, '')
      .substring(1);

    results.classList.add('hidden');

    try {
      if (slideshow !== null) {
        clearInterval(slideshow);
      }
    } catch (e) {}
    slideshowToggle.checked = false;

    let subredditExists = await checkIfSubredditExists(sub);

    if (subredditExists) {
      results.innerHTML = '';
      search.value = '';
      title.innerText = `loading r/${sub}/`;

      store.previousSubreddit = store.currentSubreddit;

      store.currentSubreddit = {
        name: `https://www.reddit.com/r/${sub}/hot.json?`,
        previousPosts: [],
        currentPost: {},
        nextPosts: [],
        after: '',
      };

      downloadNextPost();
      // downloadNextPosts(url);
    }
  }

  if (e.target.className === 'menuBtn') {
    // document.location.reload();
  }

  if (e.target.id === 'closeWelcome') {
    welcome.style.display = 'none';
    search.classList.remove('hidden');
    image.classList.remove('blurred');
    description.classList.remove('hidden');
    menuBtn.classList.remove('hidden');

    // setTimeout(() => {
    //   downloadNextPosts(startUrl);
    // }, 1000);
  }
}

function touchMoveHandlerY(e) {
  if (e.target.className.includes('slider')) {
    return;
  }

  y.push(e.targetTouches[0].clientY);
}

function touchEndHandlerY(e) {
  let deltaY = y[0] - y[y.length - 1];

  y = [];

  if (deltaY > 0) {
    getNextPost();
  } else if (deltaY < 0) {
    getPreviousPost();
  }
}

// Simple function to change the scale of both image and video
function scaleChange(e) {
  if (image.style.objectFit != 'contain') {
    image.style.objectFit = 'contain';
    video.style.objectFit = 'contain';
  } else {
    image.style.objectFit = 'cover';
    video.style.objectFit = 'cover';
  }
}

// Mouse click listener
window.addEventListener('click', clickHandler);

// Keyboard listener
window.addEventListener('keydown', keyboardButtonsHandler);

// Mouse Wheel Scroll listener
window.addEventListener('wheel', wheelScroll);

// Double Click Listeners
image.addEventListener('dblclick', scaleChange);
video.addEventListener('dblclick', scaleChange);

// Mobile touch handlers
window.addEventListener('touchstart', touchStartHandlerY);
window.addEventListener('touchmove', touchMoveHandlerY);
window.addEventListener('touchend', touchEndHandlerY);

// Search bar input listener
search.addEventListener('input', function (e) {
  searchSubreddits(e.target.value);
  results.classList.remove('hidden');
});

// Experimental features //

// 'Parallax' effect on PCs //

/* image.addEventListener('mousemove', function(e){
  image.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
  video.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
})

video.addEventListener('mousemove', function(e){
  image.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
  video.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
}) */

// Horizontal swipe instead of vertical //

// window.addEventListener('touchstart', touchStartHandlerX);
// window.addEventListener('touchmove', touchMoveHandlerX);
// window.addEventListener('touchend', touchEndHandlerX);

/* let x = [];
 function touchStartHandlerX(e) {

  previousTouch = e.timeStamp

  if (e.target.className === 'search') {
    search.focus();
    if (results.innerHTML.trim() == '') {
      results.innerHTML = basicSubreddits;
    }
    results.classList.remove('hidden');
  }

  if (e.target.className === 'image') {
    // e.preventDefault();
    x.push(e.targetTouches[0].clientX);
    results.classList.add('hidden');
    // // console.log(url);
    // if(counter = 0) {  downloadNextPost(url)};
  }

  if (e.target.className === 'result') {
    let sub = e.target.innerText;
    counter = 0;
    posts = [];
    after = '';
    search.value = '';
    results.classList.add('hidden');
    url = `https://www.reddit.com${sub.trim()}hot.json?`;
    results.innerHTML = '';
    downloadNextPost(url);
  }

  if (e.target.className === 'menuBtn') {
    document.location.reload();
  }
}

function touchMoveHandlerX(e) {
  x.push(e.targetTouches[0].clientX);

  // image.style.transform = `translateX(${(x[x.length - 1] - x[0])/5}px)`;
}

 function touchEndHandlerX(e) {
  let delta = x[0] - x[x.length - 1];
  x = [];

  if (delta > 0) {
    getNextPost();
  } else if (delta < 0) {
    getPreviousPost();
  }
} */
