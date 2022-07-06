export default (data) => {
  const feedTitle = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription };

  const posts = [...data.querySelectorAll('item')].reverse()
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
