/* eslint-disable no-param-reassign */
const classToggle = (element, className) => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};

const render = (elements) => (path, value) => {
  switch (path) {
    case 'input.valid':
      classToggle(elements.input, 'is-invalid');
      classToggle(elements.feedback, 'text-danger');
      classToggle(elements.feedback, 'text-success');
      break;

    case 'input.feedback':
      elements.feedback.innerText = value;
      break;

    default:
      break;
  }
};

export default render;
