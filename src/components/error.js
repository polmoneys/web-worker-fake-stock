import { html, render } from 'lit-html';

  const notification = msg => {
  return html`
    <p>${msg}</p>
  `;
};

export const renderError = msg =>
  render(notification(msg), document.querySelector('.notification-container'));
