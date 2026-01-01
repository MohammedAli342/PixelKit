
import { I18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    const i18n = new I18n();

    const renderLanguageSelector = () => {
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'ar', name: 'العربية' },
            { code: 'fr', name: 'Français' },
            { code: 'zh', name: '中文' },
            { code: 'tr', name: 'Türkçe' },
        ];
        
        const container = document.getElementById('language-selector-container');
        if (!container) return;

        const selectHTML = `
            <div class="relative">
                <select id="language-select" class="appearance-none bg-slate-800/50 border border-slate-600 rounded-full text-white text-sm font-semibold py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-cyan transition cursor-pointer" aria-label="Select language">
                    ${languages.map(lang => `<option value="${lang.code}" ${i18n.language === lang.code ? 'selected' : ''}>${lang.name}</option>`).join('')}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        `;
        container.innerHTML = selectHTML;

        document.getElementById('language-select')?.addEventListener('change', (e) => {
            i18n.setLanguage((e.target as HTMLSelectElement).value);
        });
    };
    
    const setActiveNavLinks = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('header a');
        navLinks.forEach(link => {
            const anchor = link as HTMLAnchorElement;
            if (anchor.getAttribute('href') === currentPath) {
                anchor.classList.add('text-white', 'font-bold');
            }
        });
    };

    const initializeFaq = () => {
        const container = document.getElementById('faq-container');
        if (!container) return;
        
        const faqItems = [
            { q: 'faq.q1', a: 'faq.a1' },
            { q: 'faq.q2', a: 'faq.a2' },
            { q: 'faq.q3', a: 'faq.a3' },
            { q: 'faq.q4', a: 'faq.a4' },
            { q: 'faq.q5', a: 'faq.a5' },
        ];

        container.innerHTML = faqItems.map(item => `
            <div class="border-b border-white/10 py-4">
                <button class="w-full flex justify-between items-center text-left text-lg font-semibold text-white faq-question">
                    <span data-t="${item.q}"></span>
                    <svg class="w-5 h-5 transform transition-transform text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div class="mt-4 text-slate-300 prose prose-invert max-w-none hidden faq-answer">
                    <p data-t="${item.a}"></p>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.nextElementSibling as HTMLElement;
                const icon = button.querySelector('svg');
                const isOpen = !answer.classList.contains('hidden');
                
                answer.classList.toggle('hidden');
                icon?.classList.toggle('rotate-180', !isOpen);
            });
        });
    };

    // Initialize all shared components and logic
    i18n.init().then(() => {
        renderLanguageSelector();
        setActiveNavLinks();
        if (window.location.pathname.endsWith('faq.html')) {
            initializeFaq();
        }
        // After FAQ is initialized, translate the whole page.
        i18n.translatePage();
    });
});
