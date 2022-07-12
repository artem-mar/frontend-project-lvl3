import onChange from 'on-change';

const renderFormValid = (state, elements) => {
  if (state.form.status === 'valid') {
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
  }
};

const renderStatus = (value, elements, i18n) => {
  const { submitButton, input, feedback } = elements;
  if (value === 'sending') {
    submitButton.disabled = true;
    input.disabled = true;
    feedback.textContent = '';
    elements.feedback.classList.remove('text-danger', 'text-success');
    elements.input.classList.remove('is-invalid');
  }
  if (value === 'success') {
    submitButton.disabled = false;
    input.disabled = false;
    elements.feedback.classList.add('text-success');
    feedback.textContent = i18n.t('feedback.success');
    elements.form.reset();
    elements.input.focus();
  }
  if (value === 'error' || value === 'invalid') {
    submitButton.disabled = false;
    input.disabled = false;
    elements.feedback.classList.add('text-danger');
  }
};

const renderFeedback = (value, elements, i18n) => {
  const { feedback } = elements;
  feedback.textContent = i18n.t(`feedback.${value}`);
};

const renderFeeds = (state, elements, i18n) => {
  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = `<h4 class="card-title h4">${i18n.t('feeds')}</h4>`;
  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  state.feeds.forEach((feed) => {
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

  feedsContainer.append(cardBody, ul);
};

const buildPostButton = (post, i18n) => {
  const { id } = post;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'mb-auto');
  button.textContent = i18n.t('postButton');
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.dataset.id = id;
  return button;
};

const renderPosts = (state, elements, i18n) => {
  const { postsContainer } = elements;
  postsContainer.innerHTML = '';
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = `<h4 class="card-title h4">${i18n.t('posts')}</h4>`;
  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  const { uiState: { viewedPostsId }, posts } = state;

  [...posts].sort((a, b) => a.id - b.id)
    .forEach((post) => {
      const { title, link, id } = post;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'px-3', 'd-flex', 'justify-content-between', 'border-0');

      const a = document.createElement('a');
      a.textContent = title;
      a.target = 'blank';
      a.href = link;
      a.dataset.id = id;
      if (viewedPostsId.has(id)) {
        a.classList.add('fw-normal', 'link-secondary');
      } else {
        a.classList.add('fw-bold');
      }
      const postButton = buildPostButton(post, i18n);
      li.append(a, postButton);
      ul.prepend(li);
    });
  postsContainer.append(cardBody, ul);
};

const renderModal = (state, elements) => {
  const { modal } = elements;
  const modalTitle = modal.querySelector('.modal-title');
  const modalDescription = modal.querySelector('.modal-body p');
  const modalButton = modal.querySelector('a.btn-primary');
  const { modalPostId } = state.uiState;
  const activePost = state.posts.find(({ id }) => id === modalPostId);
  const { title, description, link } = activePost;
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalButton.href = link;
};

const watch = (state, i18n, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      renderFormValid(state, elements);
      renderStatus(value, elements, i18n);
      break;

    case 'form.error':
    case 'loading.error':
      renderFeedback(value, elements, i18n);
      break;

    case 'loading.status':
      renderStatus(value, elements, i18n);
      break;

    case 'feeds':
      renderFeeds(state, elements, i18n);
      break;

    case 'posts':
    case 'uiState.viewedPostsId':
      renderPosts(state, elements, i18n);
      break;

    case 'uiState.modalPostId':
      renderModal(state, elements);
      break;

    default:
      break;
  }
});

export default watch;
