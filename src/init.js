/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import resources from './locale/index.js';
import RSSParse from './parser.js';
import watch from './watchers.js';

const buildUrl = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app/get?disableCache=true');
  newUrl.searchParams.append('url', url);
  return newUrl;
};

const loadRSSData = (state, url) => {
  state.loading.status = 'sending';
  axios.get(buildUrl(url))
    .then((response) => {
      const parser = new DOMParser();
      const data = parser.parseFromString(response.data.contents, 'text/xml');
      const parsedData = RSSParse(data);
      const { feed, posts } = parsedData;
      const numberedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
      state.feeds.push(feed);
      state.posts.postList.push(...numberedPosts);
      state.loading.status = 'success';
      state.feedsURLs.push(url);
    })
    .catch((e) => { // parser and loader error handling
      if (e.name === 'TypeError') { // parser error
        state.loading.error = 'notContainRSS';
      } else {
        state.loading.error = e.message;
      }
      state.loading.status = 'error';
    });
};

const updatePosts = (state) => {
  const urls = Array.from(state.feedsURLs);
  const promises = urls.map((url) => axios.get(buildUrl(url))
    .then((response) => {
      const parser = new DOMParser();
      const data = parser.parseFromString(response.data.contents, 'text/xml');
      const parsedData = RSSParse(data);
      const { posts } = parsedData;
      let uniquePosts = _.differenceBy(posts, state.posts.postList, 'title');
      if (uniquePosts.length !== 0) {
        uniquePosts = uniquePosts.map((post) => ({ ...post, id: _.uniqueId() }));
        state.posts.postList.push(...uniquePosts);
      }
    }));
  Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, state));
};

const validate = (url, feeds = []) => {
  yup.setLocale({
    mixed: { notOneOf: 'this url already exists' },
    string: {
      url: 'invalid url',
      min: 'url must not be empty',
    },
  });
  const schema = yup.string().min(1).url().notOneOf(feeds);
  return schema.validate(url);
};

const init = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('#submit-button'),
    feedback: document.querySelector('#feedback'),
    feedsContainer: document.querySelector('#feeds'),
    postsContainer: document.querySelector('#posts'),
    modal: document.querySelector('#modal'),
  };
  const state = {
    form: {
      status: 'valid',
      error: null,
    },

    loading: {
      status: 'success',
      error: null,
    },

    feedsURLs: [],
    feeds: [],
    posts: {
      postList: [],
      viewedPostsId: [],
    },
    modalData: {},
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    const watchedState = watch(state, i18n, elements);

    elements.postsContainer.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      const { viewedPostsId } = watchedState.posts;
      if (!viewedPostsId.includes(id)) {
        viewedPostsId.push(id);
      }
      if (e.target.tagName === 'BUTTON') {
        watchedState.modalData = watchedState.posts.postList.find((post) => post.id === id);
      }
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const inputValue = formData.get('url').trim();

      validate(inputValue, watchedState.feedsURLs)
        .then((url) => {
          watchedState.form.status = 'valid';
          loadRSSData(watchedState, url); // loading
        })
        .catch((err) => { // validator error handling
          watchedState.form.status = 'invalid';
          watchedState.form.error = err.message;
        });
    });
    updatePosts(watchedState);
  });
};

export default init;
