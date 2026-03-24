/**
 * HOUSEWARMING CEREMONY WEBSITE
 * Premium Interactive Features
 */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    houseLat: 12.755061,
    houseLng: 75.124859,
    houseAddress: '123 New Home Street, Beautiful City, 560001',
    averageSpeed: 40,
    eventDate: '2025-03-12'
};

// Gallery Images (High-quality curated)
const GALLERY_IMAGES = [
    {
        url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Elegant Living Space',
        alt: 'Modern living room with warm lighting'
    },
    {
        url: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Sacred Prayer Corner',
        alt: 'Traditional pooja room with diyas'
    },
    {
        url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Modern Kitchen',
        alt: 'Spacious kitchen with wooden cabinets'
    },
    {
        url: 'https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Cozy Bedroom',
        alt: 'Master bedroom with warm decor'
    },
    {
        url: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Dining Area',
        alt: 'Beautiful dining space for gatherings'
    },
    {
        url: 'https://images.pexels.com/photos/1268872/pexels-photo-1268872.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Outdoor Garden',
        alt: 'Peaceful garden with seating area'
    }
];

// ==========================================
// PARTICLE SYSTEM
// ==========================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.init();
        this.animate();
        this.handleResize();
    }
    
    init() {
        this.resize();
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 3 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.2,
                color: `hsl(${Math.random() * 60 + 30}, 80%, 60%)`
            });
        }
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = `rgba(255, 200, 100, ${p.alpha * 0.5})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.init();
        });
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function formatDistance(km) {
    if (km < 1) return `${(km * 1000).toFixed(0)} meters`;
    return `${km.toFixed(1)} km`;
}

function calculateETA(distance, speed) {
    return Math.round((distance / speed) * 60);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// LOADER
// ==========================================
function initLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 1800);
    }
}

// ==========================================
// GALLERY
// ==========================================
let currentImageIndex = 0;

function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = GALLERY_IMAGES.map((img, index) => `
        <div class="gallery-item" data-index="${index}">
            <img src="${img.url}" alt="${img.alt}" loading="lazy">
            <div class="gallery-overlay">
                <span>${img.title}</span>
            </div>
        </div>
    `).join('');
    
    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
        item.addEventListener('click', () => openGalleryModal(parseInt(item.dataset.index)));
    });
}

function openGalleryModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = GALLERY_IMAGES[index].url;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
            document.getElementById('modalImage').src = GALLERY_IMAGES[currentImageIndex].url;
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % GALLERY_IMAGES.length;
            document.getElementById('modalImage').src = GALLERY_IMAGES[currentImageIndex].url;
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}

// ==========================================
// BLESSINGS SYSTEM
// ==========================================
let blessings = [];

function loadBlessings() {
    const stored = localStorage.getItem('housewarmingBlessings');
    if (stored) {
        blessings = JSON.parse(stored);
    }
    renderBlessings();
}

function saveBlessings() {
    localStorage.setItem('housewarmingBlessings', JSON.stringify(blessings));
}

function renderBlessings() {
    const container = document.getElementById('blessingsList');
    const countSpan = document.getElementById('blessingCount');
    
    if (countSpan) {
        countSpan.textContent = blessings.length;
    }
    
    if (!container) return;
    
    if (blessings.length === 0) {
        container.innerHTML = '<div class="blessing-placeholder">✨ No blessings yet. Be the first to share your love! ✨</div>';
        return;
    }
    
    const recent = [...blessings].reverse().slice(0, 10);
    container.innerHTML = recent.map(b => `
        <div class="blessing-card">
            <div class="blessing-name">🙏 ${escapeHtml(b.name)}</div>
            <div class="blessing-message">"${escapeHtml(b.message)}"</div>
        </div>
    `).join('');
}

function addBlessing(name, message) {
    if (!name.trim() || !message.trim()) return false;
    
    blessings.push({
        name: name.trim(),
        message: message.trim(),
        timestamp: Date.now()
    });
    
    saveBlessings();
    renderBlessings();
    return true;
}

function initBlessingsForm() {
    const form = document.getElementById('blessingForm');
    const feedback = document.getElementById('formFeedback');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('guestName').value;
        const message = document.getElementById('blessingMsg').value;
        
        if (!name || !message) {
            if (feedback) {
                feedback.innerHTML = '<div style="color: #ffaa77;">✨ Please enter both name and blessing ✨</div>';
                setTimeout(() => { feedback.innerHTML = ''; }, 3000);
            }
            return;
        }
        
        if (addBlessing(name, message)) {
            if (feedback) {
                feedback.innerHTML = '<div style="color: #88ff88;">💖 Thank you! Your blessing has been received with gratitude 💖</div>';
                setTimeout(() => { feedback.innerHTML = ''; }, 4000);
            }
            form.reset();
        } else {
            if (feedback) {
                feedback.innerHTML = '<div style="color: #ffaa77;">Something went wrong. Please try again.</div>';
            }
        }
    });
}

// ==========================================
// TRAVEL ASSISTANT
// ==========================================
function openTravelAssistant() {
    const statusDiv = document.getElementById('locationStatus');
    const etaPreview = document.getElementById('distancePreview');
    
    if (!navigator.geolocation) {
        if (statusDiv) statusDiv.textContent = '⚠️ Geolocation not supported. Opening maps...';
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${CONFIG.houseLat},${CONFIG.houseLng}&travelmode=driving`, '_blank');
        return;
    }
    
    if (statusDiv) statusDiv.textContent = '🔍 Locating you...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const distance = calculateDistance(userLat, userLng, CONFIG.houseLat, CONFIG.houseLng);
            const eta = calculateETA(distance, CONFIG.averageSpeed);
            
            if (etaPreview) {
                etaPreview.innerHTML = `📍 Distance: ${formatDistance(distance)} | ⏱️ ETA: ~${eta} minutes by car`;
                etaPreview.style.opacity = '1';
            }
            
            if (statusDiv) {
                statusDiv.textContent = '✓ Location found! Opening Google Maps...';
                statusDiv.style.color = '#88ff88';
            }
            
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${CONFIG.houseLat},${CONFIG.houseLng}&travelmode=driving`;
            
            setTimeout(() => {
                window.open(mapsUrl, '_blank');
            }, 1000);
            
            setTimeout(() => {
                if (statusDiv) statusDiv.textContent = '';
            }, 5000);
        },
        (error) => {
            let errorMsg = '⚠️ Could not get your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location unavailable.';
                    break;
                default:
                    errorMsg += 'Opening maps without location.';
            }
            if (statusDiv) {
                statusDiv.textContent = errorMsg;
                setTimeout(() => { statusDiv.textContent = ''; }, 4000);
            }
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${CONFIG.houseLat},${CONFIG.houseLng}&travelmode=driving`, '_blank');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// ==========================================
// NAVBAR SCROLL & MOBILE MENU
// ==========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// ==========================================
// BUTTON NAVIGATION
// ==========================================
function initButtons() {
    const directionsBtn = document.getElementById('directionsBtn');
    const travelBtn = document.getElementById('travelBtn');
    const galleryNavBtn = document.getElementById('galleryNavBtn');
    
    if (directionsBtn) directionsBtn.addEventListener('click', openTravelAssistant);
    if (travelBtn) travelBtn.addEventListener('click', openTravelAssistant);
    
    if (galleryNavBtn) {
        galleryNavBtn.addEventListener('click', () => {
            document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    
    // Particle system
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
    
    initGallery();
    initGalleryModal();
    loadBlessings();
    initBlessingsForm();
    initNavbar();
    initScrollAnimations();
    initButtons();
    
    console.log('✨ Gruhapravesh Website Loaded ✨');
});