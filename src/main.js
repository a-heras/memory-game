import { el } from './dom.js';
import { PAIRS_COUNT } from './cards.js';
import { createDeck, renderBoard } from './game.js';

const newGameBtn = el('button', {
    class: 'btn btn--primary',
    type: 'button',
    text: 'Новая игра',
});

const leadersBtn = el('button', {
    class: 'btn btn--secondary',
    type: 'button',
    text: 'Таблица лидеров',
});

const header = el('header', { class: 'header' }, [
    el('h1', { class: 'title', text: 'Memory' }),
    el('div', { class: 'header__actions' }, [newGameBtn, leadersBtn]),
]);

const movesEl = el('span', { class: 'stat__value', text: '0' });
const pairsEl = el('span', { class: 'stat__value', text: `0 / ${PAIRS_COUNT}` });

const stats = el('div', { class: 'stats' }, [
    el('div', { class: 'stat' }, [
        el('span', { class: 'stat__label', text: 'Ходы' }),
        movesEl,
    ]),
    el('div', { class: 'stat' }, [
        el('span', { class: 'stat__label', text: 'Найдено пар' }),
        pairsEl,
    ]),
]);

const board = el('div', { class: 'board' });
renderBoard(board, createDeck());

const app = el('div', { class: 'app' }, [header, stats, board]);
document.body.appendChild(app);