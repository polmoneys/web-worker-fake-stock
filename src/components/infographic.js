import { html, render } from 'lit-html';
import geometry, { create_geometry } from "./geometry";

const infographic = (entries, meta, active) => {

    const cards = Object.entries(meta).map((entry,i)=>({ 
        id:i,
        key:entry[0],
        value:entry[1]
    }));

  if (entries.length === 0) return null;
  return html`
    <br />
    <h1> Active chunk (10 entries of 1000) </h1>
    <br />
    <div class="entries-container">
      ${active.map((e, i) => entry(e, i))}
    </div>
      <br />
      <h1> Meta values of a seed of 1000</h1>
      <br />
      <div class="cards-container">
        ${cards.map(c => card(c))}
      </div>
      <br />
      <h1> 1000 entries </h1>
      <br />
      <div class="entries-container">
        ${entries.map((e, i) => entry(e, i))}
      </div>
    </div>
  `;
};

const card = (card) => {
  return html`
    <div class="card" key=${card.id}>
      ${render_content(card.id, card.key,card.value)}
    </div>
  `;
};

const render_content = (i,k,v) => {
      const options = create_geometry({
        vertices: 3+i,
        size: 48,
        fill: "#ff0055"
      });
    return html`
        ${geometry(options)}
        <p class="txt-cta txt-numbers"
          >${v} <span class="txt-s txt-uppercase"> / ${k}</span></p
        >
    `;
};

const entry = props => {
  return html`
    <div class="entry" key=${props.id}>
      <p>${props.label} </p>
      <p class="txt-numbers txt-thin">${props.value}</p>
    </div>
  `;
};

export const render_infographic = (entries, meta, active) =>
  render(
    infographic(entries, meta, active),
    document.querySelector('.report-container')
  );

  const notification = msg => {
    console.log(msg);
  return html`
    <p>${msg}</p>
  `;
};


const timer = moment => {
  return html`
    <p class="txt-numbers txt-thin txt-spacing">${moment} </p>
  `;
};

export const render_error = msg =>
  render(notification(msg), document.querySelector('.notification-container'));

export const render_timer = time =>
  render(timer(time), document.querySelector('.timer-container'));
