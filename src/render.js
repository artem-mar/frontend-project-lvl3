/* eslint-disable no-param-reassign */
const render = (elements) => (path, value) => {
  switch (path) {
    case 'input.valid':
      if (value) {
        elements.input.classList.remove('is-invalid');
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');
      } else {
        elements.input.classList.add('is-invalid');
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
      }
      break;

    case 'input.feedback':
      elements.feedback.innerText = value;
      break;

    default:
      break;
  }
};

export default render;
