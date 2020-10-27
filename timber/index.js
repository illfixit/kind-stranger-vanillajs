$(document).ready(function () {
  // $.get('https://www.reddit.com/r/prettygirls.json?limit=10').done(function(reddit) {
  //     let after = reddit.data.after;
  //     let posts = reddit.data.children
  //     var data = [];
  //     posts.forEach(post => {
  //         return data.push(post.data);
  //     });
  //     console.log(data);
  //     console.log(document.getElementById('container'))
  //     var c = document.getElementById('container')

  //     data.forEach( i => {

  //         c.innerHTML += `<div class="buddy"><div class="avatar" style="display: block; background-image: url(${i.preview.images[0].resolutions[i.preview.images[0].resolutions.length-1].url.replace(
  //             /amp;/gi,'')})"></div></div>`;
  //     });
  // })

  fetch("https://www.reddit.com/r/prettygirls/new.json?limit=100")
    .then((response) => response.json())
    .then((data) => {
      let after = data.data.after;
      let rawPosts = data.data.children;
      let posts = [];
      rawPosts.forEach((rp) => posts.push(rp.data));

      var c = document.getElementById("container");

      posts.forEach((i, index) => {
        try {
            index === 0 ?  c.innerHTML += `<div class="buddy" style="display:block"><div class="avatar" style="display: block; background-image: url(${i.preview.images[0].resolutions[
                i.preview.images[0].resolutions.length - 1
              ].url.replace(/amp;/gi, "")})"></div></div>` :
          c.innerHTML += `<div class="buddy"><div class="avatar" style="display: block; background-image: url(${i.preview.images[0].resolutions[
            i.preview.images[0].resolutions.length - 1
          ].url.replace(/amp;/gi, "")})"></div></div>`;
        } catch {
          console.log("empty");
        }
      });
      document.getElementById('loader').style.display = 'none';

      $(".buddy").on("swiperight", function () {
        $(this).addClass("rotate-left").delay(700).fadeOut(1);
        $(".buddy").find(".status").remove();

        $(this).append('<div class="status like">Like!</div>');
        if ($(this).is(":last-child")) {
          $(".buddy:nth-child(1)")
            .removeClass("rotate-left rotate-right")
            .fadeIn(300);
        } else {
          $(this).next().removeClass("rotate-left rotate-right").fadeIn(400);
        }
      });

      $(".buddy").on("swipeleft", function () {
        $(this).addClass("rotate-right").delay(700).fadeOut(1);
        $(".buddy").find(".status").remove();
        $(this).append('<div class="status dislike">Dislike!</div>');

        if ($(this).is(":last-child")) {
          $(".buddy:nth-child(1)")
            .removeClass("rotate-left rotate-right")
            .fadeIn(300);
          alert("OUPS");
        } else {
          $(this).next().removeClass("rotate-left rotate-right").fadeIn(400);
        }
      });
    });
});
