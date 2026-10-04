import { el } from './dom.js';
import { createModal } from './modal.js';

export function createWinModal({ onNewGame } = {}) {
    const movesValue = el('span', { class: 'modal__value', text: '0' });

    const movesLine = el('p', { class: 'modal__text modal__text--strong' }, [
        document.createTextNode('Ходов: '),
        movesValue,
    ]);

    const content = el('div', { class: 'modal__content' }, [
        el('h2', { class: 'modal__title', text: 'Победа!' }),
        el('p', { class: 'modal__text', text: 'Вы нашли все пары.' }),
        movesLine,
    ]);

    const newGameBtn = el('button', {
        class: 'btn btn--primary',
        type: 'button',
        text: 'Новая игра',
    });

    const modal = createModal({
        content,
        footerActions: [newGameBtn],
    });

    newGameBtn.addEventListener('click', () => {
        modal.close();
        if (typeof onNewGame === 'function') onNewGame();
    });

    function setMoves(moves) {
        movesValue.textContent = String(moves);
    }

    return {
        open: modal.open,
        close: modal.close,
        element: modal.element,
        setMoves,
    };
}