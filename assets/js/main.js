/**
 * Mobile Menu Handler
 * Handles mobile navigation menu toggle functionality
 */

class MobileMenu {
    constructor() {
        this.mobileMenuButton = null;
        this.closeMenuButton = null;
        this.mobileMenu = null;
        this.body = null;
        this.mobileLinks = [];

        this.init();
    }


    init() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
            } else {
                this.setupEventListeners();
            }
        } catch (error) {
            console.error('Failed to initialize mobile menu:', error);
        }
    }


    setupEventListeners() {
        try {
            this.mobileMenuButton = document.getElementById('mobile-menu-button');
            this.closeMenuButton = document.getElementById('close-menu-button');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.body = document.body;

            if (!this.mobileMenuButton || !this.closeMenuButton || !this.mobileMenu) {
                console.warn('Mobile menu elements not found. Skipping mobile menu initialization.');
                return;
            }

            this.mobileLinks = this.mobileMenu.querySelectorAll('a');

            this.mobileMenuButton.addEventListener('click', (e) => this.toggleMenu(e));
            this.closeMenuButton.addEventListener('click', (e) => this.toggleMenu(e));

            this.mobileLinks.forEach((link) => {
                link.addEventListener('click', (e) => this.handleLinkClick(e));
            });

            this.mobileMenu.addEventListener('click', (e) => this.handleOverlayClick(e));

            document.addEventListener('keydown', (e) => this.handleKeydown(e));

        } catch (error) {
            console.error('Error setting up mobile menu event listeners:', error);
        }
    }


    toggleMenu(event) {
        try {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            if (!this.mobileMenu || !this.body) {
                console.warn('Mobile menu elements not available for toggle');
                return;
            }

            const isHidden = this.mobileMenu.classList.contains('hidden');

            if (isHidden) {
                this.showMenu();
            } else {
                this.hideMenu();
            }
        } catch (error) {
            console.error('Error toggling mobile menu:', error);
        }
    }


    showMenu() {
        try {
            this.mobileMenu.classList.remove('hidden');
            this.body.classList.add('overflow-hidden');

            this.closeMenuButton.focus();

            this.announceToScreenReader('Mobile menu opened');
        } catch (error) {
            console.error('Error showing mobile menu:', error);
        }
    }


    hideMenu() {
        try {
            this.mobileMenu.classList.add('hidden');
            this.body.classList.remove('overflow-hidden');

            if (this.mobileMenuButton) {
                this.mobileMenuButton.focus();
            }

            this.announceToScreenReader('Mobile menu closed');
        } catch (error) {
            console.error('Error hiding mobile menu:', error);
        }
    }


    handleLinkClick(event) {
        try {
            setTimeout(() => {
                this.hideMenu();
            }, 100);
        } catch (error) {
            console.error('Error handling link click:', error);
        }
    }


    handleOverlayClick(event) {
        try {
            if (event.target === this.mobileMenu) {
                this.hideMenu();
            }
        } catch (error) {
            console.error('Error handling overlay click:', error);
        }
    }


    handleKeydown(event) {
        try {
            if (event.key === 'Escape' && !this.mobileMenu.classList.contains('hidden')) {
                this.hideMenu();
            }
        } catch (error) {
            console.error('Error handling keyboard event:', error);
        }
    }

    announceToScreenReader(message) {
        try {
            let announcer = document.getElementById('screen-reader-announcer');
            if (!announcer) {
                announcer = document.createElement('div');
                announcer.id = 'screen-reader-announcer';
                announcer.setAttribute('aria-live', 'polite');
                announcer.setAttribute('aria-atomic', 'true');
                announcer.style.position = 'absolute';
                announcer.style.left = '-10000px';
                announcer.style.width = '1px';
                announcer.style.height = '1px';
                announcer.style.overflow = 'hidden';
                document.body.appendChild(announcer);
            }

            announcer.textContent = message;
        } catch (error) {
            console.error('Error announcing to screen reader:', error);
        }
    }

    destroy() {
        try {
            if (this.mobileMenuButton) {
                this.mobileMenuButton.removeEventListener('click', this.toggleMenu);
            }
            if (this.closeMenuButton) {
                this.closeMenuButton.removeEventListener('click', this.toggleMenu);
            }
            if (this.mobileMenu) {
                this.mobileMenu.removeEventListener('click', this.handleOverlayClick);
            }

            this.mobileLinks.forEach((link) => {
                link.removeEventListener('click', this.handleLinkClick);
            });

            document.removeEventListener('keydown', this.handleKeydown);
        } catch (error) {
            console.error('Error destroying mobile menu:', error);
        }
    }
}

try {
    const mobileMenu = new MobileMenu();

    if (typeof window !== 'undefined') {
        window.mobileMenu = mobileMenu;
    }
} catch (error) {
    console.error('Failed to create mobile menu instance:', error);
}


// Back to Top floating button  

document.addEventListener('DOMContentLoaded', function () {
    const floatingTopBtn = document.getElementById('floatingTopBtn');

    if (!floatingTopBtn) {
        return;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function isNearBottom() {
        const threshold = Math.min(window.innerHeight * 1.2, 180);
        return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
    }

    function handleScroll() {
        if (window.scrollY > 300) {
            floatingTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            floatingTopBtn.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            floatingTopBtn.classList.add('opacity-0', 'pointer-events-none');
            floatingTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
        }

        if (isNearBottom()) {
            floatingTopBtn.classList.add('is-above-footer');
        } else {
            floatingTopBtn.classList.remove('is-above-footer');
        }
    }

    floatingTopBtn.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
});

// Inline search

class InlineSearch {
    static indexPromise;

    constructor(form) {
        this.form = form;
        this.input = form.querySelector('input[type="search"]');
        this.results = form.querySelector('[data-search-results]');
        this.posts = [];
        this.activeIndex = -1;
        this.input.setAttribute('aria-expanded', 'false');
        this.loadIndex();

        this.input.addEventListener('input', () => this.render());
        this.input.addEventListener('focus', () => this.render());
        this.input.addEventListener('keydown', (event) => this.handleKeydown(event));
        this.form.addEventListener('submit', (event) => event.preventDefault());
        document.addEventListener('click', (event) => {
            if (!this.form.contains(event.target)) {
                this.hide();
            }
        });
    }

    async loadIndex() {
        try {
            if (!InlineSearch.indexPromise) {
                InlineSearch.indexPromise = fetch(this.form.dataset.searchIndex).then((response) => {
                    if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
                    return response.json();
                });
            }
            this.posts = await InlineSearch.indexPromise;
            this.render();
        } catch (error) {
            console.error('Failed to load search index:', error);
        }
    }

    search(query) {
        const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

        return this.posts
            .map((post) => {
                const title = (post.title || '').toLowerCase();
                const summary = (post.summary || '').toLowerCase();
                const content = (post.content || '').toLowerCase();
                const tags = (post.tags || []).join(' ').toLowerCase();
                const categories = (post.categories || []).join(' ').toLowerCase();
                const searchableText = `${title} ${summary} ${content} ${tags} ${categories}`;

                if (!terms.length || !terms.every((term) => searchableText.includes(term))) {
                    return null;
                }

                const score = terms.reduce((total, term) => total
                    + (title.includes(term) ? 10 : 0)
                    + (tags.includes(term) ? 4 : 0)
                    + (categories.includes(term) ? 3 : 0)
                    + (content.includes(term) ? 2 : 0)
                    + (summary.includes(term) ? 1 : 0), 0);

                return { post, score };
            })
            .filter(Boolean)
            .sort((left, right) => right.score - left.score || right.post.date.localeCompare(left.post.date))
            .slice(0, 8)
            .map((result) => result.post);
    }

    render() {
        const query = this.input.value;
        const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (!query.trim()) {
            this.hide();
            return;
        }

        const matches = this.search(query);
        this.results.replaceChildren();
        this.activeIndex = -1;

        if (!matches.length) {
            const empty = document.createElement('p');
            empty.className = 'px-3 py-2 text-amber-100';
            empty.textContent = 'No posts found.';
            this.results.append(empty);
            this.show();
            return;
        }

        matches.forEach((post, index) => {
            const link = document.createElement('a');
            const resultUrl = new URL(post.url, window.location.href);
            resultUrl.searchParams.set('highlight', terms.join(' '));
            link.href = resultUrl.href;
            link.className = 'block border-b border-stone-600 px-3 py-2 text-amber-100 last:border-0 hover:bg-stone-700 focus:bg-stone-700 focus:outline-none';
            link.setAttribute('role', 'option');
            link.dataset.searchResult = index;

            const title = document.createElement('span');
            title.className = 'block font-bangers text-lg';
            this.appendHighlightedText(title, post.title, terms);
            link.append(title);

            const excerpt = document.createElement('span');
            excerpt.className = 'block truncate text-sm text-stone-200';
            this.appendHighlightedText(excerpt, this.getExcerpt(post, terms), terms);
            link.append(excerpt);

            const date = document.createElement('span');
            date.className = 'block text-xs text-stone-300';
            date.textContent = post.date;
            link.append(date);
            this.results.append(link);
        });

        this.show();
    }

    getExcerpt(post, terms) {
        const fields = [
            post.summary || '',
            post.content || '',
            `Tags: ${(post.tags || []).join(', ')}`,
            `Categories: ${(post.categories || []).join(', ')}`
        ];
        const text = fields.find((field) => {
            const lowerField = field.toLowerCase();
            return terms.some((term) => lowerField.includes(term));
        }) || fields[0];
        const lowerText = text.toLowerCase();
        const matchPosition = terms.reduce((firstPosition, term) => {
            const position = lowerText.indexOf(term);
            return position >= 0 && (firstPosition < 0 || position < firstPosition) ? position : firstPosition;
        }, -1);

        if (matchPosition < 0 || text.length <= 120) {
            return text.slice(0, 120);
        }

        const start = Math.max(0, matchPosition - 45);
        const end = Math.min(text.length, start + 120);
        return `${start > 0 ? '... ' : ''}${text.slice(start, end)}${end < text.length ? ' ...' : ''}`;
    }

    appendHighlightedText(container, text, terms) {
        const pattern = terms
            .sort((left, right) => right.length - left.length)
            .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');

        if (!pattern) {
            container.textContent = text;
            return;
        }

        const parts = text.split(new RegExp(`(${pattern})`, 'gi'));
        parts.forEach((part) => {
            if (terms.some((term) => part.toLowerCase() === term)) {
                const match = document.createElement('mark');
                match.className = 'rounded-sm bg-amber-300 px-0.5 text-black';
                match.textContent = part;
                container.append(match);
            } else {
                container.append(document.createTextNode(part));
            }
        });
    }

    handleKeydown(event) {
        const links = [...this.results.querySelectorAll('[data-search-result]')];
        if (event.key === 'Escape') {
            this.hide();
        } else if (event.key === 'ArrowDown' && links.length) {
            event.preventDefault();
            this.activeIndex = (this.activeIndex + 1) % links.length;
            links[this.activeIndex].focus();
        } else if (event.key === 'ArrowUp' && links.length) {
            event.preventDefault();
            this.activeIndex = (this.activeIndex - 1 + links.length) % links.length;
            links[this.activeIndex].focus();
        } else if (event.key === 'Enter' && this.activeIndex >= 0 && links[this.activeIndex]) {
            links[this.activeIndex].click();
        }
    }

    show() {
        this.results.classList.remove('hidden');
        this.input.setAttribute('aria-expanded', 'true');
    }

    hide() {
        this.results.classList.add('hidden');
        this.input.setAttribute('aria-expanded', 'false');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-search-form]').forEach((form) => new InlineSearch(form));
});

function highlightArticleSearch() {
    const query = new URLSearchParams(window.location.search).get('highlight');
    const article = document.querySelector('main.custom-prose, article.custom-prose');
    if (!query || !article) {
        return;
    }

    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const pattern = terms
        .sort((left, right) => right.length - left.length)
        .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');

    if (!pattern) {
        return;
    }

    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
        if (currentNode.parentElement.closest('script, style, mark')) {
            continue;
        }
        textNodes.push(currentNode);
    }

    let firstMatch = null;
    const matcher = new RegExp(`(${pattern})`, 'gi');
    textNodes.forEach((textNode) => {
        if (!matcher.test(textNode.nodeValue)) {
            matcher.lastIndex = 0;
            return;
        }
        matcher.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        textNode.nodeValue.split(matcher).forEach((part) => {
            if (terms.some((term) => part.toLowerCase() === term)) {
                const match = document.createElement('mark');
                match.className = 'rounded-sm bg-amber-300 px-0.5 text-black';
                match.dataset.searchHighlight = 'true';
                match.textContent = part;
                fragment.append(match);
                if (!firstMatch) {
                    firstMatch = match;
                }
            } else {
                fragment.append(document.createTextNode(part));
            }
        });
        textNode.replaceWith(fragment);
    });

    if (firstMatch) {
        requestAnimationFrame(() => firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    }

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('highlight');
    window.history.replaceState(null, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);

    window.setTimeout(() => {
        article.querySelectorAll('mark[data-search-highlight]').forEach((mark) => {
            mark.replaceWith(document.createTextNode(mark.textContent));
        });
    }, 5000);
}

document.addEventListener('DOMContentLoaded', highlightArticleSearch);