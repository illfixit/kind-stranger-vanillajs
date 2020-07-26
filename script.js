var container = document.getElementById('container');
var imageContainer = document.getElementById('image-container');
var image = document.getElementById('image');
var text = document.getElementById('text');
var subredditContainer = document.getElementById('subreddit-container');
var subreddit = document.getElementById('subreddit');
var sorting = document.getElementById('sorting');
var sortByHot = document.getElementById('sort-by-hot');
var sortByNew = document.getElementById('sort-by-new');
var sortByTopDay = document.getElementById('sort-by-top-day');
var sortByTopWeek = document.getElementById('sort-by-top-week');
var sortByTopMonth = document.getElementById('sort-by-top-month');
var sortByTopYear = document.getElementById('sort-by-top-year');
var sortByTopAll = document.getElementById('sort-by-top-all');
var ok = document.getElementById('ok');
var buttons = document.getElementById('buttons');

var close = document.getElementById('close');

// var sortBy = 'HOT';
var subredditName = '';
var images = [];
var after = '';
var sortedUrl 

// var currentUrl = window.location.href;
// var params = currentUrl.split('?')[1]
// // console.log(params)
// if(params) {
// 	subredditName = params;
//     subredditName = subredditName.trim();
//     subreddit.value = '';
//     subreddit.classList.add('hidden');
//     buttons.classList.add('hidden');
//     subredditContainer.classList.add('hidden');
//     sorting.classList.remove('hidden');
//     fetchImages(subredditName);
// }  


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

    chooseTypeOfSort(subredditName);
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

    chooseTypeOfSort(subredditName);
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

    chooseTypeOfSort(subredditName);
  });

  subreddit.addEventListener('input', function (e) {});
}


function chooseTypeOfSort(subredditName) {

	  // Event Listeners
 	 sortByHot.addEventListener('click', function () {
    	sorting.classList.add('hidden');
    	container.classList.add('hidden');
    	fetchImages(subredditName, 'HOT');
  	});

 	 sortByNew.addEventListener('click', function () {
    	sorting.classList.add('hidden');
    	container.classList.add('hidden');
    	fetchImages(subredditName, 'NEW');
  	});

 	 sortByTopDay.addEventListener('click', function () {
    	sorting.classList.add('hidden');
    	container.classList.add('hidden');
    	fetchImages(subredditName, 'TOPOFTHEDAY');
  	});

 	 sortByTopWeek.addEventListener('click', function () {
    	sorting.classList.add('hidden');
    	container.classList.add('hidden');
    	fetchImages(subredditName, 'TOPOFTHEWEEK');
  	}); 	 

 	 sortByTopMonth.addEventListener('click', function () {
    	sorting.classList.add('hidden');
    	container.classList.add('hidden');
    	fetchImages(subredditName, 'TOPOFTHEMONTH');
  	}); 	 

 	 sortByTopYear.addEventListener('click', function () {
    	sorting.classList.add('hidden');
    	container.classList.add('hidden');
    	fetchImages(subredditName, 'TOPOFTHEYEAR');
  	}); 	 

 	 sortByTopAll.addEventListener('click', function () {
    	sorting.classList.add('hidden');
    	container.classList.add('hidden');
    	fetchImages(subredditName, 'TOPOFALLTIME');
  	}); 	 
}



function fetchImages(subredditName, sortBy) {

  sortedUrl = `https://www.reddit.com/r/${subredditName}.json`

  switch(sortBy) {
    case 'HOT' : sortedUrl = `https://www.reddit.com/r/${subredditName}.json`
    break;
    case 'NEW' : sortedUrl = `https://www.reddit.com/r/${subredditName}/new.json`
    break;
    case 'TOPOFTHEDAY' : sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=day`
    break;
    case 'TOPOFTHEWEEK' : sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=week`
    break;
    case 'TOPOFTHEMONTH' : sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=month`
    break;
    case 'TOPOFTHEYEAR' : sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=year`
    break;
    case 'TOPOFALLTIME' : sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=all`
    break;
  }

  var sortedXhr = new XMLHttpRequest();
  sortedXhr.open('GET', sortedUrl);
  sortedXhr.responseType = 'json';
  sortedXhr.send();
  sortedXhr.onload = function () {
    var responseObj = sortedXhr.response.data.children;
    after = sortedXhr.response.data.after;

    responseObj.forEach(function (post) {
      if (post.data.preview.images[0].resolutions[3] && !post.data.is_video) {
        images.push(
          post.data.preview.images[0].resolutions[3].url.replace(/amp;/gi, '')
        );
      }
    });

    startMeditation(sortedUrl)
  };
}

function downloadMoreImages(url) {
  // console.log('More');
  var moreXhr = new XMLHttpRequest();
  moreXhr.open(
    'GET',
    `${url}?after=${after}`
  );
  moreXhr.responseType = 'json';
  moreXhr.send();
  moreXhr.onload = function () {
    var moreResponseObj = moreXhr.response.data.children;
    after = moreXhr.response.data.after;
    moreResponseObj.forEach(function (post) {
      if (post.data.preview.images[0].resolutions[3] && !post.data.is_video) {
        images.push(
          post.data.preview.images[0].resolutions[3].url.replace(/amp;/gi, '')
        );
      }
    });
  };
}

function startMeditation(url) {
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
      downloadMoreImages(url);
    }
  }, 5000);
}

chooseSubreddit();

// xhr.open(
//   'GET',
//   `https://www.reddit.com/r/${subredditName}/top.json?t=all&after=${afterTop}`
// );

// xhr.open(
//   'GET',
//   `https://www.reddit.com/r/${subredditName}/top.json?t=day&after=${afterTop}`
// );

// xhr.open(
//   'GET',
//   `https://www.reddit.com/r/${subredditName}/top.json?t=week&after=${afterTop}`
// );

// xhr.open(
//   'GET',
//   `https://www.reddit.com/r/${subredditName}/top.json?t=month&after=${afterTop}`
// );

// xhr.open(
//   'GET',
//   `https://www.reddit.com/r/${subredditName}/new.json&after=${afterTop}`
// );
