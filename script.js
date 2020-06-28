const container = document.getElementById('container');
      const imageContainer = document.getElementById('image-container');
      const image = document.getElementById('image');
      const nextImage = document.getElementById('next-image');
      const text = document.getElementById('text');
      const subredditContainer = document.getElementById('subreddit-container');
      const subreddit = document.getElementById('subreddit');
      const sorting = document.getElementById('sorting');
      const sortByHot = document.getElementById('sort-by-hot');
      const sortByTop = document.getElementById('sort-by-top');
      const ok = document.getElementById('ok');
      const breath = document.getElementById('breath');
      const buttons = document.getElementById('buttons');
      const faster = document.getElementById('faster');
      const slower = document.getElementById('slower');
      const close = document.getElementById('close');

      let subredditName = '';
      let hotImages = [];
      let topImages = [];
      let afterTop = '';
      let afterHot = '';

      let hotResult;
      let topResult;

      function chooseSubreddit() {
        // breath.classList.add('grow');

        subreddit.addEventListener('keydown', (e) => {
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

        ok.addEventListener('click', () => {
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

        buttons.addEventListener('click', (e)=> {
          if (e.target.tagName === 'BUTTON');
            subredditName = e.target.id;
            subreddit.value = '';
            subreddit.classList.add('hidden');
            buttons.classList.add('hidden');
            subredditContainer.classList.add('hidden');
            sorting.classList.remove('hidden');

            fetchImages(subredditName);
        })


        subreddit.addEventListener('input', (e) => {});
      }

      function fetchImages(subredditName) {
        hotResult = fetch(
          `https://www.reddit.com/r/${subredditName}.json?limit=100`
        )
          .then((res) => res.json())
          .then((data) => {
            afterHot = data.data.after;
            return data.data.children.map((data) => data.data);
          })
          .then((results) => {
            results.forEach((post) => {
              if (post.preview) {
                hotImages.push(
                  post.preview.images[0].source.url.replace(/amp;/gi, '')
                );
                // let index =  Math.floor(post.preview.images[0].resolutions.length/2);
                // console.log(index);
                // hotImages.push(post.preview.images[0].resolutions[index].url.replace(/amp;/gi,""))
              }
            });
          });

        topResult = fetch(
          `https://www.reddit.com/r/${subredditName}/top.json?t=all&limit=100`
        )
          .then((res) => res.json())
          .then((data) => {
            afterHot = data.data.after;
            return data.data.children.map((data) => data.data);
          })
          .then((results) => {
            results.forEach((post) => {
              afterTop = results[results.length - 1].name;
              if (post.preview) {
                topImages.push(
                  post.preview.images[0].source.url.replace(/amp;/gi, '')
                );
                // let index =  Math.floor(post.preview.images[0].resolutions.length/2);
                // topImages.push(post.preview.images[0].resolutions[index].url.replace(/amp;/gi,""))
              }
            });
          });

        sortByHot.addEventListener('click', () => {
          sorting.classList.add('hidden');
          container.classList.add('hidden');
          startMeditation(hotResult, 'hot');
        });

        sortByTop.addEventListener('click', () => {
          sorting.classList.add('hidden');
          container.classList.add('hidden');
          startMeditation(topResult, 'top');
        });
      }

      function downloadMoreImages(s) {
        console.log(s, afterHot);
        if (s === 'hot') {
          fetch(
            `https://www.reddit.com/r/${subredditName}.json?after=${afterHot}`
          )
            .then((res) => res.json())
            .then((data) => {
              return data.data.children.map((data) => data.data);
            })
            .then((results) => {
              results.forEach((post) => {
                console.log(post);
                afterHot = results[results.length - 1].name;
                if (post.preview) {
                  // hotImages.push(post.preview.images[0].source.url.replace(/amp;/gi,""))
                  let index = Math.floor(
                    post.preview.images[0].resolutions.length / 2
                  );
                  // console.log(index);
                  hotImages.push(
                    post.preview.images[0].resolutions[index].url.replace(
                      /amp;/gi,
                      ''
                    )
                  );
                }
              });
            });
        } else if (s === 'top') {
          fetch(
            `https://www.reddit.com/r/${subredditName}/top.json?t=all&after=${afterTop}`
          )
            .then((res) => res.json())
            .then((data) => {
              return data.data.children.map((data) => data.data);
            })
            .then((results) => {
              results.forEach((post) => {
                if (post.preview) {
                  console.log(post);
                  // topImages.push(post.preview.images[0].source.url.replace(/amp;/gi,""))
                  let index = Math.floor(
                    post.preview.images[0].resolutions.length / 2
                  );
                  topImages.push(
                    post.preview.images[0].resolutions[index].url.replace(
                      /amp;/gi,
                      ''
                    )
                  );
                }
              });
            });
        }
      }

      function startMeditation(result, s) {
        close.classList.remove('hidden');
        let speedInMs = 6000;
        breath.style.transition = 'height 6s ease-in-out'
        faster.classList.remove('hidden');
        slower.classList.remove('hidden');

        if (s === 'hot') {
          images = hotImages;
          topImages = [];
        } else if (s === 'top') {
          images = topImages;
          hotImages = [];
        }

        close.addEventListener('click', () => {
          document.location.reload(true);
        });

        faster.addEventListener('click', () => {
          speedInMs = speedInMs - 1000;
          console.log(speedInMs);
          breath.style.transition = `height ${ speedInMs / 1000 }s ease-in-out`
          console.log(speedInMs, breath.style.transition)
        })

        slower.addEventListener('click', () => {
          speedInMs = speedInMs + 1000;
          console.log(speedInMs);
          breath.style.transition = `height ${ speedInMs / 1000 }s ease-in-out`
          console.log(speedInMs, breath.style.transition)
        })

        // text.innerText = '';
        let i = 0;

        result.then(() => {
          image.src = images[0];
          nextImage.src = images[1];
          breath.classList.add('grow');
          image.classList.remove('hidden');

          relax = setInterval(() => {
            breath.classList.toggle('grow');
            breath.classList.toggle('shrink');
          }, speedInMs);

          slideshow = setInterval(() => {
            i++;
            if (i % 2 === 0) {
              image.src = images[i];
              nextImage.src = images[i + 1];
            } else {
              image.src = images[i + 1];
              nextImage.src = images[i];
            }

            image.classList.toggle('hidden');
            nextImage.classList.toggle('hidden');

            if (i > images.length - 2) {
              downloadMoreImages(s);
            }
          }, speedInMs * 2);
          // pointer.style.animation = 'rotate 12s linear forwards infinite';
        });
      }

      chooseSubreddit();