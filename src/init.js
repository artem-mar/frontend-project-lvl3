import onChange from 'on-change';
import validate from './validator.js';
import render from './render.js';

const init = () => {
  const elements = {
    input: document.querySelector('#url-input'),
    feeds: document.querySelector('#feeds'),
    posts: document.querySelector('#posts'),
    feedback: document.querySelector('#feedback'),
  };

  const state = {
    input: {
      valid: true,
      feedback: '',
      url: '',
    },
    feeds: [],
  };

  const watchedState = onChange(state, render(elements));

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.input.value;

    validate(url, watchedState.feeds).then((isValid) => {
      watchedState.input.valid = isValid;
      if (isValid) {
        watchedState.feeds.push(url);
        watchedState.input.feedback = 'RSS успешно загружен';
        form.reset();
        elements.input.focus();
      } else {
        watchedState.input.feedback = watchedState.feeds.includes(url)
          ? 'RSS уже существует'
          : 'Ссылка должна быть валидным URL';
      }
    });
  });
};

export default init;
