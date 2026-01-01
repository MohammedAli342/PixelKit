
import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import SkeletonLoader from '../components/SkeletonLoader';
import { useHistory } from '../hooks/useHistory';
import HistoryControls from '../components/HistoryControls';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation } from '../hooks/useTranslation';

declare const JSZip: any;

type Format = 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp';

interface ConverterState {
  outputUrls: string[];
  format: Format;
}

const ImageConverterPage: React.FC = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [originalUrls, setOriginalUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { state, setState, undo, redo, canUndo, canRedo, reset } = useHistory<ConverterState>({ outputUrls: [], format: 'png' });
  const { outputUrls, format } = state;

  useEffect(() => {
    // Clean up object URLs on unmount
    return () => {
      originalUrls.forEach(URL.revokeObjectURL);
      outputUrls.forEach(URL.revokeObjectURL);
    };
  }, [originalUrls, outputUrls]);


  const handleFilesSelect = (selectedFiles: File[]) => {
    originalUrls.forEach(URL.revokeObjectURL);
    outputUrls.forEach(URL.revokeObjectURL);

    setFiles(selectedFiles);
    setOriginalUrls(selectedFiles.map(f => URL.createObjectURL(f)));
    reset({ outputUrls: [], format: 'png' });
    setError(null);
  };

  const handleReset = () => {
    originalUrls.forEach(URL.revokeObjectURL);
    outputUrls.forEach(URL.revokeObjectURL);
    setFiles([]);
    setOriginalUrls([]);
    reset({ outputUrls: [], format: 'png' });
    setError(null);
  };
  
  const handleFormatChange = (newFormat: Format) => {
      setState(prevState => ({ ...prevState, format: newFormat }));
  }

  const handleConvert = async () => {
    if (originalUrls.length === 0) return;
    setIsLoading(true);
    setError(null);
    
    outputUrls.forEach(URL.revokeObjectURL);

    const conversionPromises = originalUrls.map(url => {
      return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
              try {
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) throw new Error(t('converter.errors.canvasInit'));
                  ctx.drawImage(img, 0, 0);
                  const dataUrl = canvas.toDataURL(`image/${format}`);
                  resolve(dataUrl);
              } catch (e) {
                  reject(e);
              }
          };
          img.onerror = () => reject(new Error(t('converter.errors.imageLoad')));
          img.src = url;
      });
    });

    try {
        const results = await Promise.all(conversionPromises);
        setState(prevState => ({ ...prevState, outputUrls: results }));
    } catch (e) {
        const message = e instanceof Error ? e.message : t('converter.errors.unexpected');
        setError(message);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleDownloadAll = async () => {
    if (outputUrls.length === 0) return;
    setIsZipping(true);
    try {
        const zip = new JSZip();
        await Promise.all(outputUrls.map(async (url, index) => {
            const file = files[index];
            const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
            const response = await fetch(url);
            const blob = await response.blob();
            zip.file(`${fileName}.${getFileExtension(format)}`, blob);
        }));

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `pixelkit-converted-images.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (e) {
        setError(t('pdfToJpg.errors.zip'));
    } finally {
        setIsZipping(false);
    }
  };

  const getFileExtension = (mimeType: Format) => {
    if (mimeType === 'jpeg') return 'jpg';
    return mimeType;
  };

  return (
    <>
      <Seo
        title={t('converter.seo.title')}
        description={t('converter.seo.description')}
        keywords={t('converter.seo.keywords')}
      />
      <PageHero 
        title={t('converter.hero.title')}
        subtitle={t('converter.hero.subtitle')}
      />
      
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">{t('converter.intro.title')}</h2>
                <p className="text-slate-300">{t('converter.intro.description')}</p>
            </div>

          {files.length === 0 && (
            <div className="max-w-4xl mx-auto">
              <FileUpload
                onFilesSelect={handleFilesSelect}
                acceptedFileTypes="image/*"
                promptText="fileUpload.prompt.image"
                maxFiles={5}
              />
            </div>
          )}

          {files.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
              {error && <ErrorMessage message={error} onClear={() => setError(null)} className="mb-6" />}
              
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 p-4 bg-slate-800/50 rounded-lg">
                <div className="flex-grow w-full md:w-auto">
                    <label htmlFor="format" className="font-semibold text-white mr-2">{t('converter.convertTo')}:</label>
                    <select
                        id="format"
                        value={format}
                        onChange={(e) => handleFormatChange(e.target.value as Format)}
                        className="p-3 border rounded-lg bg-slate-800/50 border-slate-600 focus:ring-brand-cyan focus:border-brand-cyan transition text-white"
                    >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPG</option>
                        <option value="webp">WEBP</option>
                        <option value="gif">GIF</option>
                        <option value="bmp">BMP</option>
                    </select>
                </div>
                <button
                  onClick={handleConvert}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-gradient-to-r from-brand-cyan to-brand-magenta text-white font-bold py-3 px-6 rounded-full hover:shadow-xl transition-shadow disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                  style={{boxShadow: '0 0 15px rgba(34, 211, 238, 0.3), 0 0 15px rgba(244, 114, 182, 0.3)'}}
                >
                  {isLoading ? t('common.converting') : t('converter.convertButton')}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full md:w-auto bg-slate-200/10 text-slate-200 font-semibold py-3 px-4 rounded-full hover:bg-slate-200/20 transition-colors"
                >
                  {t('common.clearImage')}
                </button>
                <HistoryControls onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
              </div>

              {/* Original Images Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">{t('converter.sectionTitle.original')} ({files.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {originalUrls.map((url, index) => (
                    <div key={index} className="bg-slate-800/50 p-2 rounded-lg relative">
                      <img src={url} alt={`${t('common.originalImage')} ${index + 1}`} className="rounded-md w-full h-auto aspect-square object-cover"/>
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded uppercase border border-white/10 shadow-sm">
                        {files[index].name.split('.').pop() || 'IMG'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Output Section */}
              {(isLoading || outputUrls.length > 0) && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                    <h3 className="font-bold text-xl text-white">{t('converter.sectionTitle.converted')} ({outputUrls.length})</h3>
                     {outputUrls.length > 0 && (
                        <button
                          onClick={handleDownloadAll}
                          disabled={isZipping}
                          className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {isZipping ? t('common.zipping') : t('converter.downloadAll')}
                        </button>
                     )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {isLoading && Array.from({ length: files.length }).map((_, index) => (
                      <SkeletonLoader key={index} className="w-full aspect-square rounded-lg" />
                    ))}
                    {!isLoading && outputUrls.map((url, index) => (
                      <div key={index} className="bg-slate-800/50 p-2 rounded-lg text-center flex flex-col gap-2 animate-fadeIn">
                        <div className="relative">
                            <img src={url} alt={`${t('converter.alt.converted')} ${index + 1}`} className="rounded-md w-full h-auto aspect-square object-cover"/>
                            <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded uppercase border border-white/10 shadow-sm">
                                {getFileExtension(format)}
                            </span>
                        </div>
                        <a
                          href={url}
                          download={`${files[index].name.split('.')[0]}-converted.${getFileExtension(format)}`}
                          className="w-full bg-slate-600 text-white text-sm font-semibold py-2 px-3 rounded-full hover:bg-slate-700 transition-colors"
                        >
                          {t('common.download')}
                        </a>
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

export default ImageConverterPage;
