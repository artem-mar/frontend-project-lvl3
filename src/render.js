/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderStatus = (value, elements, i18n) => {
  if (value === 'sending') {
    elements.submitButton.disabled = true;
    elements.input.disabled = true;
    elements.feedback.textContent = '';
    elements.feedback.classList.remove('text-danger', 'text-success');
    elements.input.classList.remove('is-invalid');
  }
  if (value === 'success') {
    elements.submitButton.disabled = false;
    elements.input.disabled = false;
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = i18n.t('feedback.success');
    elements.form.reset();
    elements.input.focus();
  }
  if (value === 'error') {
    elements.submitButton.disabled = false;
    elements.input.disabled = false;
    elements.feedback.classList.add('text-danger');
  }
};

const renderFeedback = (value, elements, i18n) => {
  elements.feedback.textContent = i18n.t(`feedback.${value}`);
};
const renderValid = (value, elements) => {
  if (value === true) {
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
  }
};

const renderFeeds = (feeds, elements, i18n) => {
  elements.feeds.innerHTML = '';
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = `<h4 class="card-title h4">${i18n.t('feeds')}</h4>`;
  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  feeds.forEach((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'p-2', 'px-3', 'border-0');
    const titleElement = document.createElement('h6');
    titleElement.classList.add('card-title', 'mb-0');
    titleElement.textContent = title;
    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('small', 'text-black-50', 'mb-0');
    descriptionElement.textContent = description;
    li.append(titleElement, descriptionElement);
    ul.prepend(li);
  });

  elements.feeds.append(cardBody, ul);
};

const createPostButton = (post, i18n) => {
  const {
    title, description, link,
  } = post;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'mb-auto');
  button.textContent = i18n.t('postButton');
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';

  button.addEventListener('click', () => {
    const modal = document.querySelector('#modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-body p');
    const modalButton = modal.querySelector('a.btn-primary');
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalButton.href = link;
  });
  return button;
};

const renderPosts = (posts, elements, i18n) => {
  elements.posts.innerHTML = '';
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = `<h4 class="card-title h4">${i18n.t('posts')}</h4>`;
  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  [...posts].sort((a, b) => a.id - b.id)
    .forEach((post) => {
      const {
        title, link, viewed,
      } = post;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'px-3', 'd-flex', 'justify-content-between', 'border-0');

      const a = document.createElement('a');
      a.textContent = title;
      a.target = 'blank';
      a.href = link;
      if (!viewed) {
        a.classList.add('fw-bold');
      } else {
        a.classList.add('fw-normal', 'link-secondary');
      }
      const postButton = createPostButton(post, i18n);
      [a, postButton].forEach((el) => {
        el.addEventListener('click', () => {
          a.classList.remove('fw-bold');
          a.classList.add('fw-normal', 'link-secondary');
          post.viewed = true;
        });
      });

      li.append(a);
      li.append(postButton);
      ul.prepend(li);
    });
  elements.posts.append(cardBody, ul);
};

const render = (i18n, elements) => (path, value) => {
  switch (path) {
    case 'feeds':
      renderFeeds(value, elements, i18n);
      break;

    case 'posts':
      renderPosts(value, elements, i18n);
      break;

    case 'status':
      renderStatus(value, elements, i18n);
      break;

    case 'inputValid':
      renderValid(value, elements);
      break;

    case 'feedbackError':
      renderFeedback(value, elements, i18n);
      break;

    default:
      break;
  }
};

const watch = (state, i18n, elements) => onChange(state, (render(i18n, elements)));

export default watch;
