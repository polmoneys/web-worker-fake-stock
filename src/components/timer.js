import { html, render } from 'lit-html';

const timer = moment => {
  return html`
    <p class="txt-numbers txt-thin txt-spacing">${moment} </p>
  `;
};

export const renderTimer = time =>
  render(timer(time), document.querySelector('.timer-container'));
