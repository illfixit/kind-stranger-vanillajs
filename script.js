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
var images = [];
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
  // Promise Hot
  // var promise = new Promise(function(resolve, reject) {
  //   var xhrHot = new XMLHttpRequest();
  //   xhrHot.open(
  //     'GET',
  //     `https://www.reddit.com/r/${subredditName}.json?limit=100`
  //   );
  //   xhrHot.responseType = 'json';
  //   xhrHot.send();
  // })

  // Sort by Hot
  var xhrHot = new XMLHttpRequest();
  xhrHot.open('GET', `https://www.reddit.com/r/${subredditName}.json`);
  xhrHot.responseType = 'json';
  xhrHot.send();
  xhrHot.onload = function () {
    var responseObj = xhrHot.response.data.children;
    afterHot = xhrHot.response.data.after;

    responseObj.forEach(function (post) {
      // console.log(post.data.preview);
      if (post.data.preview.images[0].resolutions[3] && !post.data.is_video) {
        images.push(
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
}

function downloadMoreImages(s) {
  // console.log('More');
  var moreXhr = new XMLHttpRequest();
  moreXhr.open(
    'GET',
    `https://www.reddit.com/r/${subredditName}.json?after=${afterHot}`
  );
  moreXhr.responseType = 'json';
  moreXhr.send();
  moreXhr.onload = function () {
    var moreResponseObj = moreXhr.response.data.children;
    afterHot = moreXhr.response.data.after;
    moreResponseObj.forEach(function (post) {
      if (post.data.preview.images[0].resolutions[3] && !post.data.is_video) {
        images.push(
          post.data.preview.images[0].resolutions[3].url.replace(/amp;/gi, '')
        );
      }
    });
  };
}

function startMeditation(s) {
  close.classList.remove('hidden');
  // var speedInMs = 6000;

  close.addEventListener('click', function () {
    document.location.reload(true);
  });

  var i = 0;

  image.classList.remove('hidden');

  setInterval(function () {
    var img = new Image();
    img.src = images[i];
    i++;
    img.onload = function () {
      // console.log('OK');
      image.src = images[i];
    };
    img.onerror = function () {
      // console.log('Not OK');
      i++;
    };

    // image.src = images[i];
    // i++;

    if (i > images.length - 2) {
      downloadMoreImages(s);
    }
  }, 5000);
}

chooseSubreddit();

// xhr.open(
//   'GET',
//   `https://www.reddit.com/r/${subredditName}/top.json?t=all&after=${afterTop}`
// );
