
import { I18n } from './i18n.js';
import { History } from './history.js';

document.addEventListener('DOMContentLoaded', async () => {
    const i18n = new I18n();
    await i18n.init();
    
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    let files = [];
    let isCompressing = false;
    let isZipping = false;
    let sliderValue = 0.8;
    let error = null;
    let debounceTimer;

    const history = new History({ compressedItems: [], quality: 0.8 }, render);

    function cleanupUrls() {
        history.state.compressedItems.forEach(item => URL.revokeObjectURL(item.url));
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function renderFileUpload() {
        return `
            <div class="max-w-4xl mx-auto">
                <div id="file-upload-area" class="border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 border-slate-600 hover:border-brand-cyan">
                    <input id="file-input" type="file" class="hidden" accept="image/jpeg, image/png, image/webp" multiple />
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 transition-colors text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="text-slate-400" data-t="fileUpload.prompt.compress"></p>
                        <p class="text-brand-cyan font-semibold" data-t="fileUpload.browse"></p>
                    </div>
                </div>
                 <div id="upload-error" class="mt-4"></div>
            </div>
        `;
    }

    function renderCompressor() {
        const { compressedItems, quality } = history.state;
        const totalOriginalSize = files.reduce((acc, file) => acc + file.size, 0);
        const totalCompressedSize = compressedItems.reduce((acc, item) => acc + item.size, 0);
        const totalReduction = totalOriginalSize === 0 ? 0 : ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(0);

        return `
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
                <div id="error-message-container" class="mb-6"></div>
              
                <div class="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 p-4 bg-slate-800/50 rounded-lg">
                    <div class="flex-grow w-full">
                        <label for="quality-slider" class="font-semibold mb-2 block text-white" data-t="compressor.quality">Quality: ${Math.round(sliderValue * 100)}%</label>
                        <input id="quality-slider" type="range" min="0.1" max="1" step="0.05" value="${sliderValue}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-cyan" />
                    </div>
                    <button id="reset-btn" class="w-full md:w-auto bg-slate-200/10 text-slate-200 font-semibold py-3 px-6 rounded-full hover:bg-slate-200/20 transition-colors" data-t="common.clearImage"></button>
                    <div id="history-controls-container"></div>
                </div>

                ${(isCompressing || compressedItems.length > 0) ? `
                    <div class="mt-8 pt-6 border-t border-white/10">
                        <div class="flex flex-wrap justify-center items-center gap-4 mb-4">
                            <h3 class="font-bold text-xl text-white" data-t="compressor.sectionTitle.compressed"></h3>
                            ${!isCompressing && compressedItems.length > 0 ? `
                                <p class="font-semibold text-lg text-green-400 animate-fadeIn" data-t="compressor.totalReduction" data-t-options='{"percentage": ${totalReduction}}'></p>
                                <button id="download-all-btn" class="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50">
                                    ${isZipping ? i18n.t('common.zipping') : i18n.t('compressor.downloadAll')}
                                </button>
                            ` : ''}
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            ${isCompressing ? Array.from({ length: files.length }).map(() => `
                                <div class="bg-slate-800/50 p-2 rounded-lg text-center flex flex-col gap-2">
                                    <div class="relative overflow-hidden bg-slate-800 rounded-lg w-full aspect-square"><div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div></div>
                                    <div class="relative overflow-hidden bg-slate-800 rounded-md h-4 w-3/4 mx-auto"><div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div></div>
                                    <div class="relative overflow-hidden bg-slate-800 rounded-md h-4 w-1/2 mx-auto"><div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div></div>
                                </div>
                            `).join('') : ''}
                            ${!isCompressing ? compressedItems.map((item, index) => `
                                <div class="bg-slate-800/50 p-2 rounded-lg text-center flex flex-col gap-2 animate-fadeIn">
                                    <img src="${item.url}" alt="${i18n.t('compressor.alt.compressed')} ${index + 1}" class="rounded-md w-full h-auto aspect-square object-cover"/>
                                    <div class="text-xs text-slate-300">
                                        <p>
                                            <span class="font-bold text-slate-400">${formatBytes(item.originalSize)}</span> → <span class="font-bold text-white">${formatBytes(item.size)}</span>
                                        </p>
                                        <p class="font-bold text-green-400">-${((item.originalSize - item.size) / item.originalSize * 100).toFixed(0)}%</p>
                                    </div>
                                    <a href="${item.url}" download="${item.originalFilename.split('.')[0]}-compressed.jpg" class="w-full bg-slate-600 text-white text-sm font-semibold py-2 px-3 rounded-full hover:bg-slate-700 transition-colors" data-t="common.download"></a>
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
            pageContent.innerHTML = renderCompressor();
        }
        attachEventListeners();
        i18n.translatePage();
    }
    
    function attachEventListeners() {
        const fileUploadArea = document.getElementById('file-upload-area');
        const fileInput = document.getElementById('file-input');
        
        const qualitySlider = document.getElementById('quality-slider');
        const resetBtn = document.getElementById('reset-btn');
        const downloadAllBtn = document.getElementById('download-all-btn');
        
        // File Upload
        if (fileUploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); });
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.add('border-brand-cyan', 'bg-brand-cyan/10'));
            });
            ['dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.remove('border-brand-cyan', 'bg-brand-cyan/10'));
            });
            fileUploadArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
            fileUploadArea.addEventListener('click', () => fileInput?.click());
        }
        fileInput?.addEventListener('change', (e) => handleFiles(e.target.files));

        // Compressor
        qualitySlider?.addEventListener('input', (e) => {
            sliderValue = parseFloat(e.target.value);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                history.setState(prevState => ({...prevState, quality: sliderValue}));
                compressFiles(sliderValue);
            }, 500);
            // Live update the label
            document.querySelector('label[for="quality-slider"]').textContent = `${i18n.t('compressor.quality')}: ${Math.round(sliderValue * 100)}%`;
        });
        resetBtn?.addEventListener('click', handleReset);
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
            undoBtn.addEventListener('click', () => { history.undo(); sliderValue = history.state.quality; });
            redoBtn.addEventListener('click', () => { history.redo(); sliderValue = history.state.quality; });
        }
    }

    function handleFiles(selectedFiles) {
        cleanupUrls();
        files = Array.from(selectedFiles).slice(0, 5);
        history.reset({ compressedItems: [], quality: 0.8 });
        sliderValue = 0.8;
        error = null;
        compressFiles(0.8);
    }
    
    function handleReset() {
        cleanupUrls();
        files = [];
        history.reset({ compressedItems: [], quality: 0.8 });
        sliderValue = 0.8;
        error = null;
        render();
    }
    
    async function compressFiles(quality) {
        if (files.length === 0) return;
        isCompressing = true;
        error = null;
        render();

        const compressionPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const imageUrl = URL.createObjectURL(file);
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) throw new Error(i18n.t('compressor.errors.canvasInit'));
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve({ url: URL.createObjectURL(blob), size: blob.size, originalSize: file.size, originalFilename: file.name });
                            } else { reject(new Error(i18n.t('compressor.errors.blobCreation'))); }
                            URL.revokeObjectURL(imageUrl);
                        }, 'image/jpeg', quality);
                    } catch (e) { reject(e); URL.revokeObjectURL(imageUrl); }
                };
                img.onerror = () => { reject(new Error(i18n.t('compressor.errors.imageLoad'))); URL.revokeObjectURL(imageUrl); };
                img.src = imageUrl;
            });
        });

        try {
            const results = await Promise.all(compressionPromises);
            cleanupUrls();
            history.setState(prevState => ({ ...prevState, compressedItems: results }));
        } catch (e) {
            error = e.message || i18n.t('compressor.errors.unexpected');
        } finally {
            isCompressing = false;
            render();
        }
    }
    
    async function handleDownloadAll() {
        const { compressedItems } = history.state;
        if (compressedItems.length === 0) return;
        isZipping = true;
        render();
        try {
            const zip = new JSZip();
            await Promise.all(compressedItems.map(async (item) => {
                const fileName = `${item.originalFilename.split('.')[0]}-compressed.jpg`;
                const response = await fetch(item.url);
                zip.file(fileName, await response.blob());
            }));
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `pixelkit-compressed-images.zip`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (e) {
            error = i18n.t('pdfToJpg.errors.zip');
        } finally {
            isZipping = false;
            render();
        }
    }

    render();
});
