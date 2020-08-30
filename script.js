var search = document.getElementById('search');
var image = document.getElementById('image');
var description = document.getElementById('description');
var results = document.getElementById('results');
var title = document.getElementById('title');
var test = document.getElementById('test');

var close = document.getElementById('close');
var screenToggle = document.getElementById('screenToggle');

var counter = 0;

var basicSubreddits = `
<div class="result">
<img src="https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png" style="width: 1.5rem; height: 1.5rem;">/r/itookapicture/</div>
<div class="result">
<img src="https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png" style="width: 1.5rem; height: 1.5rem;">/r/aww/</div>
<div class="result">
<img src="https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png" style="width: 1.5rem; height: 1.5rem;">/r/art/</div>
<div class="result">
<img src="https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png" style="width: 1.5rem; height: 1.5rem;">/r/cozyplaces/</div>
<div class="result">
`;

results.innerHTML = basicSubreddits;

window.addEventListener('keydown', function (e) {
  if (e.which == 13 || e.keyCode == 13 || e.key === 'Enter') {
    if (search.value) {
      counter = 0;
      posts = [];
      after = '';
      results.classList.add('hidden');
      url = `https://www.reddit.com/r/${search.value}/hot.json?`;
      search.value = '';
      downloadNextPost(url);
    }
  }
});

close.classList.remove('hidden');
// close.addEventListener('click', function () {
//   document.location.reload(true);
// });

image.classList.remove('hidden');

var startUrl = `https://www.reddit.com/r/mobilewallpapers.json?`;
var after = '';
var posts = [];

function start() {
  downloadNextPost(startUrl);
  url = startUrl;
  setTimeout(function () {
    description.classList.remove('hidden');
  }, 500);
}

start();

function downloadNextPost(url) {
  // console.log(`downloadNextPost(url) => ${url}&limit=1&after=${after}`);
  // test.innerText = `${url}&limit=1&after=${after}`;
  var nextPost = new XMLHttpRequest();
  nextPost.open('GET', `${url}&limit=1&after=${after}`);

  nextPost.responseType = 'json';
  nextPost.send();

  nextPost.onerror = function (e) {
    console.log(e);
    setTimeout(function () {
      document.location.reload(true);
    }, 1000);
  };

  nextPost.onload = function () {
    after = nextPost.response.data.after;
    var post = nextPost.response.data.children[0];

    if (!post.data.preview) {
      console.log('next');
      downloadNextPost(url);
    } else {
      posts.push(post.data);
      // console.log(posts)
      if (!post.data.preview.images[0].resolutions[3]) {
        console.log('next');
        downloadNextPost(url);
      }
      image.src = post.data.preview.images[0].resolutions[3].url.replace(
        /amp;/gi,
        ''
      );
      setTimeout(function () {
        (title.innerText = posts[posts.length - 1]['title'].trim()), 250;
      });
      a.href = `https://www.reddit.com${posts[posts.length - 1]['permalink']}`;
    }
  };
}

function searchSubreddits(s) {
  // console.log(s);
  var listOfSubreddits = new XMLHttpRequest();
  listOfSubreddits.open(
    'GET',
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${s}&raw_json=1&gilding_detail=1&limit=10`
  );

  listOfSubreddits.responseType = 'json';
  listOfSubreddits.send();

  listOfSubreddits.onerror = function (e) {
    console.log(e);
    // setTimeout(function () {
    //   document.location.reload(true);
    // }, 1000);
  };

  listOfSubreddits.onload = function () {
    results.innerHTML = '';
    // console.log(listOfSubreddits.response.data.children);

    var list = listOfSubreddits.response.data.children;

    list.forEach(function (element) {
      var imageSource = element.data.community_icon
        ? element.data.community_icon
        : `https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png`;

      element.data.url == null
        ? null
        : (results.innerHTML += `<div class="result">
        <img src="${imageSource}" style="width: 1.5rem; height: 1.5rem;">
        ${element.data.url}</div>`);
    });
  };
}

function hello(e) {
  counter = 0;
  posts = [];
  after = '';
  search.value = '';
  results.classList.add('hidden');
  url = `https://www.reddit.com${e.innerText.trim()}hot.json?`;
  downloadNextPost(url);
}

document.addEventListener('dblclick', function () {
  if (image.style.objectFit !== 'contain') {
    image.style.objectFit = 'contain';
  } else {
    image.style.objectFit = 'cover';
  }
});

function wheelScroll(e) {
  if (event.deltaY > 0) {
    if (counter > 0) {
      counter--;
      if (counter > posts.length - 1) {
        counter = posts.length - 2;
      }
      image.src = posts[
        posts.length - 1 - counter
      ].preview.images[0].resolutions[3].url.replace(/amp;/gi, '');
      // console.log('OK')
      setTimeout(function () {
        (title.innerText = posts[posts.length - 1 - counter]['title']), 250;
      });
      // console.log(posts[posts.length - 1 - counter]['title']);
      // console.log(
      //   `https://www.reddit.com${
      //     posts[posts.length - 1 - counter]['permalink']
      //   }`
      // );
      a.href = `https://www.reddit.com${
        posts[posts.length - 1 - counter]['permalink']
      }`;
    } else {
      counter = 0;
      window.removeEventListener('wheel', wheelScroll);
      setTimeout(function () {
        window.addEventListener('wheel', wheelScroll);
      }, 300);
      downloadNextPost(url);
    }
  } else if (event.deltaY < 0) {
    window.removeEventListener('wheel', wheelScroll);
    setTimeout(function () {
      window.addEventListener('wheel', wheelScroll);
    }, 300);
    counter++;
    // console.log(posts[posts.length-1-counter].preview.images[0].resolutions[3].url.replace(/amp;/gi,''));
    image.src = posts[
      posts.length - 1 - counter
    ].preview.images[0].resolutions[3].url.replace(/amp;/gi, '');
    // console.log('OK')
    setTimeout(function () {
      (title.innerText = posts[posts.length - 1 - counter]['title']), 250;
    });
    // console.log(posts[posts.length - 1 - counter]['title']);
    a.href = `https://www.reddit.com${
      posts[posts.length - 1 - counter]['permalink']
    }`;
    // console.log(
    //   `https://www.reddit.com${posts[posts.length - 1 - counter]['permalink']}`
    // );
  }
}

var y = [];

search.addEventListener('input', function (e) {
  results.classList.remove('hidden');
  searchSubreddits(e.target.value);
});

function st(e) {
  // test.innerText = e.target.className;

  if (e.target.className === 'search') {
    search.focus();
    // console.log('search');
    if (results.innerHTML == '') {
      results.innerHTML = basicSubreddits;
    }
    results.classList.remove('hidden');
  }

  if (e.target.className === 'image') {
    // results.classList.add('hidden');
    e.preventDefault();
    y.push(e.targetTouches[0].clientY);
  }

  if (e.target.className === 'result') {
    // test.innerText = 'result';
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
    document.location.reload(true);
  }
}

function mo(e) {
  y.push(e.targetTouches[0].clientY);
}

function en(e) {
  var delta = y[0] - y[y.length - 1];
  y = [];

  if (delta > 0) {
    if (counter > 0) {
      counter--;
      if (counter > posts.length - 1) {
        counter = posts.length - 2;
      }
      image.src = posts[
        posts.length - 1 - counter
      ].preview.images[0].resolutions[3].url.replace(/amp;/gi, '');
      // console.log('OK')
      setTimeout(function () {
        (title.innerText = posts[posts.length - 1 - counter]['title']), 250;
      });
      // console.log(posts[posts.length - 1 - counter]['title']);
      // console.log(
      //   `https://www.reddit.com${
      //     posts[posts.length - 1 - counter]['permalink']
      //   }`
      // );
      a.href = `https://www.reddit.com${
        posts[posts.length - 1 - counter]['permalink']
      }`;
    } else {
      counter = 0;
      window.removeEventListener('wheel', wheelScroll);
      setTimeout(function () {
        window.addEventListener('wheel', wheelScroll);
      }, 300);
      downloadNextPost(url);
    }
  } else if (delta < 0) {
    window.removeEventListener('wheel', wheelScroll);
    setTimeout(function () {
      window.addEventListener('wheel', wheelScroll);
    }, 300);
    counter++;
    // console.log(posts[posts.length-1-counter].preview.images[0].resolutions[3].url.replace(/amp;/gi,''));
    image.src = posts[
      posts.length - 1 - counter
    ].preview.images[0].resolutions[3].url.replace(/amp;/gi, '');
    // console.log('OK')
    setTimeout(function () {
      (title.innerText = posts[posts.length - 1 - counter]['title']), 250;
    });
    // console.log(posts[posts.length - 1 - counter]['title']);
    a.href = `https://www.reddit.com${
      posts[posts.length - 1 - counter]['permalink']
    }`;
    // console.log(
    //   `https://www.reddit.com${posts[posts.length - 1 - counter]['permalink']}`
    // );
  }
}

// Mouse Wheel Scroll
window.addEventListener('wheel', wheelScroll);

window.addEventListener('touchstart', st);
window.addEventListener('touchmove', mo);
window.addEventListener('touchend', en);
<<<<<<< HEAD
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
=======
>>>>>>> f098ec638cc5146ba4e61edfa4d52fe3a2a0e444
