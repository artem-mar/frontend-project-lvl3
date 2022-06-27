import onChange from 'on-change';
import i18next from 'i18next';
import validate from './validator.js';
import render from './render.js';
import resources from './locale/index.js';
import { loadRSSData, updatePosts } from './loadRSSData.js';

const elements = {
  input: document.querySelector('#url-input'),
  submitButton: document.querySelector('#submit-button'),
  form: document.querySelector('form'),
  feeds: document.querySelector('#feeds'),
  posts: document.querySelector('#posts'),
  feedback: document.querySelector('#feedback'),
};

const init = () => {
  const state = {
    status: null, // success, error, sending
    feedbackMessage: '',
    inputValid: true,
    feedsURLs: [],
    feeds: [],
    posts: [],
  };

  const i18nInstance = i18next.createInstance();
  const promise = new Promise((resolve) => {
    i18nInstance.init({
      lng: 'ru',
      debug: false,
      resources,
    });
    resolve(i18nInstance);
  });
  promise.then((i18n) => {
    const watchedState = onChange(state, render(i18n, elements));
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputValue = elements.input.value;

      validate(i18n, inputValue, watchedState.feedsURLs)
        .then((url) => {
          watchedState.status = 'sending';
          watchedState.inputValid = true;
          loadRSSData(i18n, watchedState, url); // загружаем loadRSS
          return url;
        })
        .then((url) => updatePosts(watchedState, url))
        .catch((err) => { // обработка ошибок валидатора
          watchedState.inputValid = false;
          watchedState.feedbackMessage = err.errors;
          watchedState.status = 'error';
        });
    });
  });
};

export default init;

//   http://lorem-rss.herokuapp.com/feed?unit=second&interval=5
