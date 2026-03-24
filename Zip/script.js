/**
 * HOUSEWARMING WEBSITE - EVENT-READY VERSION
 * Simple, reliable, elderly-friendly
 * Smart Travel Assistant with distance/ETA calculation
 */

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    // House location (easy to change here)
    houseLat: 12.755061,
    houseLng: 75.124859,
    houseAddress: '123 New Home Street, Beautiful City',
    eventDate: '2025-03-12',
    // Average driving speed for ETA calculation (km/h)
    averageSpeed: 40
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Calculate ETA based on distance and average speed
 * Returns minutes
 */
function calculateETA(distanceKm, speedKmh) {
    return Math.round((distanceKm / speedKmh) * 60);
}

/**
 * Format distance for display
 */
function formatDistance(km) {
    if (km < 1) {
        return (km * 1000).toFixed(0) + ' meters';
    }
    return km.toFixed(1) + ' km';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==========================================
// INITIALIZATION - LOADER FIRST
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    // Show loader first
    showLoader();
});

function showLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    // Loader automatically disappears after 2 seconds
    setTimeout(() => {
        // Fade out loader
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            // Hide loader
            loader.style.display = 'none';
            
            // Show main content with fade in
            mainContent.style.display = 'block';
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.5s ease-in';
            }, 10);
            
            // Initialize app functionality
            initializeApp();
        }, 500);
    }, 2000);
}

function initializeApp() {
    setupButtonListeners();
    setupGalleryFunctionality();
    setupBlessingsForm();
    setupScrollAnimations();
    updateLocationDisplay();
    
    console.log('🏠 Housewarming Website Initialized');
    console.log(`📍 House Location: ${CONFIG.houseLat}, ${CONFIG.houseLng}`);
}

// ==========================================
// SMART TRAVEL ASSISTANT
// ==========================================

/**
 * Smart Travel Assistant - Main function
 * Gets user location, shows distance/ETA, then opens Google Maps
 */
function openTravelAssistant() {
    const statusElement = document.getElementById('locationStatus');
    const distanceETAElement = document.getElementById('distanceETA');
    
    // Show loading status
    if (statusElement) {
        statusElement.textContent = '🔍 Finding your location…';
        statusElement.className = 'location-status';
    }
    
    // Get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success: Got user's location
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                
                // Calculate distance and ETA
                const distance = calculateDistance(userLat, userLng, CONFIG.houseLat, CONFIG.houseLng);
                const eta = calculateETA(distance, CONFIG.averageSpeed);
                
                // Show distance and ETA
                if (distanceETAElement) {
                    distanceETAElement.innerHTML = `
                        <div style="font-size: var(--font-size-large); color: var(--primary-color); margin-bottom: 8px;">
                            📍 You are approximately <strong>${formatDistance(distance)}</strong> away
                        </div>
                        <div style="font-size: var(--font-size-large); color: var(--text-color);">
                            ⏱️ Estimated travel time: <strong>${eta} minutes</strong>
                        </div>
                    `;
                }
                
                // Update status
                if (statusElement) {
                    statusElement.textContent = '✓ Location found! Opening Google Maps…';
                    statusElement.className = 'location-status success';
                }
                
                // Open Google Maps with turn-by-turn navigation
                // FROM: User's current location
                // TO: Destination (our house)
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${CONFIG.houseLat},${CONFIG.houseLng}&travelmode=driving`;
                
                // Open in new tab after showing distance/ETA
                setTimeout(() => {
                    window.open(mapsUrl, '_blank');
                }, 1500);
                
                // Clear status after 4 seconds
                setTimeout(() => {
                    if (statusElement) {
                        statusElement.textContent = '';
                    }
                }, 4000);
            },
            (error) => {
                // Error: Couldn't get location
                let errorMessage = '⚠️ Could not get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access in your browser settings and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable at this moment.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                }
                
                if (statusElement) {
                    statusElement.textContent = errorMessage;
                    statusElement.className = 'location-status error';
                    
                    // Clear status after 5 seconds
                    setTimeout(() => {
                        statusElement.textContent = '';
                    }, 5000);
                }
                
                // Fallback: Open Google Maps without user's location
                console.warn('Geolocation error, falling back to Google Maps');
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.houseLat},${CONFIG.houseLng}&travelmode=driving`;
                window.open(mapsUrl, '_blank');
            },
            {
                enableHighAccuracy: true,
                timeout: 15000, // 15 seconds
                maximumAge: 0 // Always get fresh location
            }
        );
    } else {
        // Geolocation not supported
        if (statusElement) {
            statusElement.textContent = '⚠️ Geolocation not supported. Opening maps…';
            statusElement.className = 'location-status error';
            
            setTimeout(() => {
                statusElement.textContent = '';
            }, 3000);
        }
        
        // Fallback: Open Google Maps without location
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.houseLat},${CONFIG.houseLng}&travelmode=driving`;
        window.open(mapsUrl, '_blank');
    }
}

// ==========================================
// BUTTON EVENT LISTENERS
// ==========================================

function setupButtonListeners() {
    // Main navigation button (in welcome section)
    const guideBtn = document.getElementById('guideBtn');
    if (guideBtn) {
        guideBtn.addEventListener('click', openTravelAssistant);
    }

    // Location section button
    const routeBtn = document.getElementById('routeBtn');
    if (routeBtn) {
        routeBtn.addEventListener('click', openTravelAssistant);
    }

    // Travel Assistant button (replaced Call Host)
    const travelAssistantBtn = document.getElementById('travelAssistantBtn');
    if (travelAssistantBtn) {
        travelAssistantBtn.addEventListener('click', openTravelAssistant);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Button hover animations
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-3px)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ==========================================
// GALLERY FUNCTIONALITY
// ==========================================

function setupGalleryFunctionality() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const fullscreenGallery = document.getElementById('fullscreenGallery');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeBtn = document.querySelector('.close-fullscreen');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));

    // Open fullscreen
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            displayImage(index);
            fullscreenGallery.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    function displayImage(index) {
        if (images[index]) {
            fullscreenImage.src = images[index].src;
            fullscreenImage.alt = images[index].alt;
        }
    }

    // Navigation
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        displayImage(currentImageIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        displayImage(currentImageIndex);
    });

    // Close
    closeBtn.addEventListener('click', closeFullscreen);
    fullscreenGallery.addEventListener('click', (e) => {
        if (e.target === fullscreenGallery) closeFullscreen();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (fullscreenGallery.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                displayImage(currentImageIndex);
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                displayImage(currentImageIndex);
            } else if (e.key === 'Escape') {
                closeFullscreen();
            }
        }
    });

    function closeFullscreen() {
        fullscreenGallery.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ==========================================
// DIGITAL BLESSINGS (SIMPLIFIED)
// ==========================================

function setupBlessingsForm() {
    const form = document.getElementById('blessingsForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccess');
    const blessingsList = document.getElementById('blessingsList');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const blessing = {
            name: document.getElementById('guestName').value,
            message: document.getElementById('blessingMessage').value,
            timestamp: new Date().toLocaleString()
        };

        // Save to localStorage
        saveBlessingToStorage(blessing);

        // Display success message
        successMessage.style.display = 'block';
        form.style.display = 'none';

        // Reset form
        form.reset();

        // Refresh blessings display
        displayBlessings();
    });

    closeSuccessBtn.addEventListener('click', () => {
        successMessage.style.display = 'none';
        form.style.display = 'flex';
    });

    // Initial display
    displayBlessings();
}

function saveBlessingToStorage(blessing) {
    let blessings = JSON.parse(localStorage.getItem('blessings') || '[]');
    blessings.push(blessing);
    localStorage.setItem('blessings', JSON.stringify(blessings));
}

function displayBlessings() {
    const blessings = JSON.parse(localStorage.getItem('blessings') || '[]');
    const blessingsList = document.getElementById('blessingsList');
    blessingsList.innerHTML = '';

    // Show latest 5 blessings
    const recentBlessings = blessings.slice(-5).reverse();

    if (recentBlessings.length === 0) {
        blessingsList.innerHTML = '<p style="text-align: center; color: var(--light-text); padding: var(--spacing-lg);">No blessings yet. Be the first to share!</p>';
        return;
    }

    recentBlessings.forEach(blessing => {
        const card = document.createElement('div');
        card.className = 'blessing-card';
        card.innerHTML = `
            <div class="name">${escapeHtml(blessing.name)}</div>
            <div class="message">"${escapeHtml(blessing.message)}"</div>
        `;
        blessingsList.appendChild(card);
    });
}

function updateLocationDisplay() {
    const addressDisplay = document.getElementById('addressDisplay');
    if (addressDisplay) {
        addressDisplay.textContent = CONFIG.houseAddress;
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate gallery items
                if (entry.target.classList.contains('gallery-section')) {
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        if (!item.classList.contains('animated')) {
                            item.style.animationDelay = `${index * 0.1}s`;
                            item.classList.add('animated');
                        }
                    });
                }
                
                // Add subtle fade-in to sections
                if (!entry.target.dataset.animated) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    entry.target.dataset.animated = 'true';
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });
}

// ==========================================
// PERFORMANCE & ACCESSIBILITY
// ==========================================

// Check for prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable all animations
    document.documentElement.style.setProperty('--transition', 'none');
    document.documentElement.style.setProperty('--transition-slow', 'none');
}

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('sw.js').catch(() => {
        // Service worker not available
    });
}