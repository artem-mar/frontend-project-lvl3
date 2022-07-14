export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'text/xml');
  const feedTitle = parsedData.querySelector('title').textContent;
  const feedDescription = parsedData.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription };

  const posts = [...parsedData.querySelectorAll('item')].reverse()
    .map((post) => {
      const title = post.querySelector('title').textContent;
      const description = post.querySelector('description').textContent;
      const link = post.querySelector('link').textContent;

      return {
        title,
        description,
        link,
      };
    });

  return { feed, posts };
};
