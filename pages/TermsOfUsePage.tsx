
import React from 'react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { useTranslation } from '../hooks/useTranslation';

const TermsOfUsePage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    { id: 'acceptance', title: t('terms.s1.title') },
    { id: 'description', title: t('terms.s2.title') },
    { id: 'conduct', title: t('terms.s3.title') },
    { id: 'disclaimer', title: t('terms.s4.title') },
    { id: 'liability', title: t('terms.s5.title') },
    { id: 'changes', title: t('terms.s6.title') },
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
        title={t('terms.seo.title')}
        description={t('terms.seo.description')}
        keywords={t('terms.seo.keywords')}
      />
      <PageHero
        title={t('terms.hero.title')}
        subtitle={t('terms.hero.subtitle')}
      />
      
      <div className="py-12 md:py-16 bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto">
            
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider text-brand-magenta">
                    Table of Contents
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
                
                <div className="bg-gradient-to-br from-brand-magenta/10 to-brand-cyan/10 border border-white/5 rounded-2xl p-6">
                  <p className="text-slate-300 text-sm mb-2">
                    {t('terms.lastUpdated', { date: new Date().toLocaleDateString() })}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-8">
              
              {/* Section 1: Acceptance */}
              <section id="acceptance" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-magenta/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-magenta/20 text-brand-magenta text-sm">1</span>
                  {t('terms.s1.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('terms.s1.p1')}</p>
              </section>

              {/* Section 2: Description */}
              <section id="description" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-magenta/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-magenta/20 text-brand-magenta text-sm">2</span>
                  {t('terms.s2.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('terms.s2.p1')}</p>
              </section>

              {/* Section 3: User Conduct */}
              <section id="conduct" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-magenta/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-magenta/20 text-brand-magenta text-sm">3</span>
                   {t('terms.s3.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 mb-4">{t('terms.s3.p1')}</p>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-300">
                             <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <span>{t('terms.s3.l1')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300">
                             <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <span>{t('terms.s3.l2')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300">
                             <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <span>{t('terms.s3.l3')}</span>
                        </li>
                    </ul>
                </div>
              </section>

              {/* Section 4: Disclaimer */}
              <section id="disclaimer" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-magenta/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-magenta/20 text-brand-magenta text-sm">4</span>
                   {t('terms.s4.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <div className="prose prose-invert max-w-none text-slate-300">
                     <p className="uppercase text-xs font-bold tracking-widest text-slate-500 mb-2">Notice</p>
                    <p>{t('terms.s4.p1')}</p>
                </div>
              </section>
              
              {/* Section 5: Liability */}
              <section id="liability" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-magenta/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-magenta/20 text-brand-magenta text-sm">5</span>
                   {t('terms.s5.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('terms.s5.p1')}</p>
              </section>

              {/* Section 6: Changes */}
              <section id="changes" className="scroll-mt-28 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:border-brand-magenta/30 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                   <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-magenta/20 text-brand-magenta text-sm">6</span>
                   {t('terms.s6.title').replace(/^\d+\.\s*/, '')}
                </h2>
                <p className="text-slate-300 leading-relaxed">{t('terms.s6.p1')}</p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfUsePage;
