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
