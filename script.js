document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navIcons = document.querySelectorAll('.nav-icon');
    const messageBox = document.getElementById('message-box');
    const messageClose = document.querySelector('.message-close');
    const sections = document.querySelectorAll('.section-content');
    const bgVideo = document.getElementById('bg-video');
    const preloader = document.getElementById('preloader');
    const homeSection = document.getElementById('home');
    const modeSwitch = document.getElementById('mode-switch');

    // Music player elements
    const backgroundMusic = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const muteBtn = document.getElementById('mute-btn');
    const volumeIcon = document.getElementById('volume-icon');
    const volumeSlider = document.getElementById('volume-slider');

    // Initial setup
    let currentSection = homeSection;
    let isMessageBoxOpen = false;
    let musicStarted = false;
    let userInitiatedMusic = false;

    // --- Preloader ---
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
        // Open home section by default after preloader
        openMessageBox();
        openSection('home');
        const homeIcon = document.querySelector('.nav-icon[data-section="home"]');
        if (homeIcon) {
            homeIcon.classList.add('active');
        }
    });

    // --- Theme Switching ---
    const setMode = (mode) => {
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
            bgVideo.src = 'night.mp4';
            modeSwitch.innerHTML = '<i class="fas fa-sun"></i> <span>Day Mode</span>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            bgVideo.src = 'bg.mp4';
            modeSwitch.innerHTML = '<i class="fas fa-moon"></i> <span>Night Mode</span>';
            localStorage.setItem('theme', 'light');
        }
    };

    modeSwitch.addEventListener('click', () => {
        const currentMode = localStorage.getItem('theme') || 'light';
        setMode(currentMode === 'light' ? 'dark' : 'light');
    });

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setMode(savedTheme);
    }

    // --- Music Player ---
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4;

        playPauseBtn.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                playMusic();
                userInitiatedMusic = true;
            } else {
                pauseMusic();
                userInitiatedMusic = true;
            }
        });

        muteBtn.addEventListener('click', () => {
            backgroundMusic.muted = !backgroundMusic.muted;
            volumeIcon.className = backgroundMusic.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        });

        volumeSlider.addEventListener('input', function() {
            backgroundMusic.volume = this.value / 100;
            if (this.value == 0) {
                volumeIcon.className = 'fas fa-volume-mute';
                backgroundMusic.muted = true;
            } else {
                backgroundMusic.muted = false;
                volumeIcon.className = this.value < 25 ? 'fas fa-volume-down' : 'fas fa-volume-up';
            }
        });
    }

    function playMusic() {
        if (!backgroundMusic) return;
        backgroundMusic.play().then(() => {
            playIcon.className = 'fas fa-pause';
            musicStarted = true;
        }).catch(error => console.log("Play prevented:", error));
    }

    function pauseMusic() {
        if (!backgroundMusic) return;
        backgroundMusic.pause();
        playIcon.className = 'fas fa-play';
    }

    // --- Navigation ---
    navIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const sectionId = icon.getAttribute('data-section');
            if (!isMessageBoxOpen) openMessageBox();
            openSection(sectionId);
            navIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });

    function openMessageBox() {
        if (!messageBox) return;
        messageBox.classList.add('active');
        isMessageBoxOpen = true;
    }

    function openSection(sectionId) {
        if (!messageBox) return;
        sections.forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = targetSection;
            messageBox.scrollTop = 0; // Reset scroll position to top
            if (sectionId === 'skills') setSkillLevels();
        }
    }

    if (messageClose) {
        messageClose.addEventListener('click', () => {
            messageBox.classList.remove('active');
            isMessageBoxOpen = false;
            navIcons.forEach(i => i.classList.remove('active'));
        });
    }

    function setSkillLevels() {
        document.querySelectorAll('.skill-level').forEach(level => {
            level.style.width = level.getAttribute('data-level');
        });
    }

    // --- Scroll-triggered Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // --- 3D Tilt Effect for Project Cards ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const validateField = (field, validation) => {
            if (validation(field.value)) {
                field.classList.remove('is-invalid');
                return true;
            } else {
                field.classList.add('is-invalid');
                return false;
            }
        };

        const isNotEmpty = value => value.trim() !== '';
        const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        nameInput.addEventListener('input', () => validateField(nameInput, isNotEmpty));
        emailInput.addEventListener('input', () => validateField(emailInput, isValidEmail));
        messageInput.addEventListener('input', () => validateField(messageInput, isNotEmpty));

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateField(nameInput, isNotEmpty);
            const isEmailValid = validateField(emailInput, isValidEmail);
            const isMessageValid = validateField(messageInput, isNotEmpty);

            if (isNameValid && isEmailValid && isMessageValid) {
                const formData = new FormData(contactForm);
                const submitButton = contactForm.querySelector('.submit-btn');
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;

                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => response.json()).then(data => {
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    if (data.success) {
                        successMessage.innerHTML = '<p>Thank you for your message! I\'ll get back to you soon.</p>';
                    } else {
                        successMessage.innerHTML = '<p>Sorry, there was an error sending your message. Please try again later.</p>';
                    }
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                }).catch(error => {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.innerHTML = '<p>Sorry, there was an error sending your message. Please try again later.</p>';
                    contactForm.innerHTML = '';
                    contactForm.appendChild(errorMessage);
                });
            }
        });
    }

    // --- Scroll Indicator ---
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            openSection('about');
            navIcons.forEach(i => i.classList.remove('active'));
            document.querySelector('.nav-icon[data-section="about"]').classList.add('active');
        });
    }

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        messageBox.addEventListener('scroll', () => {
            if (messageBox.scrollTop > 200) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            messageBox.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
 