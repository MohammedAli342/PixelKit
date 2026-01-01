
import React, { useState } from 'react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { useTranslation } from '../hooks/useTranslation';

interface FaqItemProps {
  questionKey: string;
  answerKey: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ questionKey, answerKey }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10 py-4">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{t(questionKey)}</span>
                <svg
                    className={`w-5 h-5 transform transition-transform text-brand-cyan ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && <div className="mt-4 text-slate-300 prose prose-invert max-w-none"><p>{t(answerKey)}</p></div>}
        </div>
    );
};

const FaqPage: React.FC = () => {
  const { t } = useTranslation();

  const faqItems = [
    { q: 'faq.q1', a: 'faq.a1' },
    { q: 'faq.q2', a: 'faq.a2' },
    { q: 'faq.q3', a: 'faq.a3' },
    { q: 'faq.q4', a: 'faq.a4' },
    { q: 'faq.q5', a: 'faq.a5' },
  ];

  return (
    <>
      <Seo 
        title={t('faq.seo.title')}
        description={t('faq.seo.description')}
        keywords={t('faq.seo.keywords')}
       />
      <PageHero
        title={t('faq.hero.title')}
        subtitle={t('faq.hero.subtitle')}
      />
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
          <div className="space-y-4">
            {faqItems.map(item => (
                <FaqItem key={item.q} questionKey={item.q} answerKey={item.a} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqPage;