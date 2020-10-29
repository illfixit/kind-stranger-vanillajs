var search = document.getElementById('search');
var image = document.getElementById('image');
var video = document.getElementById('video');
var description = document.getElementById('description');
var results = document.getElementById('results');
var title = document.getElementById('title');
var test = document.getElementById('test');

var close = document.getElementById('close');
var screenToggle = document.getElementById('screenToggle');

var welcome = document.getElementById('welcome');

// welcome.addEventListener('click', function(e){ alert('Hello') });

var counter = 0;

var basicSubreddits = `
<div class="result">
<img src="https://styles.redditmedia.com/t5_2r1tc/styles/communityIcon_p1gzakhq6y201.png" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">/r/itookapicture/</div>
<div class="result">
<img src="https://styles.redditmedia.com/t5_2qh1o/styles/communityIcon_vzx333xor7101.png" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">/r/aww/</div>
<div class="result">
<img src="https://b.thumbs.redditmedia.com/VoZlOfOxgNGkqayUrmGI96XuSOGKVT-MVI4WK-CXP3o.png" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">/r/art/</div>
<div class="result">
<img src="https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">/r/cozyplaces/</div>
<div class="result">
<img src="https://a.thumbs.redditmedia.com/bDWcvO6mkX1TIcTnrO-N-5QJPUaWaq6nnQFel3kywD8.png" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">/r/food/</div>
`;

results.innerHTML = basicSubreddits;

// debugger;

function reload() {
  document.location.reload();
}

function closeWelcomeScreen() {
  welcome.style.display = 'none';
  search.classList.remove('hidden');
  image.classList.remove('blurred');
  description.classList.remove('hidden');
  close.classList.remove('hidden');
  // document.getElementById('swipe').classList.remove('hidden');
}



close.addEventListener('click', reload);

image.classList.remove('hidden');

var startUrl = `https://www.reddit.com/r/itookapicture/hot.json?`;
var after = '';
var posts = [];

(function () {
  url = startUrl;
  downloadNextPost(startUrl);
})();

function downloadNextPost(url) {
  var nextPost = new XMLHttpRequest();
  nextPost.open('GET', `${url}&limit=1&after=${after}`);

  nextPost.responseType = 'json';
  nextPost.send();

  nextPost.onerror = function (e) {
    // console.log(e);
    setTimeout(function () {
      document.location.reload();
    }, 1000);
  };

  nextPost.onload = function () {
    after = nextPost.response.data.after;
    var post = nextPost.response.data.children[0].data;
    console.log(post);
    // console.log(post.preview.images[0]);



    try {
    if (post.preview.images[0] != null || post.domain.includes('imgur') || post.url.includes('jpg')) {
      // if(!post.domain.includes('gfycat') && !post.url.includes('gfycat') && !post.url.includes('youtu')) {
      if(!post.url.includes('youtu')) {
      
        posts.push(post);
        // console.log(post);
        showPost(post);
        // console.log("push!", post.url)
      } else {
        console.log('next');
        downloadNextPost(url);
      }

    } else {
      console.log('next');
      downloadNextPost(url);
    }
  } catch (e) {
    console.log('next');
    downloadNextPost(url);
  }
  };
}





 function showPost(post) {
  try {
    image.src = post.preview.images[0].resolutions[post.preview.images[0].resolutions.length-1].url.replace(
      /amp;/gi,
      ''
    );
    video.classList.add('hidden');

    if(post.crosspost_parent != null) {
      console.log("post.crosspost_parent")
      post = post.crosspost_parent_list[0]

      if(post.url.includes("gfycat")) {
        console.log(post.secure_media.oembed.thumbnail_url)
        image.src = post.secure_media.oembed.thumbnail_url
      } else if (post.url.includes("redgif")) {
        video.src = post.preview.reddit_video_preview.fallback_url;
        video.classList.remove('hidden');
      } else if (post.url.includes('redd') && post.url.includes('.gif')) {
      	image.src = post.url;
        // video.classList.remove('hidden');

      } else {
      if(post.url.includes(".gifv") && !post.url.includes('redd')) {
        video.src = post.url.replace('gifv', 'mp4');
        video.classList.remove('hidden');
      } else if (post.url.includes(".gif") && !post.url.includes('redd')) {
        video.src = post.url.replace('gif', 'mp4');
        video.classList.remove('hidden');
      } else {
        if(post.media.reddit_video != null) {
          video.src = post.media.reddit_video.fallback_url;
          video.classList.remove('hidden');
        } else {
          video.classList.add('hidden');
        }
      	}
  		}
    } else {
      if(post.url.includes("gfycat")) {
        console.log(post.secure_media.oembed.thumbnail_url)
        image.src = post.secure_media.oembed.thumbnail_url
      } else if (post.url.includes("redgif")) {
        video.src = post.preview.reddit_video_preview.fallback_url;
        video.classList.remove('hidden');
      } else if (post.url.includes('redd') && post.url.includes('.gif')) {
      	image.src = post.url;
      } else {
      if(post.url.includes(".gifv") && !post.url.includes('redd')) {
      video.src = post.url.replace('gifv', 'mp4');
      video.classList.remove('hidden');
    } else if (post.url.includes(".gif") && !post.url.includes('redd')) {
      video.src = post.url.replace('gif', 'mp4');
      video.classList.remove('hidden');
    } else {
      if(post.media.reddit_video != null) {
        video.src = post.media.reddit_video.fallback_url;
        video.classList.remove('hidden');
      } else {
        video.classList.add('hidden');
      }
    }
  }
}
  } catch (e) {
      console.log('next');
      //  downloadNextPost(url);
      // showPost(posts[posts.length-1]);
  }
  title.innerText = post['title'].trim();
  // title.innerText = post['title'].trim();
  a.href = `https://www.reddit.com${posts[posts.length - 1]['permalink']}`;
}


function searchSubreddits(s) {
  var listOfSubreddits = new XMLHttpRequest();
  listOfSubreddits.open(
    'GET',
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${s}&raw_json=1&gilding_detail=1`
  );

  listOfSubreddits.responseType = 'json';
  listOfSubreddits.send();

  listOfSubreddits.onerror = function (e) {
    console.log(e);
  };

  listOfSubreddits.onload = function () {
    results.innerHTML = '';

    var list = listOfSubreddits.response.data.children;

    list.forEach(function (element) {
      var imageSource = element.data.community_icon
        ? element.data.community_icon
        : element.data.icon_img ||
          `https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png`;

      // console.log(element.data.url, imageSource);
      element.data.url == null
        ? null
        : (results.innerHTML += `<div class="result">
        <img src="${imageSource}" style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem;">
        ${element.data.url}</div>`);
    });
  };
}

var y = [];
var x = [];
var previousTouch = 0;

//  function touchStartHandlerX(e) {

//   previousTouch = e.timeStamp

//   if (e.target.className === 'search') {
//     search.focus();
//     if (results.innerHTML.trim() == '') {
//       results.innerHTML = basicSubreddits;
//     }
//     results.classList.remove('hidden');
//   }

//   if (e.target.className === 'image') {
//     // e.preventDefault();
//     x.push(e.targetTouches[0].clientX);
//     results.classList.add('hidden');
//     // console.log(url);
//     // if(counter = 0) {  downloadNextPost(url)};
//   }

//   if (e.target.className === 'result') {
//     var sub = e.target.innerText;
//     counter = 0;
//     posts = [];
//     after = '';
//     search.value = '';
//     results.classList.add('hidden');
//     url = `https://www.reddit.com${sub.trim()}hot.json?`;
//     results.innerHTML = '';
//     downloadNextPost(url);
//   }

//   if (e.target.className === 'close') {
//     document.location.reload();
//   }
// }

// function touchMoveHandlerX(e) {
//   x.push(e.targetTouches[0].clientX);
  
//   // image.style.transform = `translateX(${(x[x.length - 1] - x[0])/5}px)`;
// }

//  function touchEndHandlerX(e) {
//   var delta = x[0] - x[x.length - 1];
//   x = [];

//   if (delta > 0) {
//     getNextPost();
//   } else if (delta < 0) {
//     getPreviousPost();
//   }
// }


function touchStartHandlerY(e) {

  previousTouch = e.timeStamp

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
    // console.log(url);
    // if(counter = 0) {  downloadNextPost(url)};
  }

  if (e.target.className === 'result') {
    var sub = e.target.innerText;
    counter = 0;
    posts = [];
    after = '';
    search.value = '';
    results.classList.add('hidden');
    url = `https://www.reddit.com${sub.trim()}hot.json?`;
    results.innerHTML = '';
    downloadNextPost(url);
  }

  if (e.target.className === 'close') {
    document.location.reload();
  }
}

function touchMoveHandlerY(e) {
  y.push(e.targetTouches[0].clientY);

}

 function touchEndHandlerY(e) {
  var deltaY = y[0] - y[y.length - 1];


  y = [];


  if (deltaY > 0) {
    getNextPost();
  } else if (deltaY < 0) {
    getPreviousPost();
  }
}






 function getNextPost() {
  // image.style.opacity = "1";
  // console.log('getNextPost, counter=', counter,'posts.length=',posts.length);
  if(counter > 0){
    counter--;
    // console.log('counter', counter,'index',(posts.length - counter - 1))
    showPost(posts[posts.length - counter - 1]);
  } else {
    downloadNextPost(url);
  } 
}

function getPreviousPost() {
  // image.style.opacity = "0.5";
  counter++;
  if(counter > posts.length-1) {
    counter = posts.length-1;
  }
  // console.log(counter)
  showPost(posts[posts.length - counter - 1]);
}

// window.addEventListener('touchstart', touchStartHandlerX);
// window.addEventListener('touchmove', touchMoveHandlerX);
// window.addEventListener('touchend', touchEndHandlerX);

window.addEventListener('touchstart', touchStartHandlerY);
window.addEventListener('touchmove', touchMoveHandlerY);
// window.addEventListener('touchmove', touchMoveHandlerX);
window.addEventListener('touchend', touchEndHandlerY);

welcome.addEventListener('click', closeWelcomeScreen);

// Mouse Wheel Scroll
// window.addEventListener('wheel', wheelScroll);


search.addEventListener('input', function (e) {
  searchSubreddits(e.target.value);
  results.classList.remove('hidden');
});

window.addEventListener('click', clickHandler)

window.addEventListener('keydown', keyboardButtonsHandler);

function keyboardButtonsHandler(e) {
  // console.log(e)
  if (e.which == 13 || e.keyCode == 13 || e.key === 'Enter') {
    if (search.value.trim()) {
      counter = 0;
      posts = [];
      after = '';
      results.classList.add('hidden');
      url = `https://www.reddit.com/r/${search.value.trim()}/hot.json?`;
      search.value = '';
       downloadNextPost(url);
    } 
  } else if (e.which == 39 || e.keyCode == 39 || e.key === 'ArrowDown' || e.which == 40 || e.keyCode == 40 || e.key === 'ArrowRight') {
    if(counter > 0){
      counter--;
      showPost(posts[posts.length - counter - 1]);
    } else {
      downloadNextPost(url);
    } 
  } else if (e.which == 37 || e.keyCode == 37 || e.key === 'ArrowLeft' || e.which == 38 || e.keyCode == 38 || e.key === 'ArrowUp') {
    counter++;
    if(counter > posts.length-1) {
      counter = posts.length-1;
    }
    // console.log(counter)
    showPost(posts[posts.length - counter - 1]);
  } else if (e.which == 75 || e.keyCode == 75 || e.key === 'k') {
    if (image.style.objectFit != 'contain') {
      image.style.objectFit = 'contain';
    } else {
      image.style.objectFit = 'cover';
    }
  }
}

function clickHandler(e) {
  // console.log(e);

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

  if (e.target.className === 'result') {
    var sub = e.target.innerText;
    counter = 0;
    posts = [];
    after = '';
    search.value = '';
    results.classList.add('hidden');
    url = `https://www.reddit.com${sub.trim()}hot.json?`;
    results.innerHTML = '';
    downloadNextPost(url);
  }
}

function wheelScroll(e) {
  // console.log(e)
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


// Mouse Wheel Scroll
window.addEventListener('wheel', wheelScroll);

function scaleChange(e) {
  if (image.style.objectFit != 'contain') {
    image.style.objectFit = 'contain';
    video.style.objectFit = 'contain';
  } else {
    image.style.objectFit = 'cover';
    video.style.objectFit = 'cover';
  }
}

image.addEventListener('dblclick', scaleChange);
video.addEventListener('dblclick', scaleChange);

image.addEventListener('mousemove', function(e){ 
  image.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
  video.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
})

video.addEventListener('mousemove', function(e){ 
  image.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
  video.style.objectPosition = `${(((e.clientX/window.innerWidth))*100).toFixed(5)}%`
})
