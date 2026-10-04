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
    const doubled = [...CARD_VALUES, ...CARD_VALUES];
    return shuffle(doubled);
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

export function renderBoard(board, deck) {
    board.replaceChildren();
    deck.forEach((value, index) => {
        board.appendChild(createCard(value, index));
    });
}