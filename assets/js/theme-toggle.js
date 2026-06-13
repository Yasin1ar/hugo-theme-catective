/**
 * Theme Toggle Handler
 * Toggles between light and dark mode. Persists to localStorage.
 * Switches instantly—persian pattern and avatar use CSS, no reload needed.
 */

const THEME_KEY = 'theme';
const LIGHT = 'light';
const DARK = 'dark';

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

function getPreferredTheme() {
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    } catch {
        return LIGHT;
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
    updateToggleButton(theme);
}

function updateToggleButton(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {

        const isDark = theme === DARK;
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        const sunIcon = btn.querySelector('[data-icon="sun"]');
        const moonIcon = btn.querySelector('[data-icon="moon"]');
        if (sunIcon) sunIcon.classList.toggle('hidden', !isDark);
        if (moonIcon) moonIcon.classList.toggle('hidden', isDark);
    });
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === DARK ? LIGHT : DARK;
    setTheme(next);
}

function initTheme() {
    const stored = getStoredTheme();
    const preferred = getPreferredTheme();
    const theme = stored || preferred;
    setTheme(theme);
}

// Run immediately to avoid flash
initTheme();

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', toggleTheme);
    });
    updateToggleButton(document.documentElement.getAttribute('data-theme'));
});
