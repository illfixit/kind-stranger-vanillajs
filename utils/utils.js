export const postIncludesProperImageOrVideo = ({ preview, domain, url }) =>
  (preview.images[0] != null ||
    domain.includes('imgur') ||
    url.includes('jpg')) &&
  !url.includes('youtube');

export const getProperImageUrlFromPost = (post) => {
  // console.log(post);
  return post.preview.images[0].resolutions[
    post.preview.images[0].resolutions.length - 1
  ].url.replace(/amp;/gi, '');
};

// Simple function to change the scale of both image and video
export const scaleChange = (e) => {
  if (image.style.objectFit != 'contain') {
    image.style.objectFit = 'contain';
    video.style.objectFit = 'contain';
  } else {
    image.style.objectFit = 'cover';
    video.style.objectFit = 'cover';
  }
};

export const logThis = () => {
  console.log(store);
};

export const show = (el) => {
  el.classList.remove('hidden');
};

export const hide = (el) => {
  el.classList.add('hidden');
};

export const setSrc = (el, source) => {
  el.src = source;
};
