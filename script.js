"use strict";

/* =========================================================
   FILECONVERTER
   Browser-only conversion engine
========================================================= */

/* =========================================================
   DOM
========================================================= */

const toolsGrid = document.getElementById("toolsGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category");

const workspace = document.getElementById("workspace");
const workspaceTitle = document.getElementById("workspaceTitle");
const workspaceDescription = document.getElementById("workspaceDescription");
const workspaceIcon = document.getElementById("workspaceIcon");
const closeBtn = document.getElementById("closeBtn");

const dropZone = document.getElementById("dropZone");
const chooseBtn = document.getElementById("chooseBtn");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const fileTypes = document.getElementById("fileTypes");

const optionsBox = document.getElementById("options");
const startBtn = document.getElementById("startBtn");

const progressBox = document.getElementById("progressBox");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const downloadBtn = document.getElementById("downloadBtn");

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

/* =========================================================
   STATE
========================================================= */

let currentToolId = null;
let selectedFiles = [];
let currentDownloadUrl = null;

/* =========================================================
   TOOLS
========================================================= */

const tools = {

    "jpg-to-png": {
        title: "JPG to PNG",
        icon: "🖼️",
        description: "Convert JPG images into PNG.",
        accept: "image/jpeg,.jpg,.jpeg",
        multiple: false,
        category: "image",
        type: "image",
        output: "png"
    },

    "png-to-jpg": {
        title: "PNG to JPG",
        icon: "🖼️",
        description: "Convert PNG images into JPG.",
        accept: "image/png,.png",
        multiple: false,
        category: "image",
        type: "image",
        output: "jpg"
    },

    "jpg-to-webp": {
        title: "JPG to WebP",
        icon: "⚡",
        description: "Convert JPG images into WebP.",
        accept: "image/jpeg,.jpg,.jpeg",
        multiple: false,
        category: "image",
        type: "image",
        output: "webp"
    },

    "png-to-webp": {
        title: "PNG to WebP",
        icon: "⚡",
        description: "Convert PNG images into WebP.",
        accept: "image/png,.png",
        multiple: false,
        category: "image",
        type: "image",
        output: "webp"
    },

    "webp-to-jpg": {
        title: "WebP to JPG",
        icon: "🖼️",
        description: "Convert WebP images into JPG.",
        accept: "image/webp,.webp",
        multiple: false,
        category: "image",
        type: "image",
        output: "jpg"
    },

    "webp-to-png": {
        title: "WebP to PNG",
        icon: "🖼️",
        description: "Convert WebP images into PNG.",
        accept: "image/webp,.webp",
        multiple: false,
        category: "image",
        type: "image",
        output: "png"
    },

    "compress-image": {
        title: "Compress Image",
        icon: "🗜️",
        description: "Reduce image file size.",
        accept: "image/*",
        multiple: false,
        category: "image",
        type: "compress"
    },

    "resize-image": {
        title: "Resize Image",
        icon: "↔️",
        description: "Resize an image to custom dimensions.",
        accept: "image/*",
        multiple: false,
        category: "image",
        type: "resize"
    },

    "rotate-image": {
        title: "Rotate Image",
        icon: "🔃",
        description: "Rotate an image.",
        accept: "image/*",
        multiple: false,
        category: "image",
        type: "rotate"
    },

    "jpg-to-pdf": {
        title: "JPG to PDF",
        icon: "📄",
        description: "Convert JPG images into PDF.",
        accept: "image/jpeg,.jpg,.jpeg",
        multiple: true,
        category: "pdf",
        type: "image-pdf"
    },

    "png-to-pdf": {
        title: "PNG to PDF",
        icon: "📄",
        description: "Convert PNG images into PDF.",
        accept: "image/png,.png",
        multiple: true,
        category: "pdf",
        type: "image-pdf"
    },

    "images-to-pdf": {
        title: "Images to PDF",
        icon: "📚",
        description: "Combine multiple images into one PDF.",
        accept: "image/*",
        multiple: true,
        category: "pdf",
        type: "image-pdf"
    },

    "pdf-to-jpg": {
        title: "PDF to JPG",
        icon: "📄",
        description: "Convert PDF pages into JPG images.",
        accept: "application/pdf,.pdf",
        multiple: false,
        category: "pdf",
        type: "pdf-to-image",
        output: "jpg"
    },

    "pdf-to-png": {
        title: "PDF to PNG",
        icon: "📄",
        description: "Convert PDF pages into PNG images.",
        accept: "application/pdf,.pdf",
        multiple: false,
        category: "pdf",
        type: "pdf-to-image",
        output: "png"
    },

    "merge-pdf": {
        title: "Merge PDF",
        icon: "📑",
        description: "Combine multiple PDF files into one PDF.",
        accept: "application/pdf,.pdf",
        multiple: true,
        category: "pdf",
        type: "merge-pdf"
    },

    "compress-pdf": {
        title: "Compress PDF",
        icon: "🗜️",
        description: "Reduce PDF file size in your browser.",
        accept: "application/pdf,.pdf",
        multiple: false,
        category: "pdf",
        type: "compress-pdf"
    },
"pdf-to-excel": {
    title: "PDF to Excel",
    icon: "📊",
    description: "Extract tables and data from PDF into Excel.",
    accept: "application/pdf,.pdf",
    multiple: false,
    category: "pdf",
    type: "pdf-to-excel"
},
    "pdf-to-text": {
    title: "PDF to Text",
    icon: "📝",
    description: "Extract text from PDF files.",
    accept: "application/pdf,.pdf",
    multiple: false,
    category: "pdf",
    type: "pdf-to-text"
},

    "text-to-pdf": {
    title: "Text to PDF",
    icon: "📃",
    description: "Convert text files into PDF documents.",
    accept: ".txt,text/plain",
    multiple: false,
    category: "document",
    type: "text-to-pdf"
},

    "pdf-to-word": {
        title: "PDF to Word",
        icon: "📝",
        description: "PDF to editable Word document.",
        accept: "application/pdf,.pdf",
        multiple: false,
        category: "document",
        type: "pdf-to-word"
    },

    "word-to-pdf": {
    title: "Word to PDF",
    icon: "📘",
    description: "Convert Word documents to PDF.",
    accept: ".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword",
    multiple: false,
    category: "document",
    type: "word-to-pdf"
},

    "excel-to-pdf": {
        title: "Excel to PDF",
        icon: "📊",
        description: "Convert spreadsheets into PDF.",
        accept: ".xls,.xlsx",
        multiple: false,
        category: "document",
        type: "excel-to-pdf"
    }
};

/* =========================================================
   RENDER TOOLS
========================================================= */

function renderTools(filter = "all", search = "") {

    if (!toolsGrid) return;

    toolsGrid.innerHTML = "";

    const query = search.trim().toLowerCase();

    Object.entries(tools).forEach(([id, tool]) => {

        if (
            filter !== "all" &&
            tool.category !== filter
        ) {
            return;
        }

        const searchable = (
            tool.title +
            " " +
            tool.description
        ).toLowerCase();

        if (
            query &&
            !searchable.includes(query)
        ) {
            return;
        }

        const card = document.createElement("article");

        card.className = "tool-card";

        card.innerHTML = `
            <div class="tool-icon">
                ${tool.icon}
            </div>

            <h3>
                ${escapeHtml(tool.title)}
            </h3>

            <p>
                ${escapeHtml(tool.description)}
            </p>

            <button
                class="tool-btn"
                type="button"
            >
                Use Tool
            </button>
        `;

        card
            .querySelector(".tool-btn")
            .addEventListener(
                "click",
                () => openTool(id)
            );

        toolsGrid.appendChild(card);
    });
}

renderTools();

/* =========================================================
   CATEGORY FILTER
========================================================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(
            b => b.classList.remove("active")
        );

        button.classList.add("active");

        renderTools(
            button.dataset.category || "all",
            searchInput ? searchInput.value : ""
        );
    });

});

/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const active =
                document.querySelector(
                    ".category.active"
                );

            renderTools(
                active
                    ? active.dataset.category
                    : "all",
                searchInput.value
            );
        }
    );
}

/* =========================================================
   OPEN TOOL
========================================================= */

function openTool(id) {

    const tool = tools[id];

    if (!tool) return;

    currentToolId = id;
    selectedFiles = [];

    workspaceTitle.textContent = tool.title;
    workspaceDescription.textContent = tool.description;
    workspaceIcon.textContent = tool.icon;

    fileInput.value = "";
    fileInput.accept = tool.accept;
    fileInput.multiple = !!tool.multiple;

    fileTypes.textContent =
        "Supported: " + tool.accept;

    fileList.innerHTML = "";
    optionsBox.innerHTML = "";

    resultBox.classList.add("hidden");
    progressBox.classList.add("hidden");

    startBtn.disabled = true;

    createOptions(tool);

    workspace.classList.remove("hidden");

    workspace.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================================
   OPTIONS
========================================================= */

function createOptions(tool) {

    if (tool.type === "compress") {

        optionsBox.innerHTML = `
            <label>
                Image Quality
            </label>

            <select id="qualitySelect">
                <option value="0.9">
                    High Quality
                </option>

                <option value="0.75" selected>
                    Balanced
                </option>

                <option value="0.55">
                    Smaller File
                </option>
            </select>
        `;
    }

    if (tool.type === "compress-pdf") {

        optionsBox.innerHTML = `
            <label>
                PDF Compression Quality
            </label>

            <select id="pdfQuality">
                <option value="0.85">
                    High Quality
                </option>

                <option value="0.65" selected>
                    Balanced
                </option>

                <option value="0.45">
                    Smaller File
                </option>
            </select>

            <p class="option-note">
                The PDF is rebuilt in your browser.
                Text may be converted into page images.
            </p>
        `;
    }

    if (tool.type === "resize") {

        optionsBox.innerHTML = `
            <label>
                Width (px)
            </label>

            <input
                id="resizeWidth"
                type="number"
                min="1"
                placeholder="Example: 1200"
            >

            <br><br>

            <label>
                Height (px)
            </label>

            <input
                id="resizeHeight"
                type="number"
                min="1"
                placeholder="Example: 800"
            >
        `;
    }

    if (tool.type === "rotate") {

        optionsBox.innerHTML = `
            <label>
                Rotation
            </label>

            <select id="rotationSelect">
                <option value="90">
                    90°
                </option>

                <option value="180">
                    180°
                </option>

                <option value="270">
                    270°
                </option>
            </select>
        `;
    }
}

/* =========================================================
   FILE PICKER
========================================================= */

if (chooseBtn) {

    chooseBtn.addEventListener(
        "click",
        () => fileInput.click()
    );
}

if (fileInput) {

    fileInput.addEventListener(
        "change",
        () => {

            selectedFiles =
                Array.from(fileInput.files || []);

            showFiles();
        }
    );
}

/* =========================================================
   DRAG & DROP
========================================================= */

if (dropZone) {

    dropZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            dropZone.classList.add(
                "dragover"
            );
        }
    );

    dropZone.addEventListener(
        "dragleave",
        () => {

            dropZone.classList.remove(
                "dragover"
            );
        }
    );

    dropZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            dropZone.classList.remove(
                "dragover"
            );

            selectedFiles =
                Array.from(
                    event.dataTransfer.files || []
                );

            showFiles();
        }
    );
}

/* =========================================================
   SHOW FILES
========================================================= */

function showFiles() {

    fileList.innerHTML = "";

    const maxFileSize =
        50 * 1024 * 1024;

    const oversizedFiles =
        selectedFiles.filter(
            file => file.size > maxFileSize
        );

    if (oversizedFiles.length > 0) {

        startBtn.disabled = true;

        fileList.innerHTML = `
            <div class="file-item">
                <span class="file-name">
                    ⚠️ File too large
                </span>

                <span class="file-size">
                    Maximum allowed size: 50 MB
                </span>
            </div>
        `;

        return;
    }

    if (!selectedFiles.length) {

        startBtn.disabled =
            true;

        return;

    }

    selectedFiles.forEach(file => {

        const item =
            document.createElement("div");

        item.className =
            "file-item";

        item.innerHTML = `
            <span class="file-name">
                ${escapeHtml(file.name)}
            </span>

            <span class="file-size">
                ${formatBytes(file.size)}
            </span>
        `;

        fileList.appendChild(item);

    });

    startBtn.disabled =
        false;

}

/* =========================================================
   START CONVERSION
========================================================= */

startBtn.addEventListener(
    "click",
    async () => {

        if (
            !selectedFiles.length ||
            !currentToolId
        ) {
            return;
        }

        const tool =
            tools[currentToolId];

        resultBox.classList.add("hidden");
        progressBox.classList.remove("hidden");

        startBtn.disabled = true;

        try {

            let result = null;

            if (
                tool.type === "image" ||
                tool.type === "compress" ||
                tool.type === "resize" ||
                tool.type === "rotate"
            ) {

                result =
                    await processImage(
                        selectedFiles[0],
                        tool
                    );
            }

            else if (
                tool.type === "image-pdf"
            ) {

                result =
                    await imagesToPDF(
                        selectedFiles
                    );
            }

            else if (
                tool.type === "pdf-to-image"
            ) {

                result =
                    await pdfToImages(
                        selectedFiles[0],
                        tool.output
                    );
            }

            else if (
                tool.type === "merge-pdf"
            ) {

                result =
                    await mergePDFs(
                        selectedFiles
                    );
            }

            else if (
                tool.type === "compress-pdf"
            ) {

                result =
                    await compressPDF(
                        selectedFiles[0]
                    );
            }
              else if (
    tool.type === "excel-to-pdf"
) {

    result =
        await excelToPDF(
            selectedFiles[0]
        );

}
else if (
    tool.type === "pdf-to-excel"
) {

    result =
        await pdfToExcel(
            selectedFiles[0]
        );

}
  else if (
    tool.type === "pdf-to-text"
) {

    result =
        await pdfToText(
            selectedFiles[0]
        );

}
    else if (
    tool.type === "text-to-pdf"
) {

    result =
        await textToPDF(
            selectedFiles[0]
        );

}
      else if (
    tool.type === "word-to-pdf"
) {

    result =
        await wordToPDF(
            selectedFiles[0]
        );

}
        else if (
    tool.type === "pdf-to-word"
) {

    result =
        await pdfToWord(
            selectedFiles[0]
        );

}
            else if (
                tool.type === "coming"
            ) {

                throw new Error(
                    "This tool is not available yet."
                );
            }

            if (!result) {

                throw new Error(
                    "No output file was created."
                );
            }

            showResult(result);

        }

        catch (error) {

            console.error(
                "FileConverter error:",
                error
            );

            progressBox.classList.add(
                "hidden"
            );

            alert(
                "Conversion failed\n\n" +
                (
                    error?.message ||
                    "Please try again."
                )
            );
        }

        finally {

            startBtn.disabled = false;
        }
    }
);

/* =========================================================
   IMAGE PROCESSING
========================================================= */

async function processImage(file, tool) {

    setProgress(
        15,
        "Loading image..."
    );

    const image =
        await loadImage(file);

    let width =
        image.naturalWidth;

    let height =
        image.naturalHeight;

    if (tool.type === "resize") {

        const widthInput =
            document.getElementById(
                "resizeWidth"
            );

        const heightInput =
            document.getElementById(
                "resizeHeight"
            );

        const requestedWidth =
            parseInt(
                widthInput?.value
            );

        const requestedHeight =
            parseInt(
                heightInput?.value
            );

        if (
            !requestedWidth &&
            !requestedHeight
        ) {

            throw new Error(
                "Enter a width or height."
            );
        }

        if (
            requestedWidth &&
            requestedHeight
        ) {

            width = requestedWidth;
            height = requestedHeight;

        }

        else if (requestedWidth) {

            const ratio =
                image.naturalHeight /
                image.naturalWidth;

            width = requestedWidth;

            height =
                Math.round(
                    requestedWidth * ratio
                );

        }

        else {

            const ratio =
                image.naturalWidth /
                image.naturalHeight;

            height = requestedHeight;

            width =
                Math.round(
                    requestedHeight * ratio
                );
        }
    }

    let rotation = 0;

    if (tool.type === "rotate") {

        rotation =
            parseInt(
                document.getElementById(
                    "rotationSelect"
                )?.value || 90
            );
    }

    if (
        rotation === 90 ||
        rotation === 270
    ) {

        [
            width,
            height
        ] = [
            height,
            width
        ];
    }

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = width;
    canvas.height = height;

    const context =
        canvas.getContext("2d");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    if (rotation === 90) {

        context.translate(
            width,
            0
        );

        context.rotate(
            Math.PI / 2
        );
    }

    else if (rotation === 180) {

        context.translate(
            width,
            height
        );

        context.rotate(
            Math.PI
        );
    }

    else if (rotation === 270) {

        context.translate(
            0,
            height
        );

        context.rotate(
            3 * Math.PI / 2
        );
    }

    context.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        (
            rotation === 90 ||
            rotation === 270
        )
            ? height
            : width,
        (
            rotation === 90 ||
            rotation === 270
        )
            ? width
            : height
    );

    setProgress(
        70,
        "Processing image..."
    );

    let mime = "image/png";
    let extension = "png";
    let quality = undefined;

    if (tool.output === "jpg") {

        mime = "image/jpeg";
        extension = "jpg";

        context.globalCompositeOperation =
            "destination-over";

        context.fillStyle = "#ffffff";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    else if (tool.output === "webp") {

        mime = "image/webp";
        extension = "webp";
    }

    if (tool.type === "compress") {

        mime = "image/jpeg";
        extension = "jpg";

        const select =
            document.getElementById(
                "qualitySelect"
            );

        quality =
            parseFloat(
                select?.value || 0.75
            );

        context.globalCompositeOperation =
            "destination-over";

        context.fillStyle = "#ffffff";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    setProgress(
        90,
        "Preparing download..."
    );

    const blob =
        await canvasToBlob(
            canvas,
            mime,
            quality
        );

    return {

        blob,

        filename:
            removeExtension(
                file.name
            ) +
            "." +
            extension,

        message:
            "Your image is ready."
    };
}

/* =========================================================
   IMAGES TO PDF
========================================================= */

async function imagesToPDF(files) {

    setProgress(
        10,
        "Preparing images..."
    );

    const { jsPDF } =
        await loadJsPDF();

    const pdf =
        new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4"
        });

    for (
        let i = 0;
        i < files.length;
        i++
    ) {

        setProgress(
            15 +
            Math.round(
                i /
                files.length *
                70
            ),
            `Adding image ${i + 1} of ${files.length}...`
        );

        const image =
            await loadImage(
                files[i]
            );

        if (i > 0) {
            pdf.addPage();
        }

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        const ratio =
            Math.min(
                pageWidth /
                    image.naturalWidth,

                pageHeight /
                    image.naturalHeight
            );

        const width =
            image.naturalWidth *
            ratio;

        const height =
            image.naturalHeight *
            ratio;

        const x =
            (pageWidth - width) / 2;

        const y =
            (pageHeight - height) / 2;

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width =
            image.naturalWidth;

        canvas.height =
            image.naturalHeight;

        canvas
            .getContext("2d")
            .drawImage(
                image,
                0,
                0
            );

        const data =
            canvas.toDataURL(
                "image/jpeg",
                0.92
            );

        pdf.addImage(
            data,
            "JPEG",
            x,
            y,
            width,
            height
        );
    }

    setProgress(
        95,
        "Creating PDF..."
    );

    const blob =
        pdf.output("blob");

    return {

        blob,

        filename:
            "converted-images.pdf",

        message:
            `${files.length} image(s) converted successfully.`
    };
}

/* =========================================================
   PDF TO JPG / PNG
========================================================= */

async function pdfToImages(
    file,
    output = "jpg"
) {

    setProgress(
        10,
        "Loading PDF..."
    );

    await ensurePDFJS();

    const buffer =
        await file.arrayBuffer();

    const pdf =
        await window.pdfjsLib
            .getDocument({
                data: buffer
            })
            .promise;

    const files = [];

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        setProgress(
            15 +
            Math.round(
                (
                    (pageNumber - 1) /
                    pdf.numPages
                ) * 70
            ),
            `Converting page ${pageNumber} of ${pdf.numPages}...`
        );

        const page =
            await pdf.getPage(
                pageNumber
            );

        const scale = 2;

        const viewport =
            page.getViewport({
                scale
            });

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width =
            Math.ceil(
                viewport.width
            );

        canvas.height =
            Math.ceil(
                viewport.height
            );

        const context =
            canvas.getContext("2d");

        await page.render({

            canvasContext:
                context,

            viewport:
                viewport

        }).promise;

        const mime =
            output === "png"
                ? "image/png"
                : "image/jpeg";

        const quality =
            output === "jpg"
                ? 0.92
                : undefined;

        const blob =
            await canvasToBlob(
                canvas,
                mime,
                quality
            );

        files.push({

            blob,

            filename:
                removeExtension(
                    file.name
                ) +
                `-page-${pageNumber}.` +
                output
        });
    }

    setProgress(
        90,
        "Preparing download..."
    );

    if (files.length === 1) {

        return {

            blob:
                files[0].blob,

            filename:
                files[0].filename,

            message:
                "PDF page converted successfully."
        };
    }

    await ensureJSZip();

    const zip =
        new window.JSZip();

    files.forEach(item => {

        zip.file(
            item.filename,
            item.blob
        );
    });

    const zipBlob =
        await zip.generateAsync({
            type: "blob"
        });

    return {

        blob:
            zipBlob,

        filename:
            removeExtension(
                file.name
            ) +
            "-images.zip",

        message:
            `${files.length} PDF pages converted successfully.`
    };
}

/* =========================================================
   MERGE PDF
========================================================= */

async function mergePDFs(files) {

    if (
        !files ||
        files.length < 2
    ) {

        throw new Error(
            "Please select at least 2 PDF files."
        );
    }

    await ensurePDFLib();

    setProgress(
        10,
        "Preparing PDF files..."
    );

    const mergedPdf =
        await window.PDFLib.PDFDocument.create();

    for (
        let i = 0;
        i < files.length;
        i++
    ) {

        setProgress(
            15 +
            Math.round(
                (i / files.length) * 70
            ),
            `Adding PDF ${i + 1} of ${files.length}...`
        );

        const arrayBuffer =
            await files[i].arrayBuffer();

        const sourcePdf =
            await window.PDFLib.PDFDocument.load(
                arrayBuffer
            );

        const pages =
            await mergedPdf.copyPages(
                sourcePdf,
                sourcePdf.getPageIndices()
            );

        pages.forEach(page => {

            mergedPdf.addPage(page);

        });
    }

    setProgress(
        90,
        "Creating merged PDF..."
    );

    const pdfBytes =
        await mergedPdf.save();

    const blob =
        new Blob(
            [pdfBytes],
            {
                type: "application/pdf"
            }
        );

    return {

        blob,

        filename:
            "merged.pdf",

        message:
            `${files.length} PDF files merged successfully.`
    };
}

/* =========================================================
   COMPRESS PDF
   Browser-only rebuild
========================================================= */

async function compressPDF(file) {

    if (!file) {

        throw new Error(
            "Please select a PDF file."
        );
    }

    setProgress(
        5,
        "Loading PDF compression engine..."
    );

    await ensurePDFJS();

    const { jsPDF } =
        await loadJsPDF();

    const qualityElement =
        document.getElementById(
            "pdfQuality"
        );

    const quality =
        parseFloat(
            qualityElement?.value || 0.65
        );

    const buffer =
        await file.arrayBuffer();

    const pdf =
        await window.pdfjsLib
            .getDocument({
                data: buffer
            })
            .promise;

    if (!pdf.numPages) {

        throw new Error(
            "The PDF contains no pages."
        );
    }

    const outputPdf =
        new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4",
            compress: true
        });

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        setProgress(
            10 +
            Math.round(
                (
                    (pageNumber - 1) /
                    pdf.numPages
                ) * 75
            ),
            `Compressing page ${pageNumber} of ${pdf.numPages}...`
        );

        const page =
            await pdf.getPage(
                pageNumber
            );

        const originalViewport =
            page.getViewport({
                scale: 1
            });

        const maxDimension = 1600;

        const scale =
            Math.min(
                1.8,
                maxDimension /
                Math.max(
                    originalViewport.width,
                    originalViewport.height
                )
            );

        const viewport =
            page.getViewport({
                scale: Math.max(
                    scale,
                    1
                )
            });

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width =
            Math.ceil(
                viewport.width
            );

        canvas.height =
            Math.ceil(
                viewport.height
            );

        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );

        context.fillStyle =
            "#ffffff";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        await page.render({

            canvasContext:
                context,

            viewport:
                viewport

        }).promise;

        const imageData =
            canvas.toDataURL(
                "image/jpeg",
                quality
            );

        if (pageNumber > 1) {

            outputPdf.addPage(
                [
                    originalViewport.width,
                    originalViewport.height
                ]
            );
        }

        outputPdf.addImage(
            imageData,
            "JPEG",
            0,
            0,
            originalViewport.width,
            originalViewport.height,
            undefined,
            "FAST"
        );
    }

    setProgress(
        95,
        "Creating compressed PDF..."
    );

    const blob =
        outputPdf.output(
            "blob"
        );

    const originalSize =
        file.size;

    const newSize =
        blob.size;

    let message;

    if (newSize < originalSize) {

        const reduction =
            (
                1 -
                newSize /
                originalSize
            ) * 100;

        message =
            `PDF compressed successfully. File size reduced by ${reduction.toFixed(1)}%.`;

    } else {

        message =
            "PDF rebuilt successfully. This PDF was already highly compressed, so the file size could not be reduced further.";
    }

    return {

        blob,

        filename:
            removeExtension(
                file.name
            ) +
            "-compressed.pdf",

        message
    };
}

/* =========================================================
   PDF.js LOADER
========================================================= */

async function ensurePDFJS() {

    if (
        window.pdfjsLib
    ) {

        if (
            !window.pdfjsLib
                .GlobalWorkerOptions
                .workerSrc
        ) {

            window.pdfjsLib
                .GlobalWorkerOptions
                .workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        return;
    }

    await loadExternalScript(
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    );

    if (
        !window.pdfjsLib
    ) {

        throw new Error(
            "PDF.js could not be loaded."
        );
    }

    window.pdfjsLib
        .GlobalWorkerOptions
        .workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

/* =========================================================
   PDF-LIB LOADER
========================================================= */

async function ensurePDFLib() {

    if (
        window.PDFLib &&
        window.PDFLib.PDFDocument
    ) {

        return;
    }

    await loadExternalScript(
        "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"
    );

    if (
        !window.PDFLib ||
        !window.PDFLib.PDFDocument
    ) {

        throw new Error(
            "PDF-Lib could not be loaded. Check your internet connection."
        );
    }
}

/* =========================================================
   JSZIP LOADER
========================================================= */

async function ensureJSZip() {

    if (
        window.JSZip
    ) {

        return;
    }

    await loadExternalScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
    );

    if (
        !window.JSZip
    ) {

        throw new Error(
            "JSZip could not be loaded."
        );
    }
}

/* =========================================================
   jsPDF LOADER
========================================================= */

function loadJsPDF() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.jspdf &&
                window.jspdf.jsPDF
            ) {

                resolve(
                    window.jspdf
                );

                return;
            }

            loadExternalScript(
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
            )
                .then(() => {

                    if (
                        window.jspdf &&
                        window.jspdf.jsPDF
                    ) {

                        resolve(
                            window.jspdf
                        );

                    } else {

                        reject(
                            new Error(
                                "jsPDF could not be loaded."
                            )
                        );
                    }
                })
                .catch(() => {

                    reject(
                        new Error(
                            "Could not load jsPDF. Check your internet connection."
                        )
                    );
                });
        }
    );
}

/* =========================================================
   EXTERNAL SCRIPT LOADER
========================================================= */

function loadExternalScript(src) {

    return new Promise(
        (resolve, reject) => {

            const existing =
                document.querySelector(
                    `script[src="${src}"]`
                );

            if (existing) {

                if (
                    existing.dataset.loaded === "true"
                ) {

                    resolve();
                    return;
                }

                existing.addEventListener(
                    "load",
                    () => resolve()
                );

                existing.addEventListener(
                    "error",
                    () => reject(
                        new Error(
                            "Could not load required library."
                        )
                    )
                );

                return;
            }

            const script =
                document.createElement(
                    "script"
                );

            script.src = src;

            script.async = true;

            script.onload = () => {

                script.dataset.loaded =
                    "true";

                resolve();
            };

            script.onerror = () => {

                reject(
                    new Error(
                        "Could not load required library."
                    )
                );
            };

            document.head.appendChild(
                script
            );
        }
    );
}

/* =========================================================
   IMAGE LOADER
========================================================= */

function loadImage(file) {

    return new Promise(
        (resolve, reject) => {

            const url =
                URL.createObjectURL(
                    file
                );

            const image =
                new Image();

            image.onload = () => {

                URL.revokeObjectURL(
                    url
                );

                resolve(
                    image
                );
            };

            image.onerror = () => {

                URL.revokeObjectURL(
                    url
                );

                reject(
                    new Error(
                        "Could not read the image."
                    )
                );
            };

            image.src = url;
        }
    );
}

/* =========================================================
   CANVAS TO BLOB
========================================================= */

function canvasToBlob(
    canvas,
    type,
    quality
) {

    return new Promise(
        (resolve, reject) => {

            canvas.toBlob(
                blob => {

                    if (blob) {

                        resolve(
                            blob
                        );

                    } else {

                        reject(
                            new Error(
                                "Could not create output file."
                            )
                        );
                    }
                },
                type,
                quality
            );
        }
    );
}

/* =========================================================
   RESULT
========================================================= */

function showResult(result) {

    if (!result) {

        throw new Error(
            "Conversion completed but no output file was returned."
        );
    }

    if (!result.blob) {

        throw new Error(
            "Conversion completed but the output file is missing."
        );
    }

    if (currentDownloadUrl) {

        URL.revokeObjectURL(
            currentDownloadUrl
        );

        currentDownloadUrl = null;
    }

    setProgress(
        100,
        "Complete!"
    );

    resultTitle.textContent =
        "Your file is ready";

    resultMessage.textContent =
        result.message ||
        "Conversion completed successfully.";

    currentDownloadUrl =
        URL.createObjectURL(
            result.blob
        );

    downloadBtn.href =
        currentDownloadUrl;

    downloadBtn.download =
        result.filename ||
        "download";

    downloadBtn.textContent =
        `Download ${result.filename || "file"}`;

    resultBox.classList.remove(
        "hidden"
    );
}

/* =========================================================
   PROGRESS
========================================================= */

function setProgress(
    percent,
    message
) {

    const safe =
        Math.max(
            0,
            Math.min(
                100,
                percent
            )
        );

    if (progressBar) {

        progressBar.style.width =
            safe + "%";
    }

    if (progressPercent) {

        progressPercent.textContent =
            Math.round(
                safe
            ) + "%";
    }

    if (progressText) {

        progressText.textContent =
            message;
    }
}

/* =========================================================
   HELPERS
========================================================= */

function formatBytes(bytes) {

    if (!bytes) {

        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );

    return (
        bytes /
        Math.pow(
            1024,
            index
        )
    ).toFixed(2) +
    " " +
    units[index];
}

function removeExtension(filename) {

    return filename.replace(
        /\.[^/.]+$/,
        ""
    );
}

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}

/* =========================================================
   CLOSE WORKSPACE
========================================================= */

if (closeBtn) {

    closeBtn.addEventListener(
        "click",
        () => {

            workspace.classList.add(
                "hidden"
            );

            selectedFiles = [];
            currentToolId = null;

            fileInput.value = "";

            if (currentDownloadUrl) {

                URL.revokeObjectURL(
                    currentDownloadUrl
                );

                currentDownloadUrl = null;
            }
        }
    );
}

/* =========================================================
   MOBILE MENU
========================================================= */

if (
    menuBtn &&
    nav
) {

    menuBtn.addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "open"
            );
        }
    );
}

/* =========================================================
   DRAG & DROP SAFETY
========================================================= */

document.addEventListener(
    "dragover",
    event => {

        event.preventDefault();
    }
);

/* =========================================================
   END
========================================================= */
/* =========================================================
   PDF TO EXCEL
========================================================= */

async function pdfToExcel(file) {

    if (!file) {
        throw new Error("Please select a PDF file.");
    }

    if (!window.pdfjsLib) {
        throw new Error(
            "PDF.js could not be loaded. Please refresh the page."
        );
    }

    if (!window.XLSX) {
        throw new Error(
            "Excel library could not be loaded. Please check your internet connection and refresh the page."
        );
    }

    setProgress(
        10,
        "Loading PDF..."
    );

    const buffer =
        await file.arrayBuffer();

    const pdf =
        await window.pdfjsLib
            .getDocument({
                data: buffer
            })
            .promise;

    if (!pdf.numPages) {
        throw new Error(
            "The PDF contains no pages."
        );
    }

    const workbook =
        window.XLSX.utils.book_new();

    let totalRows = 0;

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        setProgress(
            10 +
            Math.round(
                ((pageNumber - 1) /
                    pdf.numPages) * 75
            ),
            `Reading page ${pageNumber} of ${pdf.numPages}...`
        );

        const page =
            await pdf.getPage(
                pageNumber
            );

        const content =
            await page.getTextContent();

        const items =
            content.items || [];

        /*
         * PDF.js returns individual text fragments.
         * We group fragments by their vertical position
         * to reconstruct approximate rows.
         */

        const rows = [];

        const tolerance = 4;

        items.forEach(item => {

            const text =
                (item.str || "").trim();

            if (!text) {
                return;
            }

            const x =
                item.transform[4];

            const y =
                item.transform[5];

            let row =
                rows.find(
                    r =>
                        Math.abs(
                            r.y - y
                        ) <= tolerance
                );

            if (!row) {

                row = {
                    y: y,
                    items: []
                };

                rows.push(row);

            }

            row.items.push({
                x: x,
                text: text
            });

        });


        /*
         * Sort rows from top to bottom.
         */

        rows.sort(
            (a, b) =>
                b.y - a.y
        );


        /*
         * Sort text fragments from
         * left to right.
         */

        const pageRows =
            rows.map(row => {

                row.items.sort(
                    (a, b) =>
                        a.x - b.x
                );

                return row.items.map(
                    item => item.text
                );

            });


        /*
         * Add page number and
         * extracted rows.
         */

        if (pageRows.length) {

            const sheetData = [

                [
                    `Page ${pageNumber}`
                ],

                ...

pageRows

            ];


            const worksheet =
                window.XLSX.utils.aoa_to_sheet(
                    sheetData
                );


            /*
             * Make columns readable.
             */

            const maxColumns =
                pageRows.reduce(
                    (max, row) =>
                        Math.max(
                            max,
                            row.length
                        ),
                    1
                );


            worksheet["!cols"] =
                Array.from(
                    {
                        length:
                            maxColumns
                    },
                    () => ({
                        wch: 20
                    })
                );


            const sheetName =
                `Page ${pageNumber}`;


            window.XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                sheetName
            );


            totalRows +=
                pageRows.length;

        }

    }


    if (!totalRows) {

        throw new Error(
            "No readable text was found in this PDF. Scanned/image-only PDFs need OCR to extract their data."
        );

    }


    setProgress(
        92,
        "Creating Excel file..."
    );


    /*
     * Generate XLSX file.
     */

    const excelArray =
        window.XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array"
            }
        );


    const blob =
        new Blob(
            [
                excelArray
            ],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );


    setProgress(
        98,
        "Preparing Excel download..."
    );


    return {

        blob,

        filename:
            removeExtension(
                file.name
            ) +
            ".xlsx",

        message:
            `${pdf.numPages} PDF page(s) converted to Excel successfully.`

    };

}
/* =========================================================
   PDF TO TEXT
========================================================= */

async function pdfToText(file) {

    if (!file) {
        throw new Error(
            "Please select a PDF file."
        );
    }

    if (!window.pdfjsLib) {
        throw new Error(
            "PDF.js could not be loaded. Please refresh the page."
        );
    }

    setProgress(
        10,
        "Loading PDF..."
    );

    const buffer =
        await file.arrayBuffer();

    const pdf =
        await window.pdfjsLib
            .getDocument({
                data: buffer
            })
            .promise;

    let finalText = "";

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        setProgress(
            10 +
            Math.round(
                ((pageNumber - 1) /
                    pdf.numPages) * 80
            ),
            `Extracting page ${pageNumber} of ${pdf.numPages}...`
        );

        const page =
            await pdf.getPage(
                pageNumber
            );

        const content =
            await page.getTextContent();

        const items =
            content.items || [];

        const pageText =
            items
                .map(
                    item =>
                        item.str || ""
                )
                .join(" ");

        finalText +=
            `\n\n===== Page ${pageNumber} =====\n\n`;

        finalText +=
            pageText.trim();
    }

    finalText =
        finalText.trim();

    if (!finalText) {

        throw new Error(
            "No readable text was found. This may be a scanned/image-only PDF."
        );

    }

    setProgress(
        95,
        "Creating text file..."
    );

    const blob =
        new Blob(
            [finalText],
            {
                type: "text/plain;charset=utf-8"
            }
        );

    return {

        blob,

        filename:
            removeExtension(
                file.name
            ) +
            ".txt",

        message:
            "PDF text extracted successfully."

    };

}
async function textToPDF(file) {

    if (!file) {
        throw new Error(
            "Please select a text file."
        );
    }

    setProgress(
        10,
        "Reading text file..."
    );

    const text =
        await file.text();

    if (!text.trim()) {
        throw new Error(
            "The text file is empty."
        );
    }

    const { jsPDF } =
        await loadJsPDF();

    setProgress(
        30,
        "Preparing PDF..."
    );

    const pdf =
        new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4"
        });

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const margin = 50;

    const maxWidth =
        pageWidth -
        (margin * 2);

    const lineHeight = 16;

    let y =
        margin;

    /*
     * Split the text into paragraphs/lines.
     */

    const lines =
        text.replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .split("\n");

    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const originalLine =
            lines[i];

        /*
         * Keep empty lines.
         */

        if (
            originalLine.trim() === ""
        ) {

            y += lineHeight;

            if (
                y >
                pageHeight - margin
            ) {

                pdf.addPage();

                y = margin;

            }

            continue;

        }

        /*
         * Automatically wrap long lines.
         */

        const wrappedLines =
            pdf.splitTextToSize(
                originalLine,
                maxWidth
            );

        for (
            const line of wrappedLines
        ) {

            if (
                y >
                pageHeight - margin
            ) {

                pdf.addPage();

                y = margin;

            }

            pdf.text(
                line,
                margin,
                y
            );

            y += lineHeight;

        }

        /*
         * Progress.
         */

        if (
            i % 10 === 0
        ) {

            setProgress(
                30 +
                Math.round(
                    (i / lines.length) * 55
                ),
                "Creating PDF..."
            );

        }

    }

    setProgress(
        90,
        "Finalizing PDF..."
    );

    const blob =
        pdf.output("blob");

    return {

        blob,

        filename:
            removeExtension(
                file.name
            ) +
            ".pdf",

        message:
            "Text file converted to PDF successfully."

    };

}
async function wordToPDF(file) {

    if (!file) {
        throw new Error("Please select a Word file.");
    }

    if (!window.mammoth) {
        throw new Error(
            "Mammoth could not be loaded. Please refresh the page."
        );
    }

    setProgress(
        10,
        "Reading Word document..."
    );

    const arrayBuffer =
        await file.arrayBuffer();

    setProgress(
        25,
        "Converting Word content..."
    );

    const result =
        await mammoth.convertToHtml({
            arrayBuffer: arrayBuffer
        });

    const html =
        result.value || "";

    if (!html.trim()) {
        throw new Error(
            "Could not extract content from this Word document."
        );
    }

    setProgress(
        40,
        "Preparing PDF..."
    );

    const { jsPDF } =
        await loadJsPDF();

    const pdf =
        new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4"
        });

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const margin = 50;

    const contentWidth =
        pageWidth - (margin * 2);

    const container =
        document.createElement("div");

    container.style.position =
        "fixed";

    container.style.left =
        "-100000px";

    container.style.top =
        "0";

    container.style.width =
        contentWidth + "px";

    container.style.background =
        "#ffffff";

    container.style.color =
        "#000000";

    container.style.fontFamily =
        "Arial, sans-serif";

    container.style.fontSize =
        "12pt";

    container.style.lineHeight =
        "1.5";

    container.innerHTML =
        html;

    document.body.appendChild(
        container
    );

    try {

        const blocks =
            Array.from(
                container.querySelectorAll(
                    "p, h1, h2, h3, h4, h5, h6, li"
                )
            );

        let y =
            margin;

        for (
            let i = 0;
            i < blocks.length;
            i++
        ) {

            const element =
                blocks[i];

            const text =
                element.innerText
                    .replace(/\s+/g, " ")
                    .trim();

            if (!text) {
                continue;
            }

            let fontSize = 12;

            if (
                /^h1$/i.test(
                    element.tagName
                )
            ) {
                fontSize = 22;
            }

            else if (
                /^h2$/i.test(
                    element.tagName
                )
            ) {
                fontSize = 18;
            }

            else if (
                /^h3$/i.test(
                    element.tagName
                )
            ) {
                fontSize = 15;
            }

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(
                fontSize
            );

            const lines =
                pdf.splitTextToSize(
                    text,
                    contentWidth
                );

            const lineHeight =
                fontSize * 1.45;

            for (
                const line of lines
            ) {

                if (
                    y + lineHeight >
                    pageHeight - margin
                ) {

                    pdf.addPage();

                    y =
                        margin;

                }

                pdf.text(
                    line,
                    margin,
                    y
                );

                y += lineHeight;

            }

            y += 6;

            setProgress(
                40 +
                Math.round(
                    (i / Math.max(blocks.length, 1)) *
                    45
                ),
                "Creating PDF..."
            );

        }

        /*
         * Fallback:
         * If Mammoth returned content but no normal
         * paragraph elements were detected.
         */

        if (!blocks.length) {

            const plainText =
                container.innerText.trim();

            const lines =
                pdf.splitTextToSize(
                    plainText,
                    contentWidth
                );

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(12);

            for (
                const line of lines
            ) {

                if (
                    y + 18 >
                    pageHeight - margin
                ) {

                    pdf.addPage();

                    y =
                        margin;

                }

                pdf.text(
                    line,
                    margin,
                    y
                );

                y += 18;

            }

        }

    }

    finally {

        document.body.removeChild(
            container
        );

    }

    setProgress(
        90,
        "Finalizing PDF..."
    );

    const blob =
        pdf.output("blob");

    return {

        blob,

        filename:
            removeExtension(
                file.name
            ) +
            ".pdf",

        message:
            "Word document converted to PDF successfully."

    };

}
async function pdfToWord(file) {

    if (!file) {
        throw new Error("Please select a PDF file.");
    }

    if (!window.pdfjsLib) {
        throw new Error(
            "PDF.js could not be loaded. Please refresh the page."
        );
    }

    setProgress(
        10,
        "Loading PDF..."
    );

    const buffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib
            .getDocument({
                data: buffer
            })
            .promise;

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 11pt;
                    line-height: 1.5;
                }

                .page {
                    page-break-after: always;
                    margin-bottom: 30px;
                }

                p {
                    margin: 0 0 8px 0;
                }
            </style>
        </head>
        <body>
    `;

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        setProgress(
            15 +
            Math.round(
                ((pageNumber - 1) /
                pdf.numPages) * 70
            ),
            `Extracting page ${pageNumber} of ${pdf.numPages}...`
        );

        const page =
            await pdf.getPage(
                pageNumber
            );

        const textContent =
            await page.getTextContent();

        const items =
            textContent.items || [];

        let pageText = "";

        let previousY = null;

        for (
            const item of items
        ) {

            const text =
                item.str || "";

            if (!text) {
                continue;
            }

            const currentY =
                item.transform
                    ? item.transform[5]
                    : null;

            /*
             * Detect a new visual line.
             */

            if (
                previousY !== null &&
                currentY !== null &&
                Math.abs(
                    currentY - previousY
                ) > 5
            ) {

                pageText += "\n";

            }

            pageText +=
                text + " ";

            previousY =
                currentY;

        }

        /*
         * Clean extracted text.
         */

        const lines =
            pageText
                .replace(/\r/g, "")
                .split("\n")
                .map(
                    line =>
                        line
                            .replace(/\s+/g, " ")
                            .trim()
                )
                .filter(Boolean);

        html += `
            <div class="page">
        `;

        if (!lines.length) {

            html += `
                <p>
                    [No selectable text found on this page]
                </p>
            `;

        }

        else {

            lines.forEach(
                line => {

                    html +=
                        `<p>${escapeHtml(line)}</p>`;

                }
            );

        }

        html += `
            </div>
        `;

    }

    html += `
        </body>
        </html>
    `;

    setProgress(
        90,
        "Creating Word document..."
    );

    /*
     * Create a DOCX file.
     *
     * We use the browser's Blob/ZIP approach
     * so no backend is required.
     */

    if (!window.JSZip) {
        throw new Error(
            "JSZip could not be loaded."
        );
    }

    const zip =
        new JSZip();

    const documentXml =
        createDocxDocument(
            html
        );

    zip.file(
        "[Content_Types].xml",
        createDocxContentTypes()
    );

    zip.folder("_rels")
        .file(
            ".rels",
            createDocxRels()
        );

    zip.folder("word")
        .file(
            "document.xml",
            documentXml
        );

    zip.folder("word")
        .folder("_rels")
        .file(
            "document.xml.rels",
            createDocxDocumentRels()
        );

    const docxBlob =
        await zip.generateAsync({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });

    setProgress(
        100,
        "Word document ready!"
    );

    return {

        blob:
            docxBlob,

        filename:
            removeExtension(
                file.name
            ) +
            ".docx",

        message:
            `${pdf.numPages} PDF page(s) converted to an editable Word document.`

    };

}
function createDocxDocument(html) {

    const bodyContent =
        html
            .replace(
                /<!DOCTYPE[\s\S]*?<body>/i,
                ""
            )
            .replace(
                /<\/body>[\s\S]*?<\/html>/i,
                ""
            );

    const paragraphs =
        bodyContent
            .replace(
                /<div class="page">/gi,
                ""
            )
            .replace(
                /<\/div>/gi,
                ""
            )
            .split(
                /<\/p>/gi
            )
            .map(
                item =>
                    item
                        .replace(
                            /<p[^>]*>/gi,
                            ""
                        )
                        .trim()
            )
            .filter(Boolean);

    let documentBody = "";

    paragraphs.forEach(
        paragraph => {

            const text =
                paragraph
                    .replace(
                        /<[^>]+>/g,
                        ""
                    )
                    .replace(
                        /&amp;/g,
                        "&"
                    )
                    .replace(
                        /&lt;/g,
                        "<"
                    )
                    .replace(
                        /&gt;/g,
                        ">"
                    )
                    .replace(
                        /&quot;/g,
                        '"'
                    );

            documentBody += `
                <w:p>
                    <w:r>
                        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
                    </w:r>
                </w:p>
            `;

        }
    );

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<w:document
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
>

<w:body>

${documentBody}

<w:sectPr>

<w:pgSz
    w:w="11906"
    w:h="16838"
/>

<w:pgMar
    w:top="1000"
    w:right="1000"
    w:bottom="1000"
    w:left="1000"
/>

</w:sectPr>

</w:body>

</w:document>`;
}


function createDocxContentTypes() {

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<Types
    xmlns="http://schemas.openxmlformats.org/package/2006/content-types"
>

<Default
    Extension="rels"
    ContentType="application/vnd.openxmlformats-package.relationships+xml"
/>

<Default
    Extension="xml"
    ContentType="application/xml"
/>

<Override
    PartName="/word/document.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"
/>

</Types>`;
}


function createDocxRels() {

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<Relationships
    xmlns="http://schemas.openxmlformats.org/package/2006/relationships"
>

<Relationship
    Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="word/document.xml"
/>

</Relationships>`;
}


function createDocxDocumentRels() {

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>

<Relationships
    xmlns="http://schemas.openxmlformats.org/package/2006/relationships"
>
</Relationships>`;
}


function escapeXml(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&apos;"
        );

}
/* =========================================================
   EXCEL → PDF
========================================================= */

async function excelToPDF(file) {

    if (!window.XLSX) {
        throw new Error(
            "Excel library could not be loaded. Please reload the page."
        );
    }

    setProgress(
        10,
        "Reading Excel file..."
    );

    const arrayBuffer =
        await file.arrayBuffer();

    const workbook =
        XLSX.read(
            arrayBuffer,
            {
                type: "array"
            }
        );

    const sheetNames =
        workbook.SheetNames;

    if (!sheetNames.length) {
        throw new Error(
            "The Excel file does not contain any worksheet."
        );
    }

    const { jsPDF } =
        await loadJsPDF();

    const pdf =
        new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4"
        });

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const margin = 30;

    for (
        let sheetIndex = 0;
        sheetIndex < sheetNames.length;
        sheetIndex++
    ) {

        const sheetName =
            sheetNames[sheetIndex];

        setProgress(
            20 +
            Math.round(
                (sheetIndex / sheetNames.length) * 60
            ),
            `Processing sheet ${sheetIndex + 1} of ${sheetNames.length}...`
        );

        const worksheet =
            workbook.Sheets[sheetName];

        const rows =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    header: 1,
                    defval: ""
                }
            );

        if (!rows.length) {
            continue;
        }

        if (sheetIndex > 0) {
            pdf.addPage(
                "a4",
                "landscape"
            );
        }

        const maxColumns =
            Math.max(
                ...rows.map(
                    row => row.length
                )
            );

        if (!maxColumns) {
            continue;
        }

        const availableWidth =
            pageWidth -
            margin * 2;

        const availableHeight =
            pageHeight -
            margin * 2 -
            25;

        const columnWidth =
            availableWidth /
            maxColumns;

        const rowHeight = 18;

        let y =
            margin;

        /* Sheet title */

        pdf.setFontSize(12);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.text(
            sheetName,
            margin,
            y
        );

        y += 25;

        /* Table */

        pdf.setFontSize(7);

        pdf.setFont(
            "helvetica",
            "normal"
        );

        for (
            let rowIndex = 0;
            rowIndex < rows.length;
            rowIndex++
        ) {

            const row =
                rows[rowIndex];

            /* New page when needed */

            if (
                y + rowHeight >
                pageHeight - margin
            ) {

                pdf.addPage(
                    "a4",
                    "landscape"
                );

                y =
                    margin;

                pdf.setFontSize(7);

            }

            for (
                let columnIndex = 0;
                columnIndex < maxColumns;
                columnIndex++
            ) {

                const value =
                    row[columnIndex] ??
                    "";

                const text =
                    String(value);

                const x =
                    margin +
                    columnIndex *
                    columnWidth;

                /* Cell border */

                pdf.rect(
                    x,
                    y,
                    columnWidth,
                    rowHeight
                );

                /* Cell text */

                const maxTextWidth =
                    Math.max(
                        columnWidth - 6,
                        5
                    );

                const lines =
                    pdf.splitTextToSize(
                        text,
                        maxTextWidth
                    );

                pdf.text(
                    lines[0] || "",
                    x + 3,
                    y + 12
                );

            }

            y += rowHeight;

        }

    }

    setProgress(
        90,
        "Creating PDF..."
    );

    const blob =
        pdf.output(
            "blob"
        );

    setProgress(
        100,
        "Excel converted to PDF!"
    );

    return {

        blob,

        filename:
            removeExtension(
                file.name
            ) +
            ".pdf",

        message:
            `${sheetNames.length} Excel sheet(s) converted successfully.`

    };

}