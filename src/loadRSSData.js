/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import RSSParse from './parser.js';

const toProxy = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const loadRSSData = (i18n, state, url) => {
  axios.get(toProxy(url))
    .then((response) => {
      const parsedData = RSSParse(response);
      const { feed, posts } = parsedData;
      const numberedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
      state.feeds.push(feed);
      state.posts.push(...numberedPosts);
      state.status = 'success';
      state.feedbackMessage = i18n.t('feedback.success');
      state.feedsURLs.push(url);
    })
    .catch((e) => { // обработка ошибок парсера и загрузчика
      state.status = 'error';
      state.feedbackMessage = i18n.t(`feedback.${e.message}`);
    });
};

const updatePosts = (state) => {
  const iter = () => {
    const urls = Array.from(state.feedsURLs);
    const promises = urls.map((url) => axios.get(toProxy(url))
      .then((response) => {
        const parsedData = RSSParse(response);
        const { posts } = parsedData;
        let uniquePosts = _.differenceBy(posts, state.posts, 'title');
        if (uniquePosts.length !== 0) {
          uniquePosts = uniquePosts.map((post) => ({ ...post, id: _.uniqueId() }));
          state.posts.unshift(...uniquePosts);
        }
      }));
    Promise.all(promises).finally(() => setTimeout(iter, 5000));
  };
  setTimeout(iter, 5000);
};

export { loadRSSData, updatePosts };
