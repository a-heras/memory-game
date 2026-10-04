import { el } from './dom.js';

let openModalsCount = 0;

function lockScroll() {
    openModalsCount += 1;
    if (openModalsCount === 1) {
        document.body.style.overflow = 'hidden';
    }
}

function unlockScroll() {
    openModalsCount = Math.max(0, openModalsCount - 1);
    if (openModalsCount === 0) {
        document.body.style.overflow = '';
    }
}

export function createModal({ content, footerActions = [], onClose } = {}) {
    const closeBtn = el('button', {
        class: 'btn btn--secondary',
        type: 'button',
        text: 'Закрыть',
    });

    const footer = el('div', { class: 'modal__footer' }, [
        ...footerActions,
        closeBtn,
    ]);

    const dialog = el('div', {
        class: 'modal__dialog',
        role: 'dialog',
        'aria-modal': 'true',
    }, [content, footer]);

    const backdrop = el('div', { class: 'modal__backdrop' });

    const root = el('div', { class: 'modal', hidden: 'true' }, [
        backdrop,
        dialog,
    ]);

    let isOpen = false;

    function onKeyDown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
        }
    }

    function onBackdropClick() {
        close();
    }

    function open() {
        if (isOpen) return;
        isOpen = true;
        root.removeAttribute('hidden');
        requestAnimationFrame(() => root.classList.add('modal--open'));
        document.addEventListener('keydown', onKeyDown);
        backdrop.addEventListener('click', onBackdropClick);
        lockScroll();
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        root.classList.remove('modal--open');
        document.removeEventListener('keydown', onKeyDown);
        backdrop.removeEventListener('click', onBackdropClick);
        unlockScroll();

        const onTransitionEnd = () => {
            root.setAttribute('hidden', 'true');
            root.removeEventListener('transitionend', onTransitionEnd);
            if (typeof onClose === 'function') onClose();
        };
        root.addEventListener('transitionend', onTransitionEnd);
    }

    closeBtn.addEventListener('click', close);

    return { open, close, element: root };
}