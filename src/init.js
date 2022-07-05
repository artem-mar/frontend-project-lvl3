import i18next from 'i18next';
import watch from './render.js';
import validate from './validator.js';
import resources from './locale/index.js';
import { loadRSSData, updatePosts } from './loadRSSData.js';

const init = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('#submit-button'),
    feedback: document.querySelector('#feedback'),
    feeds: document.querySelector('#feeds'),
    posts: document.querySelector('#posts'),
    modal: document.querySelector('#modal'),
  };
  const state = {
    status: 'initializing', // success, error, sending
    feedbackError: '',
    inputValid: true,
    feedsURLs: [],
    feeds: [],
    posts: [],
    updating: false,
  };

  const i18n = i18next.createInstance();

  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    const watchedState = watch(state, i18n, elements);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elements.form);
      const inputValue = formData.get('url').trim();

      validate(inputValue, watchedState.feedsURLs)
        .then((url) => {
          watchedState.status = 'sending';
          watchedState.inputValid = true;
          loadRSSData(watchedState, url); // загружаем loadRSS
        })
        .then(() => { // начинаем обновлять после добавления первого URL'а
          if (watchedState.updating === false) {
            updatePosts(watchedState);
            watchedState.updating = true;
          }
        })
        .catch((err) => { // обработка ошибок валидатора
          watchedState.inputValid = false;
          watchedState.feedbackError = err.message;
          watchedState.status = 'error';
        });
    });
  });
};

export default init;
