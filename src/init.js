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
  state.loading.error = null;
  axios.get(buildUrl(url))
    .then((response) => {
      const parsedData = RSSParse(response.data.contents);
      const { feed, posts } = parsedData;
      const numberedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
      feed.url = url;
      state.feeds.push(feed);
      state.posts.push(...numberedPosts);
      state.loading.status = 'success';
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
  const urls = state.feeds.map(({ url }) => url);
  const promises = urls.map((url) => axios.get(buildUrl(url))
    .then((response) => {
      const parsedData = RSSParse(response.data.contents);
      const { posts } = parsedData;
      let uniquePosts = _.differenceBy(posts, state.posts, 'title');
      if (uniquePosts.length !== 0) {
        uniquePosts = uniquePosts.map((post) => ({ ...post, id: _.uniqueId() }));
        state.posts.push(...uniquePosts);
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
    uiState: {
      viewedPostsId: new Set(),
      modalPostId: '',
    },
    feeds: [],
    posts: [],
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
      if (!id) { return; }
      const { viewedPostsId } = watchedState.uiState;
      viewedPostsId.add(id);
      watchedState.uiState.modalPostId = id;
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const inputValue = formData.get('url').trim();
      const feedsURLs = watchedState.feeds.map(({ url }) => url);

      validate(inputValue, feedsURLs)
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
