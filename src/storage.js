const STORAGE_KEY = 'memory-game:scores';
const MAX_SCORES = 10;

export function loadScores() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isValidScore);
    } catch (error) {
        console.warn('Не удалось прочитать результаты:', error);
        return [];
    }
}

function isValidScore(score) {
    return score
        && typeof score.moves === 'number'
        && typeof score.date === 'string';
}

export function sortScores(scores) {
    return scores.slice().sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return a.date.localeCompare(b.date);
    });
}

export function saveScore(moves, when = new Date()) {
    const entry = {
        moves,
        date: toISODate(when),
    };

    const all = [...loadScores(), entry];
    const top = sortScores(all).slice(0, MAX_SCORES);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
    } catch (error) {
        console.warn('Не удалось сохранить результат:', error);
    }

    return top;
}

function toISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function formatDate(iso) {
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
}

export function clearScores() {
    localStorage.removeItem(STORAGE_KEY);
}