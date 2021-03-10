async function checkIfSubredditExists(subreddit) {
  let exists = false;

  console.log(subreddit);

  await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?`)
    .then((data) => data.json())
    .then((data) => {
      for (let i = 1; i < 10; i++) {
        // console.log(data.data.children[i].data.preview);
        try {
          // if any of first 10 posts contains images => true
          if (
            data.data.children[i].data.preview &&
            data.data.children[i].data.preview.images[0].resolutions
          ) {
            exists = true;
            break;
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (exists === false) {
        alert('Please, choose another subreddit');
      }
    })
    .catch((e) => {
      // console.log(`${subreddit} doesn't exist!`);
      alert('Please, choose another subreddit');
      exists = false;
    });
  return exists;
}

export { checkIfSubredditExists };
