
export class I18n {
    constructor() {
        this.translations = {};
        this.language = localStorage.getItem('language') || 'en';
    }

    async init() {
        await this.loadTranslations(this.language);
        this.updateDocumentAttributes();
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(error);
            if (lang !== 'en') {
                await this.loadTranslations('en'); // Fallback to English
            }
        }
    }
    
    updateDocumentAttributes() {
        document.documentElement.lang = this.language;
        document.documentElement.dir = this.language === 'ar' ? 'rtl' : 'ltr';
    }

    async setLanguage(lang) {
        if (this.language === lang) return;
        this.language = lang;
        localStorage.setItem('language', lang);
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }
        this.updateDocumentAttributes();
        this.translatePage();
        
        // Re-render language selector to update its 'selected' state
        // This is a simple way to trigger a re-render in main.js
        document.dispatchEvent(new CustomEvent('language-change'));
    }

    getNestedTranslation(key) {
        const langData = this.translations[this.language] || this.translations['en'];
        if (!langData) return null;
        return key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), langData);
    }

    t(key, options) {
        let translation = this.getNestedTranslation(key);
        if (!translation) {
            console.warn(`Translation key "${key}" not found.`);
            return key;
        }

        if (options) {
            Object.keys(options).forEach((k) => {
                translation = translation.replace(`{{${k}}}`, String(options[k]));
            });
        }
        return translation;
    }

    translatePage() {
        document.querySelectorAll('[data-t]').forEach(element => {
            const key = element.getAttribute('data-t');
            if (!key) return;

            const optionsAttr = element.getAttribute('data-t-options');
            const options = optionsAttr ? JSON.parse(optionsAttr) : undefined;
            
            const translation = this.t(key, options);

            if (element.hasAttribute('data-t-html')) {
                 element.innerHTML = translation;
            } else {
                 element.textContent = translation;
            }
        });

        // Also update the main page title
        const mainTitleKey = this.getMainTitleKey();
        if (mainTitleKey) {
            document.title = this.t(mainTitleKey);
        }
    }
    
    getMainTitleKey() {
        const path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html')) return 'home.seo.title';
        if (path.endsWith('image-converter.html')) return 'converter.seo.title';
        if (path.endsWith('image-compressor.html')) return 'compressor.seo.title';
        if (path.endsWith('pdf-to-jpg.html')) return 'pdfToJpg.seo.title';
        if (path.endsWith('faq.html')) return 'faq.seo.title';
        if (path.endsWith('privacy-policy.html')) return 'privacy.seo.title';
        if (path.endsWith('terms-of-use.html')) return 'terms.seo.title';
        if (path.endsWith('contact.html')) return 'contact.seo.title';
        return 'home.seo.title';
    }
}
