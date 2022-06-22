import onChange from 'on-change';
import i18next from 'i18next';
import { setLocale } from 'yup';
import validate from './validator.js';
import render from './render.js';
import resources from './locale/index.js';

const elements = {
  input: document.querySelector('#url-input'),
  feeds: document.querySelector('#feeds'),
  posts: document.querySelector('#posts'),
  feedback: document.querySelector('#feedback'),
};

const init = () => {
  const state = {
    input: {
      valid: true,
      feedback: '',
      url: '',
    },
    feeds: [],
  };
  const watchedState = onChange(state, render(elements));

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  setLocale({
    mixed: { notOneOf: i18n.t('feedBack.alreadyExists') },
    string: { url: i18n.t('feedBack.isNotUrl') },
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = elements.input.value;

    validate(inputValue, watchedState.feeds).then((url) => {
      watchedState.input.valid = true;
      watchedState.feeds.push(url);
      watchedState.input.feedback = i18n.t('feedBack.isValid');
      form.reset();
      elements.input.focus();
    }).catch((err) => {
      watchedState.input.valid = false;
      watchedState.input.feedback = err.errors;
    });
  });
};

export default init;
