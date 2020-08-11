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
var description = document.getElementById('description');
var title = document.getElementById('title');
var a = document.getElementById('a');
var ok = document.getElementById('ok');
var buttons = document.getElementById('buttons');

var close = document.getElementById('close');

var subredditName = '';
var after = '';
var sortedUrl;
var counter = 0;

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
  close.classList.remove('hidden');

  close.addEventListener('click', function () {
    document.location.reload(true);
  });

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
  sortedUrl = `https://www.reddit.com/r/${subredditName}.json?`;

  switch (sortBy) {
    case 'HOT':
      sortedUrl = `https://www.reddit.com/r/${subredditName}.json?`;
      break;
    case 'NEW':
      sortedUrl = `https://www.reddit.com/r/${subredditName}/new.json?`;
      break;
    case 'TOPOFTHEDAY':
      sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=day`;
      break;
    case 'TOPOFTHEWEEK':
      sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=week`;
      break;
    case 'TOPOFTHEMONTH':
      sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=month`;
      break;
    case 'TOPOFTHEYEAR':
      sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=year`;
      break;
    case 'TOPOFALLTIME':
      sortedUrl = `https://www.reddit.com/r/${subredditName}/top.json?t=all`;
      break;
  }

  startMeditation(sortedUrl);
}

var posts = [];
var imgArr = [];
var limit = 1;

function downloadNextPost(url) {
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
      // console.log('OK')
      setTimeout(function () {
        (title.innerText = posts[posts.length - 1]['title']), 250;
      });
      console.log(posts[posts.length - 1]['title']);
      console.log(
        `https://www.reddit.com${posts[posts.length - 1]['permalink']}`
      );
      a.href = `https://www.reddit.com${posts[posts.length - 1]['permalink']}`;
    }
  };
}

function startMeditation(url) {
  close.addEventListener('click', function () {
    document.location.reload(true);
  });

  container.classList.add('hidden');
  image.classList.remove('hidden');

  downloadNextPost(url);
  setTimeout(function () {
    description.classList.remove('hidden');
  }, 800);

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
        console.log(posts[posts.length - 1 - counter]['title']);
        console.log(
          `https://www.reddit.com${
            posts[posts.length - 1 - counter]['permalink']
          }`
        );
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
      console.log(posts[posts.length - 1 - counter]['title']);
      a.href = `https://www.reddit.com${
        posts[posts.length - 1 - counter]['permalink']
      }`;
      console.log(
        `https://www.reddit.com${
          posts[posts.length - 1 - counter]['permalink']
        }`
      );
    }
  }

  var y = [];

  function st(e) {
    e.preventDefault();
    y.push(e.targetTouches[0].clientY);
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
        console.log(posts[posts.length - 1 - counter]['title']);
        console.log(
          `https://www.reddit.com${
            posts[posts.length - 1 - counter]['permalink']
          }`
        );
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
      console.log(posts[posts.length - 1 - counter]['title']);
      a.href = `https://www.reddit.com${
        posts[posts.length - 1 - counter]['permalink']
      }`;
      console.log(
        `https://www.reddit.com${
          posts[posts.length - 1 - counter]['permalink']
        }`
      );
    }
  }

  // Mouse Wheel Scroll
  window.addEventListener('wheel', wheelScroll);

  window.addEventListener('touchstart', st);
  window.addEventListener('touchmove', mo);
  window.addEventListener('touchend', en);
}

chooseSubreddit();
