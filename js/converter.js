
import { I18n } from './i18n.js';
import { History } from './history.js';

document.addEventListener('DOMContentLoaded', async () => {
    const i18n = new I18n();
    await i18n.init();
    
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    let files = [];
    let originalUrls = [];
    let isZipping = false;
    let isLoading = false;
    let error = null;

    const history = new History({ outputUrls: [], format: 'png' }, render);

    function cleanupUrls() {
        originalUrls.forEach(URL.revokeObjectURL);
        history.state.outputUrls.forEach(URL.revokeObjectURL);
    }
    
    function getFileExtension(format) {
        return format === 'jpeg' ? 'jpg' : format;
    }

    function renderFileUpload() {
        return `
            <div class="max-w-4xl mx-auto">
                <div id="file-upload-area" class="border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 border-slate-600 hover:border-brand-cyan">
                    <input id="file-input" type="file" class="hidden" accept="image/*" multiple />
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 transition-colors text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="text-slate-400" data-t="fileUpload.prompt.image"></p>
                        <p class="text-brand-cyan font-semibold" data-t="fileUpload.browse"></p>
                    </div>
                </div>
                <div id="upload-error" class="mt-4"></div>
            </div>
        `;
    }

    function renderConverter() {
        const { outputUrls, format } = history.state;
        return `
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
              <div id="error-message-container" class="mb-6"></div>
              
              <div class="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 p-4 bg-slate-800/50 rounded-lg">
                <div class="flex-grow w-full md:w-auto">
                    <label for="format" class="font-semibold text-white mr-2" data-t="converter.convertTo"></label>
                    <select id="format-select" class="p-3 border rounded-lg bg-slate-800/50 border-slate-600 focus:ring-brand-cyan focus:border-brand-cyan transition text-white">
                        <option value="png" ${format === 'png' ? 'selected' : ''}>PNG</option>
                        <option value="jpeg" ${format === 'jpeg' ? 'selected' : ''}>JPG</option>
                        <option value="webp" ${format === 'webp' ? 'selected' : ''}>WEBP</option>
                        <option value="gif" ${format === 'gif' ? 'selected' : ''}>GIF</option>
                        <option value="bmp" ${format === 'bmp' ? 'selected' : ''}>BMP</option>
                    </select>
                </div>
                <button id="convert-btn" class="w-full md:w-auto bg-gradient-to-r from-brand-cyan to-brand-magenta text-white font-bold py-3 px-6 rounded-full hover:shadow-xl transition-shadow disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center" style="box-shadow: 0 0 15px rgba(34, 211, 238, 0.3), 0 0 15px rgba(244, 114, 182, 0.3)">
                  ${isLoading ? i18n.t('common.converting') : i18n.t('converter.convertButton')}
                </button>
                <button id="reset-btn" class="w-full md:w-auto bg-slate-200/10 text-slate-200 font-semibold py-3 px-4 rounded-full hover:bg-slate-200/20 transition-colors" data-t="common.clearImage"></button>
                <div id="history-controls-container"></div>
              </div>

              <div class="mb-8">
                <h3 class="text-xl font-bold text-white mb-4" data-t="converter.sectionTitle.original"></h3>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  ${originalUrls.map((url, index) => `
                    <div class="bg-slate-800/50 p-2 rounded-lg relative">
                      <img src="${url}" alt="${i18n.t('common.originalImage')} ${index + 1}" class="rounded-md w-full h-auto aspect-square object-cover"/>
                      <span class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded uppercase border border-white/10 shadow-sm">
                        ${files[index].name.split('.').pop() || 'IMG'}
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>

              ${(isLoading || outputUrls.length > 0) ? `
                <div class="mt-8 pt-6 border-t border-white/10">
                  <div class="flex flex-wrap justify-center items-center gap-4 mb-4">
                    <h3 class="font-bold text-xl text-white" data-t="converter.sectionTitle.converted"></h3>
                     ${outputUrls.length > 0 ? `
                        <button id="download-all-btn" class="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50">
                          ${isZipping ? i18n.t('common.zipping') : i18n.t('converter.downloadAll')}
                        </button>
                     ` : ''}
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    ${isLoading ? Array.from({ length: files.length }).map(() => `
                      <div class="relative overflow-hidden bg-slate-800 rounded-lg w-full aspect-square"><div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div></div>
                    `).join('') : ''}
                    ${!isLoading ? outputUrls.map((url, index) => `
                      <div class="bg-slate-800/50 p-2 rounded-lg text-center flex flex-col gap-2 animate-fadeIn">
                        <div class="relative">
                            <img src="${url}" alt="${i18n.t('converter.alt.converted')} ${index + 1}" class="rounded-md w-full h-auto aspect-square object-cover"/>
                            <span class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded uppercase border border-white/10 shadow-sm">
                                ${getFileExtension(format)}
                            </span>
                        </div>
                        <a href="${url}" download="${files[index].name.split('.')[0]}-converted.${getFileExtension(format)}" class="w-full bg-slate-600 text-white text-sm font-semibold py-2 px-3 rounded-full hover:bg-slate-700 transition-colors" data-t="common.download"></a>
                      </div>
                    `).join('') : ''}
                  </div>
                </div>
              ` : ''}
            </div>
        `;
    }

    function render() {
        if (files.length === 0) {
            pageContent.innerHTML = renderFileUpload();
        } else {
            pageContent.innerHTML = renderConverter();
        }
        attachEventListeners();
        i18n.translatePage();
    }
    
    function attachEventListeners() {
        const fileUploadArea = document.getElementById('file-upload-area');
        const fileInput = document.getElementById('file-input');
        
        const convertBtn = document.getElementById('convert-btn');
        const resetBtn = document.getElementById('reset-btn');
        const formatSelect = document.getElementById('format-select');
        const downloadAllBtn = document.getElementById('download-all-btn');
        
        // File Upload listeners
        if (fileUploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.add('border-brand-cyan', 'bg-brand-cyan/10'), false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.remove('border-brand-cyan', 'bg-brand-cyan/10'), false);
            });
            fileUploadArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
            fileUploadArea.addEventListener('click', () => fileInput?.click());
        }
        fileInput?.addEventListener('change', (e) => handleFiles((e.target).files));

        // Converter listeners
        convertBtn?.addEventListener('click', handleConvert);
        resetBtn?.addEventListener('click', handleReset);
        formatSelect?.addEventListener('change', (e) => {
            history.setState(prevState => ({...prevState, format: e.target.value}));
        });
        downloadAllBtn?.addEventListener('click', handleDownloadAll);

        // History
        const historyContainer = document.getElementById('history-controls-container');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="flex items-center gap-2">
                    <button id="undo-btn" class="p-2 rounded-full bg-slate-700/50 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-slate-600" aria-label="Undo">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8A5 5 0 0118 18v-1"></path></svg>
                    </button>
                    <button id="redo-btn" class="p-2 rounded-full bg-slate-700/50 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-slate-600" aria-label="Redo">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8a5 5 0 00-5 5v1"></path></svg>
                    </button>
                </div>
            `;
            const undoBtn = document.getElementById('undo-btn');
            const redoBtn = document.getElementById('redo-btn');
            undoBtn.disabled = !history.canUndo;
            redoBtn.disabled = !history.canRedo;
            undoBtn.addEventListener('click', () => history.undo());
            redoBtn.addEventListener('click', () => history.redo());
        }
    }

    function handleFiles(selectedFiles) {
        cleanupUrls();
        files = Array.from(selectedFiles).slice(0, 5); // Max 5 files
        originalUrls = files.map(f => URL.createObjectURL(f));
        history.reset({ outputUrls: [], format: 'png' });
        error = null;
        render();
    }
    
    function handleReset() {
        cleanupUrls();
        files = [];
        originalUrls = [];
        history.reset({ outputUrls: [], format: 'png' });
        error = null;
        render();
    }
    
    async function handleConvert() {
        if (originalUrls.length === 0) return;
        setIsLoading(true);
        error = null;
        render();

        // Artificial delay to show loading process
        await new Promise(resolve => setTimeout(resolve, 2000));

        const conversionPromises = originalUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) throw new Error(i18n.t('converter.errors.canvasInit'));
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL(`image/${history.state.format}`);
                        resolve(dataUrl);
                    } catch (e) { reject(e); }
                };
                img.onerror = () => reject(new Error(i18n.t('converter.errors.imageLoad')));
                img.src = url;
            });
        });

        try {
            const results = await Promise.all(conversionPromises);
            history.setState(prevState => ({ ...prevState, outputUrls: results }));
        } catch (e) {
            error = e.message || i18n.t('converter.errors.unexpected');
        } finally {
            isLoading = false;
            render();
        }
    }

    async function handleDownloadAll() {
        if (history.state.outputUrls.length === 0) return;
        isZipping = true;
        render();
        try {
            const zip = new JSZip();
            await Promise.all(history.state.outputUrls.map(async (url, index) => {
                const file = files[index];
                const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
                const response = await fetch(url);
                const blob = await response.blob();
                zip.file(`${fileName}.${getFileExtension(history.state.format)}`, blob);
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
            error = i18n.t('pdfToJpg.errors.zip');
        } finally {
            isZipping = false;
            render();
        }
    }

    // Initial Render
    render();
});
