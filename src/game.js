import { el } from './dom.js';
import { CARD_VALUES } from './cards.js';
import { saveScore } from './storage.js';

const MISMATCH_DELAY = 1000;

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
    secondCard: null,
    lockBoard: false,
    moves: 0,
    foundPairs: 0,
    totalPairs: CARD_VALUES.length,
    closeTimeoutId: null,
};

let onWinCallback = null;

export function setOnWin(callback) {
    onWinCallback = callback;
}

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

function closeMismatch() {
    if (state.firstCard) {
        state.firstCard.classList.remove('card--flipped');
        state.firstCard.setAttribute('aria-label', 'Закрытая карточка');
    }
    if (state.secondCard) {
        state.secondCard.classList.remove('card--flipped');
        state.secondCard.setAttribute('aria-label', 'Закрытая карточка');
    }

    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
    state.closeTimeoutId = null;
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

    state.secondCard = card;
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
        state.secondCard = null;

        if (state.foundPairs === state.totalPairs) {

            saveScore(state.moves);

            if (typeof onWinCallback === 'function') {
                onWinCallback(state.moves);
            }
        }
        return;
    }

    state.lockBoard = true;
    state.closeTimeoutId = window.setTimeout(closeMismatch, MISMATCH_DELAY);
}

export function renderBoard(board, deck) {
    board.replaceChildren();
    deck.forEach((value, index) => {
        const card = createCard(value, index);
        card.addEventListener('click', onCardClick);
        board.appendChild(card);
    });
}

export function cancelPendingClose() {
    if (state.closeTimeoutId !== null) {
        clearTimeout(state.closeTimeoutId);
        state.closeTimeoutId = null;
    }
}

export function resetState() {
    cancelPendingClose();
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
    state.moves = 0;
    state.foundPairs = 0;
    updateCounters();
}

export function getMoves() {
    return state.moves;
}