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
