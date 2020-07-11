var container = document.getElementById('container');
var imageContainer = document.getElementById('image-container');
var image = document.getElementById('image');
var text = document.getElementById('text');
var subredditContainer = document.getElementById('subreddit-container');
var subreddit = document.getElementById('subreddit');
var sorting = document.getElementById('sorting');
var sortByHot = document.getElementById('sort-by-hot');
var sortByTop = document.getElementById('sort-by-top');
var ok = document.getElementById('ok');
var buttons = document.getElementById('buttons');

var close = document.getElementById('close');

var subredditName = '';
var hotImages = [];
var topImages = [];
var afterTop = '';
var afterHot = '';

function chooseSubreddit() {
  subreddit.addEventListener('keydown', function (e) {
    if (e.which == 13 || e.keyCode == 13 || e.key === 'Enter') {
      if (subreddit.value) {
        subredditName = subreddit.value.trim();
        subreddit.value = '';
        subreddit.classList.add('hidden');
        buttons.classList.add('hidden');
        subredditContainer.classList.add('hidden');
        sorting.classList.remove('hidden');

        fetchImages(subredditName);
      }
    }
  });

  ok.addEventListener('click', function () {
    if (subreddit.value) {
      subredditName = subreddit.value.trim();
      subreddit.value = '';
      subreddit.classList.add('hidden');
      buttons.classList.add('hidden');
      subredditContainer.classList.add('hidden');
      sorting.classList.remove('hidden');

      fetchImages(subredditName);
    }
  });

  buttons.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON');
    subredditName = e.target.id;
    subreddit.value = '';
    subreddit.classList.add('hidden');
    buttons.classList.add('hidden');
    subredditContainer.classList.add('hidden');
    sorting.classList.remove('hidden');
    // alert(subredditName);

    fetchImages(subredditName);
  });

  subreddit.addEventListener('input', function (e) {});
}

function fetchImages(subredditName) {
  // Sort by Hot
  var xhrHot = new XMLHttpRequest();
  xhrHot.open(
    'GET',
    `https://www.reddit.com/r/${subredditName}.json?limit=100`
  );
  xhrHot.responseType = 'json';
  xhrHot.send();
  xhrHot.onload = function () {
    // console.log(xhrHot.response);
    var responseObj = xhrHot.response.data.children;
    afterHot = xhrHot.response.data.after;

    responseObj.forEach(function (post) {
      // console.log(post.data.preview);
      if (
        post.data.preview &&
        !post.data.is_video
        // &&
        // post.data.preview.images[0].resolutions[0].height /
        //   post.data.preview.images[0].resolutions[0].width >
        //   1.3
      ) {
        hotImages.push(
          post.data.preview.images[0].resolutions[3].url.replace(/amp;/gi, '')
        );
      }
    });
  };

  // Sort by Top
  var xhrTop = new XMLHttpRequest();
  xhrTop.open(
    'GET',
    `https://www.reddit.com/r/${subredditName}/top.json?t=all&limit=100`
  );
  xhrTop.responseType = 'json';
  xhrTop.send();
  xhrTop.onload = function () {
    // console.log(xhrTop.response);
    var responseObj = xhrTop.response.data.children;
    afterTop = xhrHot.response.data.after;
    responseObj.forEach(function (post) {
      if (
        post.data.preview &&
        !post.data.is_video
        // && post.data.preview.images[0].resolutions[0].height /
        //   post.data.preview.images[0].resolutions[0].width >
        //   1.3
      ) {
        topImages.push(
          post.data.preview.images[0].resolutions[3].url.replace(/amp;/gi, '')
        );
      }
    });
  };

  sortByHot.addEventListener('click', function () {
    sorting.classList.add('hidden');
    container.classList.add('hidden');
    startMeditation('hot');
  });

  sortByTop.addEventListener('click', function () {
    sorting.classList.add('hidden');
    container.classList.add('hidden');
    startMeditation('top');
  });
}

function downloadMoreImages(s) {
  var xhr;
  if (s === 'hot') {
    xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      `https://www.reddit.com/r/${subredditName}.json?after=${afterHot}`
    );
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
      // console.log(xhr.response);
      var responseObj = xhr.response.data.children;
      responseObj.forEach(function (post) {
        if (post.data.preview && !post.data.is_video) {
          // console.log(post.data.preview.images[0].resolutions[3].url);
          hotImages.push(
            post.data.preview.images[0].resolutions[3].url.replace(/amp;/gi, '')
          );
        }
      });
    };
  } else if (s === 'top') {
    xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      `https://www.reddit.com/r/${subredditName}/top.json?t=all&after=${afterTop}`
    );
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
      // console.log(xhr.response);
      var responseObj = xhr.response.data.children;
      responseObj.forEach(function (post) {
        if (post.data.preview && !post.data.is_video) {
          // console.log(post.data.preview.images[0].resolutions[3].url);
          topImages.push(
            post.data.preview.images[0].resolutions[3].url.replace(/amp;/gi, '')
          );
        }
      });
    };
  }
}

function startMeditation(s) {
  close.classList.remove('hidden');
  // var speedInMs = 6000;

  if (s === 'hot') {
    images = hotImages;
    topImages = [];
  } else if (s === 'top') {
    images = topImages;
    hotImages = [];
  }

  close.addEventListener('click', function () {
    document.location.reload(true);
  });

  var i = 0;

  image.classList.remove('hidden');

  setInterval(function () {
    image.src = images[i];
    i++;

    if (i > images.length - 2) {
      downloadMoreImages(s);
    }
  }, 5000);
}

chooseSubreddit();
