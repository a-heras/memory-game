export function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);

    for (const [key, value] of Object.entries(props)) {
        if (value == null) continue;

        if (key === 'class') {
            node.className = value;
        } else if (key === 'text') {
            node.textContent = value;
        } else if (key === 'dataset') {
            Object.assign(node.dataset, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            node.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            node.setAttribute(key, value);
        }
    }

    const list = Array.isArray(children) ? children : [children];
    for (const child of list) {
        if (child == null || child === false) continue;
        node.appendChild(
            typeof child === 'string' ? document.createTextNode(child) : child
        );
    }

    return node;
}