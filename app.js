/* ============================================= */
/* VALENTINE PROPOSAL — MAIN SCRIPT (FIXED)      */
/* ============================================= */

// ============================================= //
//  ✏️  PERSONALIZATION — EDIT THESE VALUES!     //
// ============================================= //
const CONFIG = {
    // Partner's name
    PARTNER_NAME: "My Spicy",

    // Your name
    YOUR_NAME: "Jesufemi",

    // Valentine's date text
    VALENTINES_DATE: "February 14, 2026",

    // -------------------------------------------------------
    // 🎵 SONG URL — THIS IS THE FIX
    // -------------------------------------------------------
    // OPTION 1: Local file (put the file in the SAME folder)
    //   Example: ""
    //
    // OPTION 2: Full path
    //   Example: "./music/mysong.mp3"
    //   Example: "../assets/song.mp3"
    //
    // OPTION 3: External URL (must allow CORS / direct link)
    //   Example: "https://example.com/song.mp3"
    //
    // OPTION 4: Leave empty "" for no music
    //
    // IMPORTANT: The file MUST be a valid audio format:
    //   .mp3, .ogg, .wav, .m4a, .aac, .webm
    //
    // If opening index.html directly (file:// protocol),
    // some browsers block local audio. Use a local server:
    //   npx serve .
    //   python -m http.server 8000
    //   or VS Code "Live Server" extension
    // -------------------------------------------------------
    SONG_URL: "https://drive.google.com/file/d/1Dvt6twTnUQVv9Z46EeghQ9Y5yipiRjpo/view?usp=drive_link",

    // Video URL (YouTube embed URL or local file)
    // YouTube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    // Local:   "file:///Users/online-sales-group/Documents/myvideo copy.mp4"
    // Empty:   "file:///Users/online-sales-group/Documents/myvideo copy.mp4" (shows placeholder)
    VIDEO_URL: "file:///Users/online-sales-group/Documents/Valentine/video/myvideocopy.mp4",

    // Photo URLs
    PHOTO_1: "file:///Users/online-sales-group/Downloads/IMG_7715.jpg",
    PHOTO_2: "file:///Users/online-sales-group/Downloads/Compressed/IMG_4564.jpg",
    PHOTO_3: "file:///Users/online-sales-group/Downloads/IMG_8115.jpg",
};

// ============================================= //
// HELPERS                                       //
// ============================================= //
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================= //
// DOM REFERENCES                                //
// ============================================= //
const pages = {
    proposal:    $("#page-proposal"),
    celebration: $("#page-celebration"),
    video:       $("#page-video"),
    checklist:   $("#page-checklist"),
};

const topNavLinks     = $$(".nav-link");
const bottomNavItems  = $$(".bottom-nav-item");

const btnYes                          = $("#btn-yes");
const btnNo                           = $("#btn-no");
const noText                          = $("#no-text");
const btnToVideo                      = $("#btn-to-video");
const btnToChecklistFromCelebration   = $("#btn-to-checklist-from-celebration");
const btnToChecklist                  = $("#btn-to-checklist");
const btnBackCelebration              = $("#btn-back-celebration");
const btnSavePlan                     = $("#btn-save-plan");
const btnDownloadPlan                 = $("#btn-download-plan");
const btnAddIdea                      = $("#btn-add-idea");
const customIdeaInput                 = $("#custom-idea-input");

const musicToggle           = $("#music-toggle");
const musicIcon             = $("#music-icon");
const bgMusic               = $("#bg-music");

const checklistGrid         = $("#checklist-grid");
const counterText           = $("#counter-text");
const customItemsContainer  = $("#custom-items-container");

const toast        = $("#toast");
const toastMessage = $("#toast-message");
const toastIcon    = $("#toast-icon");
const modalOverlay = $("#modal-overlay");
const modalClose   = $("#modal-close");

const heartsBgCanvas  = $("#hearts-bg");
const confettiCanvas  = $("#confetti-canvas");

// ============================================= //
// INIT                                          //
// ============================================= //
document.addEventListener("DOMContentLoaded", () => {
    applyPersonalization();
    initAudio();          // <-- NEW dedicated audio init
    initNavigation();
    initProposalPage();
    initChecklist();
    initModal();
    initFloatingHearts();
    handleHashRouting();
});

// ============================================= //
// PERSONALIZATION                               //
// ============================================= //
function applyPersonalization() {
    // Partner name
    ["#partner-name-1", "#partner-name-2", "#partner-name-3"].forEach((sel) => {
        const el = $(sel);
        if (el) el.textContent = CONFIG.PARTNER_NAME;
    });

    // Your name
    const yourNameEl = $("#your-name-1");
    if (yourNameEl) yourNameEl.textContent = CONFIG.YOUR_NAME;

    // Date
    const dateEl = $("#valentine-date");
    if (dateEl) dateEl.textContent = CONFIG.VALENTINES_DATE;

    // Photos
    [CONFIG.PHOTO_1, CONFIG.PHOTO_2, CONFIG.PHOTO_3].forEach((url, i) => {
        if (url) {
            const img = $(`#polaroid-${i + 1} .polaroid-img`);
            if (img) img.src = url;
        }
    });

    // Video
    setupVideo();
}

function setupVideo() {
    const videoWrapper  = $(".video-wrapper");
    const placeholder   = $("#video-placeholder");
    const videoEl       = $("#main-video");

    if (!CONFIG.VIDEO_URL) {
        // No video — show placeholder
        if (videoEl) videoEl.style.display = "none";
        if (placeholder) placeholder.classList.remove("hidden");
        return;
    }

    // YouTube / Vimeo embed?
    if (CONFIG.VIDEO_URL.includes("youtube.com/embed") ||
        CONFIG.VIDEO_URL.includes("player.vimeo.com")) {
        if (videoEl) videoEl.remove();
        if (placeholder) placeholder.classList.add("hidden");

        const iframe = document.createElement("iframe");
        iframe.src = CONFIG.VIDEO_URL;
        iframe.title = "Personal video message";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.className = "video-player";
        videoWrapper.insertBefore(iframe, placeholder);
    } else {
        // Direct video file
        if (videoEl) {
            // Clear old sources and set new one
            videoEl.innerHTML = "";
            const source = document.createElement("source");
            source.src = CONFIG.VIDEO_URL;

            // Detect type from extension
            const ext = CONFIG.VIDEO_URL.split(".").pop().toLowerCase().split("?")[0];
            const mimeMap = {
                mp4:  "video/mp4",
                webm: "video/webm",
                ogg:  "video/ogg",
                mov:  "video/quicktime",
            };
            source.type = mimeMap[ext] || "video/mp4";
            videoEl.appendChild(source);
            videoEl.load();
            videoEl.style.display = "";
        }
        if (placeholder) placeholder.classList.add("hidden");
    }
}

// ============================================= //
// 🎵 AUDIO — COMPLETE REWRITE / FIX            //
// ============================================= //
let isMusicPlaying = false;
let audioReady = false;
let audioError = false;

function initAudio() {
    if (!CONFIG.SONG_URL) {
        console.log("🎵 No song URL configured. Music disabled.");
        return;
    }

    console.log("🎵 Loading audio from:", CONFIG.SONG_URL);

    // Set the src directly on the audio element (NOT on a <source> child)
    bgMusic.src = CONFIG.SONG_URL;
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.preload = "auto";

    // Loading indicator
    musicToggle.classList.add("loading");

    // ---- Event: Audio can play ----
    bgMusic.addEventListener("canplaythrough", function onReady() {
        audioReady = true;
        audioError = false;
        musicToggle.classList.remove("loading", "error");
        console.log("🎵 Audio loaded and ready to play!");
        bgMusic.removeEventListener("canplaythrough", onReady);
    });

    // ---- Event: Audio metadata loaded (fallback) ----
    bgMusic.addEventListener("loadedmetadata", () => {
        console.log("🎵 Audio metadata loaded. Duration:", bgMusic.duration);
        musicToggle.classList.remove("loading");
    });

    // ---- Event: Error ----
    bgMusic.addEventListener("error", (e) => {
        audioError = true;
        audioReady = false;
        musicToggle.classList.remove("loading");
        musicToggle.classList.add("error");

        const errorCode = bgMusic.error ? bgMusic.error.code : "unknown";
        const errorMessages = {
            1: "Audio loading was aborted",
            2: "Network error while loading audio",
            3: "Audio decoding failed — file may be corrupt or wrong format",
            4: "Audio format not supported by this browser",
        };
        const msg = errorMessages[errorCode] || "Unknown audio error";
        console.error(`🎵 Audio Error (code ${errorCode}): ${msg}`);
        console.error("🎵 Attempted URL:", CONFIG.SONG_URL);
        console.error("🎵 TIP: If opening as file://, use a local server instead:");
        console.error("   npx serve .");
        console.error("   python3 -m http.server 8000");
        console.error("   VS Code Live Server extension");
    });

    // ---- Music Toggle Button ----
    musicToggle.addEventListener("click", toggleMusic);
}

function toggleMusic() {
    // No song configured
    if (!CONFIG.SONG_URL) {
        showToast("🎵", "No song configured! Edit CONFIG.SONG_URL in app.js");
        return;
    }

    // Audio had an error
    if (audioError) {
        showToast("❌", "Song failed to load. Check the file path & console (F12).");

        // Try reloading
        console.log("🎵 Retrying audio load...");
        audioError = false;
        musicToggle.classList.remove("error");
        musicToggle.classList.add("loading");
        bgMusic.src = CONFIG.SONG_URL;
        bgMusic.load();
        return;
    }

    // Still loading
    if (!audioReady) {
        showToast("⏳", "Song is still loading, please wait...");
        return;
    }

    // Toggle play/pause
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = "🔇";
        musicToggle.classList.remove("playing");
        isMusicPlaying = false;
        showToast("🔇", "Music paused");
    } else {
        // Attempt to play
        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    musicIcon.textContent = "🎵";
                    musicToggle.classList.add("playing");
                    isMusicPlaying = true;
                    showToast("🎵", "Now playing ♪");
                    console.log("🎵 Music playing successfully!");
                })
                .catch((err) => {
                    console.error("🎵 Play failed:", err.message);

                    if (err.name === "NotAllowedError") {
                        showToast("🎵", "Tap the music button again to play!");
                        // Some browsers need a second user interaction
                        // Re-create audio context on next click
                    } else if (err.name === "NotSupportedError") {
                        showToast("❌", "Audio format not supported. Try MP3.");
                    } else {
                        showToast("❌", "Couldn't play. Check console (F12).");
                    }
                });
        }
    }
}

// ============================================= //
// NAVIGATION / ROUTING                          //
// ============================================= //
let currentPage = "proposal";

function initNavigation() {
    topNavLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    bottomNavItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });

    btnToVideo.addEventListener("click", () => navigateTo("video"));
    btnToChecklistFromCelebration.addEventListener("click", () => navigateTo("checklist"));
    btnToChecklist.addEventListener("click", () => navigateTo("checklist"));
    btnBackCelebration.addEventListener("click", () => navigateTo("celebration"));

    window.addEventListener("popstate", handleHashRouting);
}

function handleHashRouting() {
    const hash = window.location.hash.replace("#", "");
    if (["proposal", "celebration", "video", "checklist"].includes(hash)) {
        navigateTo(hash, false);
    }
}

function navigateTo(pageName, pushState = true) {
    if (pageName === currentPage) return;

    Object.values(pages).forEach((p) => p.classList.remove("active", "page-enter"));

    const target = pages[pageName];
    if (!target) return;

    target.classList.add("active", "page-enter");
    currentPage = pageName;

    restartAnimations(target);
    updateNavActive(pageName);

    if (pushState) history.pushState(null, "", `#${pageName}`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageName === "celebration") {
        setTimeout(triggerConfetti, 300);
    }
}

function updateNavActive(pageName) {
    topNavLinks.forEach((l) => l.classList.toggle("active", l.dataset.page === pageName));
    bottomNavItems.forEach((i) => i.classList.toggle("active", i.dataset.page === pageName));
}

function restartAnimations(container) {
    container.querySelectorAll(".fade-in-up, .bounce-in").forEach((el) => {
        el.style.animation = "none";
        el.offsetHeight; // reflow
        el.style.animation = "";
    });
}

// ============================================= //
// PAGE 1: PROPOSAL INTERACTIONS                 //
// ============================================= //
let noClickCount = 0;
const noResponses = [
    "Are you sure? 🥺",
    "Pretty please? 🙏",
    "Think again… 💕",
    "I'll wait forever 🥰",
    "One more chance? 💖",
    "How about now? 😍",
    "Please? 🥹",
    "Say yes! 💗",
];

function initProposalPage() {
    btnYes.addEventListener("click", () => {
        createMiniCelebration();
        setTimeout(() => navigateTo("celebration"), 600);
    });

    btnNo.addEventListener("click", (e) => {
        noClickCount++;
        if (noClickCount <= noResponses.length) {
            noText.textContent = noResponses[noClickCount - 1];
        }
        if (noClickCount >= 3) runAwayButton();
        const s = 1 + noClickCount * 0.05;
        btnYes.style.transform = `scale(${Math.min(s, 1.4)})`;
    });
}

function runAwayButton() {
    const btn = btnNo;
    btn.classList.add("running-away");
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const r = btn.getBoundingClientRect();
    let x = Math.random() * (vw - r.width - 40) + 20;
    let y = Math.random() * (vh - r.height - 200) + 100;
    x = Math.max(20, Math.min(x, vw - r.width - 20));
    y = Math.max(100, Math.min(y, vh - r.height - 100));
    btn.style.position = "fixed";
    btn.style.left = x + "px";
    btn.style.top = y + "px";
    btn.style.zIndex = "50";
    setTimeout(() => btn.classList.remove("running-away"), 400);
}

function createMiniCelebration() {
    const r = btnYes.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const emojis = ["💖", "💕", "💗", "❤️", "💘", "🥰"];

    for (let i = 0; i < 12; i++) {
        const h = document.createElement("div");
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        h.style.cssText = `
            position:fixed; left:${cx}px; top:${cy}px;
            font-size:${1 + Math.random() * 1.5}rem;
            pointer-events:none; z-index:1000;
            transition:all ${0.6 + Math.random() * 0.8}s cubic-bezier(.25,.46,.45,.94);
        `;
        document.body.appendChild(h);
        requestAnimationFrame(() => {
            h.style.left = cx + (Math.random() - 0.5) * 300 + "px";
            h.style.top = cy - 100 - Math.random() * 300 + "px";
            h.style.opacity = "0";
            h.style.transform = `scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`;
        });
        setTimeout(() => h.remove(), 1500);
    }
}

// ============================================= //
// CONFETTI                                      //
// ============================================= //
function triggerConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#e91e63","#f48fb1","#ff80ab","#ff4081","#f50057","#fce4ec","#ffeb3b","#ff9800","#e040fb","#7c4dff","#ff6e40"];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            rotSpd: (Math.random() - 0.5) * 10,
            sx: (Math.random() - 0.5) * 4,
            sy: Math.random() * 3 + 2,
            opacity: 1,
            shape: Math.random() > 0.5 ? "rect" : "circle",
        });
    }

    let frame = 0;
    const maxFrames = 300;

    function animate() {
        if (frame > maxFrames) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach((p) => {
            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate((p.rot * Math.PI) / 180);
            if (frame > maxFrames - 60) p.opacity = Math.max(0, (maxFrames - frame) / 60);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            if (p.shape === "rect") ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            else { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
            ctx.restore();
            p.y += p.sy;
            p.x += p.sx + Math.sin(frame * 0.05 + p.x) * 0.5;
            p.rot += p.rotSpd;
            if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        });

        frame++;
        requestAnimationFrame(animate);
    }

    animate();

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    setTimeout(() => window.removeEventListener("resize", onResize), (maxFrames / 60) * 1000);
}

// ============================================= //
// FLOATING HEARTS BACKGROUND                    //
// ============================================= //
function initFloatingHearts() {
    const canvas = heartsBgCanvas;
    const ctx = canvas.getContext("2d");
    let width, height;
    const hearts = [];

    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    function drawHeart(ctx, x, y, size) {
        ctx.beginPath();
        const t = size * 0.3;
        ctx.moveTo(x, y + t);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + t);
        ctx.bezierCurveTo(x - size / 2, y + (size + t) / 2, x, y + (size + t) / 1.2, x, y + size);
        ctx.bezierCurveTo(x, y + (size + t) / 1.2, x + size / 2, y + (size + t) / 2, x + size / 2, y + t);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + t);
        ctx.closePath();
    }

    const heartColors = [
        "rgba(232,69,124,",
        "rgba(244,143,177,",
        "rgba(233,30,99,",
        "rgba(255,128,171,",
    ];

    for (let i = 0; i < 15; i++) {
        hearts.push({
            x: Math.random() * (width || 1000),
            y: Math.random() * (height || 800),
            size: Math.random() * 15 + 8,
            sy: -(Math.random() * 0.5 + 0.2),
            sx: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.15 + 0.05,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpd: Math.random() * 0.02 + 0.01,
            color: heartColors[Math.floor(Math.random() * heartColors.length)],
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        hearts.forEach((h) => {
            ctx.save();
            const wx = Math.sin(h.wobble) * 20;
            h.wobble += h.wobbleSpd;
            ctx.fillStyle = h.color + h.opacity + ")";
            drawHeart(ctx, h.x + wx, h.y, h.size);
            ctx.fill();
            ctx.restore();
            h.y += h.sy;
            h.x += h.sx;
            if (h.y + h.size < 0) { h.y = height + h.size; h.x = Math.random() * width; }
            if (h.x < -50) h.x = width + 50;
            if (h.x > width + 50) h.x = -50;
        });
        requestAnimationFrame(animate);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) animate();
}

// ============================================= //
// CHECKLIST                                     //
// ============================================= //
const STORAGE_KEY = "valentine-checklist";
const CUSTOM_ITEMS_KEY = "valentine-custom-items";

function initChecklist() {
    loadChecklistState();

    checklistGrid.addEventListener("change", (e) => {
        if (e.target.classList.contains("checklist-checkbox")) {
            updateCounter();
            saveChecklistState();
        }
    });

    btnAddIdea.addEventListener("click", addCustomIdea);
    customIdeaInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addCustomIdea(); });

    btnSavePlan.addEventListener("click", savePlan);
    btnDownloadPlan.addEventListener("click", downloadPlan);

    updateCounter();
}

function updateCounter() {
    const count = checklistGrid.querySelectorAll(".checklist-checkbox:checked").length;
    counterText.textContent = `${count} idea${count !== 1 ? "s" : ""} selected`;
}

function saveChecklistState() {
    const state = {};
    checklistGrid.querySelectorAll(".checklist-checkbox").forEach((cb) => { state[cb.value] = cb.checked; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadChecklistState() {
    const customData = localStorage.getItem(CUSTOM_ITEMS_KEY);
    if (customData) {
        JSON.parse(customData).forEach((item) => createCustomChecklistItem(item.id, item.label, false));
    }

    const stateData = localStorage.getItem(STORAGE_KEY);
    if (stateData) {
        const state = JSON.parse(stateData);
        Object.entries(state).forEach(([value, checked]) => {
            const cb = checklistGrid.querySelector(`.checklist-checkbox[value="${value}"]`);
            if (cb) cb.checked = checked;
        });
    }
    updateCounter();
}

function addCustomIdea() {
    const text = customIdeaInput.value.trim();
    if (!text) { customIdeaInput.focus(); return; }
    const id = "custom-" + Date.now();
    createCustomChecklistItem(id, text, true);
    saveCustomItems();
    customIdeaInput.value = "";
    customIdeaInput.focus();
    showToast("✨", "Idea added!");
}

function createCustomChecklistItem(id, label, animateIn) {
    const el = document.createElement("label");
    el.className = "checklist-item" + (animateIn ? " fade-in-up" : "");
    el.dataset.item = id;
    el.dataset.custom = "true";
    el.innerHTML = `
        <input type="checkbox" class="checklist-checkbox" value="${id}" aria-label="${escapeHTML(label)}">
        <div class="checklist-card">
            <span class="checklist-icon">💡</span>
            <span class="checklist-label">${escapeHTML(label)}</span>
            <span class="checklist-desc">Custom idea!</span>
            <span class="checklist-check" aria-hidden="true">✓</span>
        </div>
    `;
    customItemsContainer.appendChild(el);
}

function saveCustomItems() {
    const items = [];
    checklistGrid.querySelectorAll('.checklist-item[data-custom="true"]').forEach((el) => {
        items.push({ id: el.dataset.item, label: el.querySelector(".checklist-label").textContent });
    });
    localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(items));
}

function savePlan() {
    saveChecklistState();
    showModal("Plan Saved! 💖", `Your Valentine's plan has been saved! This is going to be the best Valentine's Day ever, ${CONFIG.PARTNER_NAME}! 🥰`);
}

function downloadPlan() {
    const checked = checklistGrid.querySelectorAll(".checklist-checkbox:checked");
    if (checked.length === 0) { showToast("😅", "Select some ideas first!"); return; }

    let content = `💕 Our Valentine's Day Plan 💕\n${"═".repeat(35)}\n`;
    content += `For: ${CONFIG.PARTNER_NAME}\nFrom: ${CONFIG.YOUR_NAME}\nDate: ${CONFIG.VALENTINES_DATE}\n`;
    content += `${"═".repeat(35)}\n\nSelected Activities:\n\n`;

    checked.forEach((cb) => {
        const card = cb.nextElementSibling;
        const label = card.querySelector(".checklist-label").textContent;
        const icon = card.querySelector(".checklist-icon").textContent;
        content += `  ${icon} ${label}\n`;
    });

    content += `\n${"─".repeat(35)}\nTotal: ${checked.length} amazing activities!\n\n💕 Happy Valentine's Day! 💕\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "valentines-plan.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("📄", "Plan downloaded!");
}

// ============================================= //
// TOAST                                         //
// ============================================= //
let toastTimeout;
function showToast(icon, message) {
    clearTimeout(toastTimeout);
    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    toast.classList.add("show");
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ============================================= //
// MODAL                                         //
// ============================================= //
function initModal() {
    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modalOverlay.classList.contains("show")) closeModal(); });
}

function showModal(title, text) {
    $("#modal-title").textContent = title;
    $("#modal-text").textContent = text;
    modalOverlay.classList.add("show");
    modalClose.focus();
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "";
}

// ============================================= //
// UTILITIES                                     //
// ============================================= //
function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
}

// Keyboard nav for checklist
document.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("checklist-item") && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        const cb = e.target.querySelector(".checklist-checkbox");
        if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event("change", { bubbles: true })); }
    }
});
