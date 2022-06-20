import 'bootstrap/dist/css/bootstrap.min.css';
import sum from './sum.js';

const div = document.createElement('div');
div.textContent = `DIV! ${sum(2, 3)}`;
div.classList.add('m-3', 'border');

document.body.append(div);
