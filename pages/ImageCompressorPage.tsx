import React, { useState, useEffect, useMemo } from 'react';
import FileUpload from '../components/FileUpload';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { useHistory } from '../hooks/useHistory';
import { useDebounce } from '../hooks/useDebounce';
import HistoryControls from '../components/HistoryControls';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation } from '../hooks/useTranslation';
import SkeletonLoader from '../components/SkeletonLoader';

declare const JSZip: any;

interface CompressedItem {
    url: string;
    size: number;
    originalSize: number;
    originalFilename: string;
}

interface CompressorState {
  compressedItems: CompressedItem[];
  quality: number;
}

const ImageCompressorPage: React.FC = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [sliderValue, setSliderValue] = useState(0.8);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQuality = useDebounce(sliderValue, 500);

  const { state, setState, undo, redo, canUndo, canRedo, reset } = useHistory<CompressorState>({
    compressedItems: [],
    quality: 0.8,
  });
  
  const { compressedItems, quality } = state;

  useEffect(() => {
    // Clean up object URLs on unmount
    return () => {
      compressedItems.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [compressedItems]);
  
  const handleFilesSelect = (selectedFiles: File[]) => {
    compressedItems.forEach(item => URL.revokeObjectURL(item.url));
    setFiles(selectedFiles);
    reset({ compressedItems: [], quality: 0.8 });
    setSliderValue(0.8);
    setError(null);
  };
  
  const handleReset = () => {
    compressedItems.forEach(item => URL.revokeObjectURL(item.url));
    setFiles([]);
    reset({ compressedItems: [], quality: 0.8 });
    setSliderValue(0.8);
    setError(null);
  };

  useEffect(() => {
    if (files.length === 0) return;

    setIsCompressing(true);
    setError(null);

    const compressionPromises = files.map(file => {
      return new Promise<CompressedItem>((resolve, reject) => {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error(t('compressor.errors.canvasInit'));
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                resolve({
                    url: URL.createObjectURL(blob),
                    size: blob.size,
                    originalSize: file.size,
                    originalFilename: file.name
                });
              } else {
                 reject(new Error(t('compressor.errors.blobCreation')));
              }
              URL.revokeObjectURL(imageUrl); // Clean up original object URL
            }, 'image/jpeg', debouncedQuality);
          } catch (e) {
              reject(e);
              URL.revokeObjectURL(imageUrl);
          }
        };
        img.onerror = () => {
          reject(new Error(t('compressor.errors.imageLoad')));
          URL.revokeObjectURL(imageUrl);
        };
        img.src = imageUrl;
      });
    });
    
    Promise.all(compressionPromises)
      .then(results => {
        compressedItems.forEach(item => URL.revokeObjectURL(item.url)); // Clean up old compressed URLs
        setState({
          compressedItems: results,
          quality: debouncedQuality
        });
      })
      .catch(e => {
        const message = e instanceof Error ? e.message : t('compressor.errors.unexpected');
        setError(message);
      })
      .finally(() => {
        setIsCompressing(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuality, files, t]);

  useEffect(() => {
      setSliderValue(quality);
  }, [quality]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const totalOriginalSize = useMemo(() => files.reduce((acc, file) => acc + file.size, 0), [files]);
  const totalCompressedSize = useMemo(() => compressedItems.reduce((acc, item) => acc + item.size, 0), [compressedItems]);
  const totalReduction = useMemo(() => {
      if(totalOriginalSize === 0) return 0;
      return ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(0);
  }, [totalOriginalSize, totalCompressedSize]);
  
  const handleDownloadAll = async () => {
    if (compressedItems.length === 0) return;
    setIsZipping(true);
    try {
        const zip = new JSZip();
        await Promise.all(compressedItems.map(async (item) => {
            const fileName = (item.originalFilename.substring(0, item.originalFilename.lastIndexOf('.')) || 'image') + '-compressed.jpg';
            const response = await fetch(item.url);
            const blob = await response.blob();
            zip.file(fileName, blob);
        }));

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `pixelkit-compressed-images.zip`;
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

  return (
    <>
      <Seo
        title={t('compressor.seo.title')}
        description={t('compressor.seo.description')}
        keywords={t('compressor.seo.keywords')}
      />
      <PageHero
        title={t('compressor.hero.title')}
        subtitle={t('compressor.hero.subtitle')}
      />

      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">{t('compressor.intro.title')}</h2>
                <p className="text-slate-300">{t('compressor.intro.description')}</p>
            </div>

          {files.length === 0 && (
            <div className="max-w-4xl mx-auto">
              <FileUpload
                onFilesSelect={handleFilesSelect}
                acceptedFileTypes="image/jpeg, image/png, image/webp"
                promptText="fileUpload.prompt.compress"
                maxFiles={5}
              />
            </div>
          )}

          {files.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
              {error && <ErrorMessage message={error} onClear={() => setError(null)} className="mb-6" />}
              
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 p-4 bg-slate-800/50 rounded-lg">
                <div className="flex-grow w-full">
                  <label htmlFor="quality" className="font-semibold mb-2 block text-white">{t('compressor.quality')}: {Math.round(sliderValue * 100)}%</label>
                  <input
                      id="quality"
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                  />
                </div>
                 <button
                  onClick={handleReset}
                  className="w-full md:w-auto bg-slate-200/10 text-slate-200 font-semibold py-3 px-6 rounded-full hover:bg-slate-200/20 transition-colors"
                >
                  {t('common.clearImage')}
                </button>
                <HistoryControls onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
              </div>

              {(isCompressing || compressedItems.length > 0) &&
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                    <h3 className="font-bold text-xl text-white">{t('compressor.sectionTitle.compressed')} ({compressedItems.length})</h3>
                     {!isCompressing && compressedItems.length > 0 && (
                        <>
                          <p className="font-semibold text-lg text-green-400 animate-fadeIn">{t('compressor.totalReduction', { percentage: totalReduction })}</p>
                          <button
                            onClick={handleDownloadAll}
                            disabled={isZipping}
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isZipping ? t('common.zipping') : t('compressor.downloadAll')}
                          </button>
                        </>
                     )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {isCompressing && Array.from({ length: files.length }).map((_, i) => 
                        <div key={i} className="bg-slate-800/50 p-2 rounded-lg text-center flex flex-col gap-2">
                            <SkeletonLoader className="w-full aspect-square rounded-lg" />
                            <SkeletonLoader className="h-4 w-3/4 mx-auto" />
                            <SkeletonLoader className="h-4 w-1/2 mx-auto" />
                        </div>
                    )}
                    {!isCompressing && compressedItems.map((item, index) => {
                       const reduction = ((item.originalSize - item.size) / item.originalSize * 100).toFixed(0);
                       return (
                          <div key={index} className="bg-slate-800/50 p-2 rounded-lg text-center flex flex-col gap-2 animate-fadeIn">
                            <img src={item.url} alt={`${t('compressor.alt.compressed')} ${index + 1}`} className="rounded-md w-full h-auto aspect-square object-cover"/>
                            <div className="text-xs text-slate-300">
                                <p>
                                  <span className="font-bold text-slate-400">{formatBytes(item.originalSize)}</span> → <span className="font-bold text-white">{formatBytes(item.size)}</span>
                                </p>
                                <p className="font-bold text-green-400">-{reduction}%</p>
                            </div>
                            <a
                              href={item.url}
                              download={`${item.originalFilename.split('.')[0]}-compressed.jpg`}
                              className="w-full bg-slate-600 text-white text-sm font-semibold py-2 px-3 rounded-full hover:bg-slate-700 transition-colors"
                            >
                              {t('common.download')}
                            </a>
                          </div>
                       )
                    })}
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageCompressorPage;