
import React from 'react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    { id: 'intro', title: t('privacy.s1.title') },
    { id: 'data', title: t('privacy.s2.title') },
    { id: 'handling', title: t('privacy.s3.title') },
    { id: 'cookies', title: t('privacy.s4.title') },
    { id: 'changes', title: t('privacy.s5.title') },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Seo 
        title={t('privacy.seo.title')}
        description={t('privacy.seo.description')}
        keywords={t('privacy.seo.keywords')}
      />
      <PageHero
        title={t('privacy.hero.title')}
        subtitle={t('privacy.hero.subtitle')}
      />
      
      <div className="py-12 md:py-16 bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto">
            
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider text-brand-cyan">
                    {t('privacy.hero.title')}
                  </h3>
                  <nav className="flex flex-col space-y-3">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="text-left text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-1 duration-200"
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="bg-gradient-to-br from-brand-cyan/10 to-brand-magenta/10 border border-white/5 rounded-2xl p-6">
                  <p className="text-slate-300 text-sm mb-2">
                    {t('privacy.lastUpdated', { date: new Date().toLocaleDateString() })}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-8">
              
              {/* Section 1: Intro */}
              <section id="intro" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-cyan/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan text-sm">1</span>
                  {t('privacy.s1.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('privacy.s1.p1')}</p>
              </section>

              {/* Section 2: Data Collection */}
              <section id="data" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-cyan/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan text-sm">2</span>
                  {t('privacy.s2.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('privacy.s2.p1')}</p>
              </section>

              {/* Section 3: File Handling */}
              <section id="handling" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-cyan/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan text-sm">3</span>
                  {t('privacy.s3.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 mb-6">{t('privacy.s3.p1')}</p>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-white mb-2">{t('privacy.s3.l1.title')}</h3>
                        <p className="text-sm text-slate-400">{t('privacy.s3.l1.p1')}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-white mb-2">{t('privacy.s3.l2.title')}</h3>
                        <p className="text-sm text-slate-400">{t('privacy.s3.l2.p1')}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-white mb-2">{t('privacy.s3.l3.title')}</h3>
                        <p className="text-sm text-slate-400">{t('privacy.s3.l3.p1')}</p>
                    </div>
                </div>
              </section>

              {/* Section 4: Cookies */}
              <section id="cookies" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-cyan/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan text-sm">4</span>
                  {t('privacy.s4.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('privacy.s4.p1')}</p>
              </section>

              {/* Section 5: Changes */}
              <section id="changes" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-cyan/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan text-sm">5</span>
                  {t('privacy.s5.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('privacy.s5.p1')}</p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
