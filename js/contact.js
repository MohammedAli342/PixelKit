
import { I18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
    const i18n = new I18n();
    await i18n.init();

    const heroContainer = document.getElementById('hero-container');
    const contentContainer = document.getElementById('contact-content-container');
    if (!contentContainer || !heroContainer) return;
    
    let isSubmitting = false;
    let submitted = false;
    let submitError = null;

    const render = () => {
        if (submitted) {
            heroContainer.innerHTML = `
                <div class="py-16 text-center">
                    <div class="container mx-auto px-4 relative z-10">
                        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4" style="text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);" data-t="contact.success.title"></h1>
                        <p class="text-lg text-slate-300 max-w-2xl mx-auto" data-t="contact.success.subtitle"></p>
                    </div>
                </div>
            `;
            contentContainer.innerHTML = `
                <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl text-center animate-fadeIn">
                    <p class="text-lg" data-t="contact.success.message"></p>
                </div>
            `;
        } else {
            contentContainer.innerHTML = `
                <form id="contact-form" class="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
                    ${submitError ? `<div class="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center justify-between gap-4 animate-fadeIn"><div>${submitError}</div></div>` : ''}
                    <div>
                        <label for="name" class="block text-sm font-medium text-slate-200" data-t="contact.form.name"></label>
                        <input type="text" id="name" name="name" required class="mt-1 block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan transition" />
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-200" data-t="contact.form.email"></label>
                        <input type="email" id="email" name="email" required class="mt-1 block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan transition" />
                    </div>
                    <div>
                        <label for="message" class="block text-sm font-medium text-slate-200" data-t="contact.form.message"></label>
                        <textarea id="message" name="message" rows="4" required class="mt-1 block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan transition"></textarea>
                    </div>
                    <div>
                        <button type="submit" id="submit-btn" class="w-full flex justify-center py-3 px-4 rounded-full shadow-sm text-sm font-bold text-white bg-gradient-to-r from-brand-cyan to-brand-magenta hover:shadow-xl transition-shadow disabled:opacity-70 disabled:cursor-wait" style="box-shadow: 0 0 15px rgba(34, 211, 238, 0.3), 0 0 15px rgba(244, 114, 182, 0.3)">
                            ${isSubmitting ? i18n.t('contact.form.submitting') : i18n.t('contact.form.submit')}
                        </button>
                    </div>
                </form>
            `;
        }
        i18n.translatePage();
        attachEventListeners();
    };

    const attachEventListeners = () => {
        const form = document.getElementById('contact-form');
        form?.addEventListener('submit', handleSubmit);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        isSubmitting = true;
        submitError = null;
        render();

        // ============================================================================
        // ACTION REQUIRED: 
        // 1. Go to https://formspree.io and create a free account.
        // 2. Create a new form and copy the "Endpoint" URL.
        // 3. Paste the URL below to replace 'https://formspree.io/f/YOUR_ID_HERE'.
        // ============================================================================
        const endpoint = 'https://formspree.io/f/YOUR_ID_HERE';
        
        const formData = new FormData(e.target);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                submitted = true;
            } else {
                const data = await response.json();
                submitError = data.errors ? data.errors.map(err => err.message).join(', ') : i18n.t('contact.form.error.message');
            }
        } catch (error) {
            submitError = i18n.t('contact.form.error.message');
        } finally {
            isSubmitting = false;
            render();
        }
    };

    render();
});
