import { checkIfSubredditExists } from './redditAPIMethods.js';
import { reducer } from './reducer/reducer.js';
import { actions } from './reducer/actions.js';
import { state } from './reducer/state.js';

import {
  postIncludesProperImageOrVideo,
  getProperImageUrlFromPost,
  scaleChange,
  show,
  hide,
  setSrc,
} from './utils/utils.js';

import {
  defaultSubreddits,
  description,
  results,
  search,
  image,
  title,
  video,
  toggleButton,
  sliderText,
  range,
  menuClose,
  menuBtn,
  menuImg,
  menu,
  slideshowToggle,
  screenToggle,
  welcome,
} from './utils/default.js';

downloadNextPost();

function downloadNextPost(
  url = state.currentSubreddit.name,
  after = state.currentSubreddit.after
) {
  fetch(`${url}&limit=1&after=${after}`)
    .then((response) => response.json())
    .then((data) => {
      data = data.data;
      state.currentSubreddit.after = data.after;

      let post = data.children[0].data;

      if (post.preview && postIncludesProperImageOrVideo(post)) {
        // don't push to previousPosts if currentPost is empty
        state.currentSubreddit.currentPost.preview &&
          state.currentSubreddit.previousPosts.push(
            state.currentSubreddit.currentPost
          );

        state.currentSubreddit.currentPost = post;

        showPost(post);
      } else {
        downloadNextPost();
      }
    })
    .catch((e) => {
      console.log(e);
      downloadNextPost();
    });
}

function preloadNextPosts(url = state.currentSubreddit.name, limit = 100) {
  // get 100 posts and push them to urlsForPreload array
  // console.log(
  //   `${state.currentSubreddit.name}&limit=${limit}&after=${state.preloadingAfter}`
  // );
  fetch(
    `${state.currentSubreddit.name}&limit=${limit}&after=${state.preloadingAfter}`
  )
    .then((response) => response.json())
    .then((data) => {
      state.currentSubreddit.preloadingAfter = data.data.after;
      data.data.children.forEach((p) => {
        state.currentSubreddit.urlsForPreload.push(p.data);
      });
    })
    .catch((e) => {
      console.log(e);
    });

  // console.log(state.currentSubreddit);

  state.preloadingInterval = setInterval(() => {
    console.log();
    if (state.currentSubreddit.urlsForPreload.length) {
      let cachedImg = new Image();

      try {
        cachedImg.src = getProperImageUrlFromPost(
          state.currentSubreddit.urlsForPreload.shift()
        );
      } catch (e) {
        if (state.currentSubreddit.urlsForPreload.length === 0) {
          clearInterval(state.preloadingInterval);
        }
        console.log(e);
      }
    }
  }, 500);
  // setTimeout(() => {
  //   clearInterval(state.preloadingInterval);
  // }, 50000);
}

function showPost(post) {
  show(image);
  setSrc(image, getProperImageUrlFromPost(post));
  hide(video);

  image.onload = function () {
    description.classList.remove('loading');
    search.classList.remove('loading');
    title.innerText = post['title'].trim();
    a.href = `https://www.reddit.com${post['permalink']}`;
  };

  video.onerror = function () {
    show(image);
  };

  if (post && post.crosspost_parent != null)
    post = post.crosspost_parent_list[0];

  if (post.url && post.url.includes('redd') && post.url.includes('.gif'))
    setSrc(image, post.url);

  if (post.url && post.url.endsWith('.gifv') && !post.url.includes('redd')) {
    hide(image);
    setSrc(video, post.url.replace('gifv', 'mp4'));
    show(video);
  }
  if (post.url && post.url.endsWith('.gif') && !post.url.includes('redd')) {
    hide(image);
    setSrc(video, post.url.replace('gif', 'mp4'));
    show(video);
  }

  if (post.media && post.media.reddit_video != null) {
    hide(image);
    setSrc(video, post.media.reddit_video.fallback_url);
    show(video);
  } //  else {
  //   hide(video);
  // }

  if (post.url && post.url.includes('gfycat'))
    setSrc(image, post.secure_media.oembed.thumbnail_url);

  if (post.url && post.url.includes('redgif')) {
    hide(image);
    setSrc(video, post.preview.reddit_video_preview.fallback_url);
    show(video);
  }
}

function searchSubreddits(s) {
  const showResults = (data) => {
    results.innerHTML = '';
    data.data.children.forEach((element) => {
      let imageSource = element.data.community_icon
        ? element.data.community_icon
        : element.data.icon_img ||
          `https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png`;

      // console.log(element.data);
      element.data.url == null
        ? null
        : (results.innerHTML += `<div class="result">
          <img src="${imageSource}" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">
          ${element.data.url} - ${new Intl.NumberFormat().format(
            element.data.subscribers
          )} subscribers</div>`);
    });
  };

  fetch(
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${s}&raw_json=1&gilding_detail=1`
  )
    .then((response) => response.json())
    .then(showResults);
}

function getNextPost() {
  description.classList.add('loading');
  if (state.currentSubreddit.nextPosts.length) {
    state.currentSubreddit.previousPosts.push(
      state.currentSubreddit.currentPost
    );

    state.currentSubreddit.currentPost = state.currentSubreddit.nextPosts.pop();
    showPost(state.currentSubreddit.currentPost);
  } else {
    downloadNextPost();
  }

  if (
    state.currentSubreddit.previousPosts.length > 0 &&
    state.currentSubreddit.previousPosts.length % 90 === 0
  )
    preloadNextPosts();
}

function getPreviousPost() {
  search.classList.add('loading');
  setTimeout(() => {
    if (state.currentSubreddit.previousPosts.length) {
      state.currentSubreddit.nextPosts.push(state.currentSubreddit.currentPost);

      state.currentSubreddit.currentPost = state.currentSubreddit.previousPosts.pop();
      showPost(state.currentSubreddit.currentPost);
    }
  }, 150);
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
    // console.log('start slide show');
    try {
      if (slideshow !== null) {
        clearInterval(slideshow);
      }
    } catch (e) {}
    slideshow = setInterval(function () {
      downloadNextPost(url);
    }, 5000);
  } else {
    // console.log('stop slide show');
    clearInterval(slideshow);
  }
}

slideshowToggle.addEventListener('click', toggleSlideShow);

range.oninput = function () {
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

      clearInterval(state.preloadingInterval);

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

        state.preloadingInterval && clearInterval(state.preloadingInterval);
        state.previousSubreddit = state.currentSubreddit;

        state.currentSubreddit = {
          name: `https://www.reddit.com/r/${sub}/hot.json?`,
          previousPosts: [],
          currentPost: {},
          nextPosts: [],
          after: '',
          urlsForPreload: [],
          preloadingAfter: '',
        };

        downloadNextPost();
        preloadNextPosts();
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
      results.innerHTML = defaultSubreddits;
    }
    results.classList.remove('hidden');
  }

  if (e.target.className === 'image') {
    results.classList.add('hidden');
  }

  // mouse click
  if (e.target.className === 'result') {
    clearInterval(state.preloadingInterval);
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

      state.preloadingInterval && clearInterval(state.preloadingInterval);
      state.previousSubreddit = state.currentSubreddit;

      state.currentSubreddit = {
        name: `https://www.reddit.com/r/${sub}/hot.json?`,
        previousPosts: [],
        currentPost: {},
        nextPosts: [],
        after: '',
        urlsForPreload: [],
        preloadingAfter: '',
      };

      downloadNextPost();
      preloadNextPosts();
    }
  }

  if (e.target.id === 'closeWelcome') {
    welcome.style.display = 'none';
    search.classList.remove('hidden');
    image.classList.remove('blurred');
    description.classList.remove('hidden');
    menuBtn.classList.remove('hidden');

    preloadNextPosts();
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

async function touchStartHandlerY(e) {
  if (e.target.className.includes('slider')) {
    return;
  }

  if (e.target.className === 'search') {
    search.focus();
    if (results.innerHTML.trim() == '') {
      // results.innerHTML = defaultSubreddits;
    }
    results.classList.remove('hidden');
  }

  if (e.target.className === 'image' || e.target.className === 'video') {
    y.push(e.targetTouches[0].clientY);
    // x.push(e.targetTouches[0].clientX);
    results.classList.add('hidden');
  }

  // touch
  if (e.target.className === 'result') {
    clearInterval(state.preloadingInterval);
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

      state.preloadingInterval && clearInterval(state.preloadingInterval);
      state.previousSubreddit = state.currentSubreddit;

      state.currentSubreddit = {
        name: `https://www.reddit.com/r/${sub}/hot.json?`,
        previousPosts: [],
        currentPost: {},
        nextPosts: [],
        after: '',
        urlsForPreload: [],
        preloadingAfter: '',
      };

      downloadNextPost();
      preloadNextPosts();
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

    preloadNextPosts();
  }
}

function touchMoveHandlerY(e) {
  if (e.target.className.includes('slider')) return;

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
      // results.innerHTML = defaultSubreddits;
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
