
import { I18n } from './i18n.js';
import { History } from './history.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof pdfjsLib === 'undefined') {
        console.error('PDF.js library is not loaded.');
        return;
    }

    const i18n = new I18n();
    await i18n.init();
    
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    let file = null;
    let isLoading = false;
    let isZipping = false;
    let error = null;

    const history = new History({ pageImages: [] }, render);

    function cleanupUrls() {
        history.state.pageImages.forEach(img => URL.revokeObjectURL(img.url));
    }

    function renderFileUpload() {
        return `
            <div class="max-w-4xl mx-auto">
                <div id="file-upload-area" class="border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 border-slate-600 hover:border-brand-cyan">
                    <input id="file-input" type="file" class="hidden" accept="application/pdf" />
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 transition-colors text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="text-slate-400" data-t="fileUpload.prompt.pdf"></p>
                        <p class="text-brand-cyan font-semibold" data-t="fileUpload.browse"></p>
                    </div>
                </div>
                 <div id="upload-error" class="mt-4"></div>
            </div>
        `;
    }

    function renderProcessing() {
        return `
            <div>
                <div id="error-message-container"></div>
                ${isLoading ? `
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        ${Array.from({ length: 8 }).map(() => `
                            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 space-y-2">
                                <div class="relative overflow-hidden bg-slate-800 rounded-md w-full h-32 md:h-40"><div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div></div>
                                <div class="relative overflow-hidden bg-slate-800 rounded-md h-4 w-1/2 mx-auto"><div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div></div>
                                <div class="relative overflow-hidden bg-slate-800 rounded-md h-8 w-full"><div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div></div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${history.state.pageImages.length > 0 ? `
                    <div class="animate-fadeIn">
                        <div class="text-center mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                             <button id="download-all-btn" class="w-full sm:w-auto inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-xl transition-shadow disabled:opacity-70 flex justify-center items-center">
                                ${isZipping ? `
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span data-t="pdfToJpg.zipping"></span>...` : 
                                    `<span data-t="pdfToJpg.downloadAll"></span>`
                                }
                             </button>
                            <button id="start-over-btn" class="w-full sm:w-auto bg-slate-200/10 text-slate-200 font-semibold py-3 px-6 rounded-full hover:bg-slate-200/20 transition-colors" data-t="pdfToJpg.useAnother"></button>
                            <div id="history-controls-container"></div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            ${history.state.pageImages.map((img, index) => `
                                <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg p-3 text-center group">
                                    <img src="${img.url}" alt="${i18n.t('pdfToJpg.alt.page', { pageNumber: img.pageNumber })}" class="rounded-md w-full h-auto mb-3"/>
                                    <p class="font-bold text-sm mb-3 text-white" data-t="pdfToJpg.page" data-t-options='{ "pageNumber": ${img.pageNumber} }'>Page ${img.pageNumber}</p>
                                    <button data-url="${img.url}" data-page="${img.pageNumber}" class="download-btn w-full bg-gradient-to-r from-brand-cyan to-brand-magenta text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-all" data-t="common.download"></button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    function render() {
        if (!file) {
            pageContent.innerHTML = renderFileUpload();
        } else {
            pageContent.innerHTML = renderProcessing();
        }
        attachEventListeners();
        i18n.translatePage();
    }
    
    function attachEventListeners() {
        // File Upload
        const fileUploadArea = document.getElementById('file-upload-area');
        const fileInput = document.getElementById('file-input');
        if (fileUploadArea) {
             ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); });
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.add('border-brand-cyan', 'bg-brand-cyan/10'));
            });
            ['dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.remove('border-brand-cyan', 'bg-brand-cyan/10'));
            });
            fileUploadArea.addEventListener('drop', e => handleFileSelect(e.dataTransfer.files));
            fileUploadArea.addEventListener('click', () => fileInput?.click());
        }
        fileInput?.addEventListener('change', e => handleFileSelect(e.target.files));

        // Processing
        document.getElementById('start-over-btn')?.addEventListener('click', handleStartOver);
        document.getElementById('download-all-btn')?.addEventListener('click', handleDownloadAll);
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                downloadImage(target.dataset.url, target.dataset.page);
            });
        });
        
        // History
        const historyContainer = document.getElementById('history-controls-container');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="flex items-center gap-2">
                    <button id="undo-btn" class="p-2 rounded-full bg-slate-700/50 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-slate-600" aria-label="Undo"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8A5 5 0 0118 18v-1"></path></svg></button>
                    <button id="redo-btn" class="p-2 rounded-full bg-slate-700/50 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-slate-600" aria-label="Redo"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8a5 5 0 00-5 5v1"></path></svg></button>
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

    function handleFileSelect(selectedFiles) {
        const selectedFile = selectedFiles[0];
        if (!selectedFile) return;
        file = selectedFile;
        history.reset({ pageImages: [] });
        error = null;
        processPdf(selectedFile);
    }

    async function processPdf(pdfFile) {
        isLoading = true;
        render();
        const fileReader = new FileReader();
        fileReader.onload = async () => {
            try {
                const typedarray = new Uint8Array(fileReader.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const images = [];
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
                history.setState({ pageImages: images });
            } catch (err) {
                error = i18n.t('pdfToJpg.errors.process');
                console.error(err);
            } finally {
                isLoading = false;
                render();
            }
        };
        fileReader.readAsArrayBuffer(pdfFile);
    }
    
    function downloadImage(url, pageNum) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file?.name.replace('.pdf', '')}-${i18n.t('pdfToJpg.page').toLowerCase()}-${pageNum}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function handleDownloadAll() {
        const { pageImages } = history.state;
        if (pageImages.length === 0 || !file) return;
        isZipping = true;
        error = null;
        render();
        try {
            const zip = new JSZip();
            for (const img of pageImages) {
                const base64Data = img.url.split(',')[1];
                zip.file(`${file.name.replace('.pdf', '')}-${i18n.t('pdfToJpg.page').toLowerCase()}-${img.pageNumber}.jpg`, base64Data, { base64: true });
            }
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `${file.name.replace('.pdf', '')}-images.zip`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            error = i18n.t('pdfToJpg.errors.zip');
        } finally {
            isZipping = false;
            render();
        }
    }
    
    function handleStartOver() {
        cleanupUrls();
        file = null;
        history.reset({ pageImages: [] });
        render();
    }

    render();
});
