
import React, { useState } from 'react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { useTranslation } from '../hooks/useTranslation';
import ErrorMessage from '../components/ErrorMessage';

const ContactUsPage: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // ============================================================================
    // ACTION REQUIRED: To make the contact form work, create a free account at 
    // https://formspree.io and create a new form. Replace 'YOUR_ID_HERE' 
    // below with your form's unique endpoint ID.
    // ============================================================================
    const endpoint = 'https://formspree.io/f/YOUR_ID_HERE';
    
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        if (data.errors) {
          setSubmitError(data.errors.map((error: any) => error.message).join(', '));
        } else {
          setSubmitError(t('contact.form.error.message'));
        }
      }
    } catch (error) {
      setSubmitError(t('contact.form.error.message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo 
        title={t('contact.seo.title')}
        description={t('contact.seo.description')}
        keywords={t('contact.seo.keywords')}
      />
      {submitted ? (
        <PageHero
          title={t('contact.success.title')}
          subtitle={t('contact.success.subtitle')}
        />
      ) : (
        <PageHero
          title={t('contact.hero.title')}
          subtitle={t('contact.hero.subtitle')}
        />
      )}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-xl">
          {submitted ? (
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl text-center animate-fadeIn">
                <p className="text-lg">{t('contact.success.message')}</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
              {submitError && <ErrorMessage message={submitError} onClear={() => setSubmitError(null)} />}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200">{t('contact.form.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-sm
                            focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">{t('contact.form.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-sm
                            focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan transition"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-200">{t('contact.form.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-sm
                            focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan transition"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 rounded-full shadow-sm text-sm font-bold text-white bg-gradient-to-r from-brand-cyan to-brand-magenta hover:shadow-xl transition-shadow disabled:opacity-70 disabled:cursor-wait"
                  style={{boxShadow: '0 0 15px rgba(34, 211, 238, 0.3), 0 0 15px rgba(244, 114, 182, 0.3)'}}
                >
                  {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;