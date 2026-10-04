import { el } from './dom.js';
import { CARD_VALUES } from './cards.js';

export function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function createDeck() {
    return shuffle([...CARD_VALUES, ...CARD_VALUES]);
}

export function createCard(value, index) {
    return el('button', {
        class: 'card',
        type: 'button',
        dataset: { index: String(index), value },
        'aria-label': 'Закрытая карточка',
    }, [
        el('span', { class: 'card__face card__face--back', text: '?' }),
        el('span', { class: 'card__face card__face--front', text: value }),
    ]);
}

const state = {
    firstCard: null,
    lockBoard: false,
    moves: 0,
    foundPairs: 0,
    totalPairs: CARD_VALUES.length,
};

let movesEl = null;
let pairsEl = null;

export function bindCounters(movesNode, pairsNode) {
    movesEl = movesNode;
    pairsEl = pairsNode;
}

function updateCounters() {
    if (movesEl) movesEl.textContent = String(state.moves);
    if (pairsEl) {
        pairsEl.textContent = `${state.foundPairs} / ${state.totalPairs}`;
    }
}

function isAlreadyOpen(card) {
    return card.classList.contains('card--flipped')
        || card.classList.contains('card--found');
}

function onCardClick(event) {
    const card = event.currentTarget;

    if (state.lockBoard) return;
    if (isAlreadyOpen(card)) return;

    card.classList.add('card--flipped');
    card.setAttribute('aria-label', 'Открытая карточка');

    if (!state.firstCard) {
        state.firstCard = card;
        return;
    }

    state.moves += 1;
    updateCounters();

    const isMatch = state.firstCard.dataset.value === card.dataset.value;

    if (isMatch) {
        state.firstCard.classList.add('card--found');
        card.classList.add('card--found');
        state.firstCard.setAttribute('aria-label', 'Найденная пара');
        card.setAttribute('aria-label', 'Найденная пара');

        state.foundPairs += 1;
        updateCounters();

        state.firstCard = null;

        // TODO (Шаг 5): если foundPairs === totalPairs — открыть модалку победы
        return;
    }

    state.lockBoard = true;
    state.firstCard = null;
}

export function renderBoard(board, deck) {
    board.replaceChildren();
    deck.forEach((value, index) => {
        const card = createCard(value, index);
        card.addEventListener('click', onCardClick);
        board.appendChild(card);
    });
}

export function resetState() {
    state.firstCard = null;
    state.lockBoard = false;
    state.moves = 0;
    state.foundPairs = 0;
    updateCounters();
}