import { el } from './dom.js';
import { createModal } from './modal.js';
import { loadScores, sortScores, formatDate } from './storage.js';

export function createLeadersModal() {
    const content = el('div', { class: 'modal__content' });

    const modal = createModal({ content });

    function renderTable() {
        content.replaceChildren();

        const scores = sortScores(loadScores());

        content.appendChild(
            el('h2', { class: 'modal__title', text: 'Таблица лидеров' })
        );

        if (scores.length === 0) {
            content.appendChild(
                el('p', {
                    class: 'modal__text',
                    text: 'Пока нет результатов',
                })
            );
            return;
        }

        const table = el('table', { class: 'leaders' });

        const thead = el('thead', {}, [
            el('tr', {}, [
                el('th', { text: '#' }),
                el('th', { text: 'Ходы' }),
                el('th', { text: 'Дата' }),
            ]),
        ]);

        const tbody = el('tbody');
        scores.forEach((score, index) => {
            tbody.appendChild(
                el('tr', {}, [
                    el('td', { text: String(index + 1) }),
                    el('td', { text: String(score.moves) }),
                    el('td', { text: formatDate(score.date) }),
                ])
            );
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        content.appendChild(table);
    }

    function open() {
        renderTable();
        modal.open();
    }

    return {
        open,
        close: modal.close,
        element: modal.element,
    };
}