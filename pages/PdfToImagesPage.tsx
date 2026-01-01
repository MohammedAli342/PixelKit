import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Seo from '../components/Seo';
import SkeletonLoader from '../components/SkeletonLoader';
import PageHero from '../components/PageHero';
import { useHistory } from '../hooks/useHistory';
import HistoryControls from '../components/HistoryControls';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation } from '../hooks/useTranslation';

declare const pdfjsLib: any;
declare const JSZip: any;

interface PageImage {
  url: string;
  pageNumber: number;
}

interface PdfState {
  pageImages: PageImage[];
}

const PdfToImagesPage: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { state, setState, undo, redo, canUndo, canRedo, reset } = useHistory<PdfState>({ pageImages: [] });
  const { pageImages } = state;
  
  const handleFileSelect = (selectedFiles: File[]) => {
    const selectedFile = selectedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    reset({ pageImages: [] });
    setError(null);
    processPdf(selectedFile);
  };

  const processPdf = async (pdfFile: File) => {
    setIsLoading(true);
    const fileReader = new FileReader();
    
    fileReader.onload = async () => {
      try {
        const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const images: PageImage[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (!context) continue;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          images.push({ url: canvas.toDataURL('image/jpeg'), pageNumber: i });
        }
        setState({ pageImages: images });
      } catch (err) {
        setError(t('pdfToJpg.errors.process'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fileReader.readAsArrayBuffer(pdfFile);
  };
  
  const downloadImage = (url: string, pageNum: number) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file?.name.replace('.pdf', '')}-${t('pdfToJpg.page').toLowerCase()}-${pageNum}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (pageImages.length === 0 || !file) return;

    setIsZipping(true);
    setError(null);

    try {
        const zip = new JSZip();
        for (const img of pageImages) {
            const base64Data = img.url.split(',')[1];
            zip.file(
                `${file.name.replace('.pdf', '')}-${t('pdfToJpg.page').toLowerCase()}-${img.pageNumber}.jpg`,
                base64Data,
                { base64: true }
            );
        }

        const content = await zip.generateAsync({ type: "blob" });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${file.name.replace('.pdf', '')}-images.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch (err) {
        setError(t('pdfToJpg.errors.zip'));
        console.error('Zipping error:', err);
    } finally {
        setIsZipping(false);
    }
  };
  
  const handleStartOver = () => {
      setFile(null);
      reset({ pageImages: [] });
  }


  return (
    <>
      <Seo
        title={t('pdfToJpg.seo.title')}
        description={t('pdfToJpg.seo.description')}
        keywords={t('pdfToJpg.seo.keywords')}
      />
      <PageHero
        title={t('pdfToJpg.hero.title')}
        subtitle={t('pdfToJpg.hero.subtitle')}
      />
      
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">{t('pdfToJpg.intro.title')}</h2>
                <p className="text-slate-300">{t('pdfToJpg.intro.description')}</p>
            </div>
          {!file ? (
            <div className="max-w-4xl mx-auto">
              <FileUpload
                onFilesSelect={handleFileSelect}
                acceptedFileTypes="application/pdf"
                promptText="fileUpload.prompt.pdf"
                maxFiles={1}
              />
            </div>
          ) : (
            <div>
              {error && (
                <div className="max-w-4xl mx-auto mb-8">
                    <ErrorMessage message={error} onClear={() => setError(null)} />
                </div>
              )}
            
              {isLoading && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 space-y-2">
                        <SkeletonLoader className="w-full h-32 md:h-40" />
                        <SkeletonLoader className="w-1/2 h-4 mx-auto" />
                        <SkeletonLoader className="w-full h-8" />
                      </div>
                    ))}
                  </div>
              )}
              
              {pageImages.length > 0 && (
                  <div className="animate-fadeIn">
                      <div className="text-center mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                           <button
                              onClick={handleDownloadAll}
                              disabled={isZipping}
                              className="w-full sm:w-auto inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-xl transition-shadow disabled:opacity-70 flex justify-center items-center"
                            >
                              {isZipping ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  {t('pdfToJpg.zipping')}...
                                </>
                              ) : t('pdfToJpg.downloadAll')}
                            </button>
                          <button
                              onClick={handleStartOver}
                              className="w-full sm:w-auto bg-slate-200/10 text-slate-200 font-semibold py-3 px-6 rounded-full hover:bg-slate-200/20 transition-colors"
                          >
                              {t('pdfToJpg.useAnother')}
                          </button>
                          <HistoryControls onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {pageImages.map((img, index) => (
                          <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg p-3 text-center group">
                              <img src={img.url} alt={t('pdfToJpg.alt.page', { pageNumber: img.pageNumber })} className="rounded-md w-full h-auto mb-3"/>
                              <p className="font-bold text-sm mb-3 text-white">{t('pdfToJpg.page')} {img.pageNumber}</p>
                              <button 
                                  onClick={() => downloadImage(img.url, img.pageNumber)}
                                  className="w-full bg-gradient-to-r from-brand-cyan to-brand-magenta text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-all"
                              >
                                  {t('common.download')}
                              </button>
                          </div>
                      ))}
                      </div>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PdfToImagesPage;