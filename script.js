/* ----------------------------------- */
/* 1. THEME TOGGLE LOGIC               */
/* ----------------------------------- */
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const htmlElement = document.documentElement;

// Check Local Storage on Load
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    htmlElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
} else {
    // Default to dark
    htmlElement.setAttribute('data-theme', 'dark');
    toggleSwitch.checked = true;
}

// Switch Listener
toggleSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});


/* ----------------------------------- */
/* 2. LIGHTBOX / MODAL LOGIC           */
/* ----------------------------------- */

// Gather all projects from the DOM
const projectCards = document.querySelectorAll('.project-card');
const lightbox = document.getElementById('lightbox');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-project');
const nextBtn = document.querySelector('.next-project');

// Elements inside lightbox to update
const lbVideo = document.getElementById('lightbox-video');
const lbTitle = document.getElementById('lightbox-title');
const lbDesc = document.getElementById('lightbox-desc');
const lbTags = document.getElementById('lightbox-tags');
const lbLink = document.getElementById('lightbox-link');

let currentIndex = 0;

// Add Click Event to every Project Card
projectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        currentIndex = index;
        openLightbox(index);
    });
});

function openLightbox(index) {
    const card = projectCards[index];
    
    // Extract data from the clicked card
    const videoSrc = card.querySelector('source').src;
    const title = card.querySelector('h4').innerText;
    const desc = card.querySelector('p').innerText;
    const tagsHTML = card.querySelector('.tags').innerHTML;
    const linkHref = card.querySelector('.btn-link').href;

    // Populate Lightbox
    lbVideo.src = videoSrc;
    lbTitle.innerText = title;
    lbDesc.innerText = desc;
    lbTags.innerHTML = tagsHTML;
    lbLink.href = linkHref;

    // Show Lightbox
    lightbox.classList.add('active');
    lbVideo.load(); // Reload video source
    lbVideo.play();
}

// Close Lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    lbVideo.pause();
    lbVideo.src = ""; // Clear source to stop buffering
}

closeBtn.addEventListener('click', closeLightbox);

// Close if clicking outside content
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Navigation Functions
function showNext() {
    currentIndex++;
    if (currentIndex >= projectCards.length) {
        currentIndex = 0; // Loop back to start
    }
    openLightbox(currentIndex);
}

function showPrev() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = projectCards.length - 1; // Loop to end
    }
    openLightbox(currentIndex);
}

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing lightbox
    showNext();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
});

// Keyboard Navigation (Left/Right/Esc)
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') closeLightbox();
});

// Optional: Play videos in grid on hover
const gridVideos = document.querySelectorAll('.project-card video');
gridVideos.forEach(video => {
    video.addEventListener('mouseenter', () => video.play());
    video.addEventListener('mouseleave', () => video.pause());
});