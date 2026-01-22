/* ----------------------------------- */
/* 1. THEME TOGGLE LOGIC               */
/* ----------------------------------- */
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    htmlElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
} else {
    htmlElement.setAttribute('data-theme', 'dark');
    toggleSwitch.checked = true;
}

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
/* 2. SLIDER LOGIC (CERTIFICATES)      */
/* ----------------------------------- */
const track = document.getElementById('certTrack');
const btnPrev = document.getElementById('certPrev');
const btnNext = document.getElementById('certNext');
let slideIndex = 0;

function updateSliderPosition() {
    const card = document.querySelector('.cert-card-slide');
    if(!card) return;
    
    const cardWidth = card.getBoundingClientRect().width;
    const gap = 20; 
    const moveAmount = cardWidth + gap;
    
    track.style.transform = `translateX(-${slideIndex * moveAmount}px)`;
}

btnNext.addEventListener('click', () => {
    const card = document.querySelector('.cert-card-slide');
    const cardWidth = card.getBoundingClientRect().width + 20;
    const totalCards = track.children.length;
    const containerWidth = track.parentElement.offsetWidth;
    const visibleCards = Math.floor(containerWidth / cardWidth);

    if (slideIndex < totalCards - visibleCards) {
        slideIndex++;
        updateSliderPosition();
    }
});

btnPrev.addEventListener('click', () => {
    if (slideIndex > 0) {
        slideIndex--;
        updateSliderPosition();
    }
});

window.addEventListener('resize', () => {
    slideIndex = 0;
    updateSliderPosition();
});


/* ----------------------------------- */
/* 3. LIGHTBOX / MODAL LOGIC           */
/* ----------------------------------- */

const projectCards = Array.from(document.querySelectorAll('.project-card'));
const certCards = Array.from(document.querySelectorAll('.cert-card-slide'));

let currentGroup = []; 
let currentIndex = 0;

const lightbox = document.getElementById('lightbox');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-project');
const nextBtn = document.querySelector('.next-project');

const lbVideo = document.getElementById('lightbox-video');
const lbImage = document.getElementById('lightbox-image');
const lbTitle = document.getElementById('lightbox-title');
const lbDesc = document.getElementById('lightbox-desc');
const lbTags = document.getElementById('lightbox-tags');
const lbLink = document.getElementById('lightbox-link');

projectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        currentGroup = projectCards;
        currentIndex = index;
        openLightbox(card);
    });
});

certCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        currentGroup = certCards;
        currentIndex = index;
        openLightbox(card);
    });
});

function openLightbox(card) {
    const type = card.getAttribute('data-type') || 'video'; 
    
    lbVideo.style.display = 'none';
    lbVideo.src = "";
    lbImage.style.display = 'none';
    lbImage.src = "";
    lbTags.innerHTML = "";

    if (type === 'video') {
        const videoSrc = card.querySelector('source').src;
        const title = card.querySelector('h4').innerText;
        const desc = card.querySelector('p').innerText;
        const tagsHTML = card.querySelector('.tags').innerHTML;
        const linkHref = card.querySelector('.btn-link').href;

        lbVideo.src = videoSrc;
        lbVideo.style.display = 'block';
        lbTitle.innerText = title;
        lbDesc.innerText = desc;
        lbTags.innerHTML = tagsHTML;
        lbLink.href = linkHref;
        lbLink.innerHTML = 'View on GitHub <i class="fas fa-arrow-right"></i>';
        
        lightbox.classList.add('active');
        lbVideo.load();
        lbVideo.play();
    } 
    else if (type === 'image') {
        const imgSrc = card.getAttribute('data-img');
        const title = card.querySelector('h4').innerText;
        const linkHref = card.querySelector('a').href;

        lbImage.src = imgSrc;
        lbImage.style.display = 'block';
        lbTitle.innerText = title;
        lbDesc.innerText = "Certification Credential"; 
        lbLink.href = linkHref;
        lbLink.innerHTML = 'View Credential <i class="fas fa-external-link-alt"></i>';

        lightbox.classList.add('active');
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lbVideo.pause();
    lbVideo.src = ""; 
}

closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

function showNext() {
    currentIndex++;
    if (currentIndex >= currentGroup.length) {
        currentIndex = 0; 
    }
    openLightbox(currentGroup[currentIndex]);
}

function showPrev() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = currentGroup.length - 1; 
    }
    openLightbox(currentGroup[currentIndex]);
}

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') closeLightbox();
});

document.getElementById('year').textContent = new Date().getFullYear();