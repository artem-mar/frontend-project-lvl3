/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import RSSParse from './parser.js';

const toProxy = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const loadRSSData = (state, url) => {
  axios.get(toProxy(url))
    .then((response) => {
      const parser = new DOMParser();
      const data = parser.parseFromString(response.data.contents, 'text/xml');
      const parsedData = RSSParse(data);
      const { feed, posts } = parsedData;
      const numberedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
      state.feeds.push(feed);
      state.posts.push(...numberedPosts);
      state.status = 'success';
      state.feedsURLs.push(url);
    })
    .catch((e) => { // обработка ошибок парсера и загрузчика
      if (e.name === 'TypeError') { // ошибка парсера
        state.feedbackError = 'notContainRSS';
      } else {
        state.feedbackError = e.message;
      }
      state.status = 'error';
    });
};

const updatePosts = (state) => {
  const urls = Array.from(state.feedsURLs);
  const promises = urls.map((url) => axios.get(toProxy(url))
    .then((response) => {
      const parser = new DOMParser();
      const data = parser.parseFromString(response.data.contents, 'text/xml');
      const parsedData = RSSParse(data);
      const { posts } = parsedData;
      let uniquePosts = _.differenceBy(posts, state.posts, 'title');
      if (uniquePosts.length !== 0) {
        uniquePosts = uniquePosts.map((post) => ({ ...post, id: _.uniqueId() }));
        state.posts.push(...uniquePosts);
      }
    }));
  Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, state));
};

export { loadRSSData, updatePosts };
