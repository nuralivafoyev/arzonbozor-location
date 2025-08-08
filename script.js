// Geolocation Magic - Main Application Script

class GeolocationApp {
    constructor() {
        this.currentLanguage = 'en';
        this.currentPosition = null;
        this.map = null;
        this.marker = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateLanguage();
        this.showInitialState();
    }

    bindEvents() {
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        languageSelect.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateLanguage();
        });

        // Get location button
        const getLocationBtn = document.getElementById('getLocationBtn');
        getLocationBtn.addEventListener('click', () => {
            this.requestLocation();
        });

        // Refresh location button
        const refreshLocationBtn = document.getElementById('refreshLocationBtn');
        refreshLocationBtn.addEventListener('click', () => {
            this.requestLocation();
        });

        // Share location button
        const shareLocationBtn = document.getElementById('shareLocationBtn');
        shareLocationBtn.addEventListener('click', () => {
            this.shareLocation();
        });

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        retryBtn.addEventListener('click', () => {
            this.requestLocation();
        });
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                    element.textContent = translations[this.currentLanguage][key];
                } else {
                    element.textContent = translations[this.currentLanguage][key];
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    showInitialState() {
        this.hideAllSections();
        document.querySelector('.hero').style.display = 'block';
    }

    showLoadingState() {
        this.hideAllSections();
        document.getElementById('loadingSection').classList.remove('hidden');
    }

    showLocationState(position) {
        this.hideAllSections();
        document.getElementById('locationSection').classList.remove('hidden');
        this.displayLocationData(position);
        this.initializeMap(position);
    }

    showErrorState(error) {
        this.hideAllSections();
        document.getElementById('errorSection').classList.remove('hidden');
        this.displayErrorMessage(error);
    }

    hideAllSections() {
        const sections = [
            '.hero',
            '#loadingSection',
            '#locationSection',
            '#errorSection'
        ];

        sections.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
                element.classList.add('hidden');
            }
        });
    }

    requestLocation() {
        if (!navigator.geolocation) {
            this.showErrorState({
                code: 'NOT_SUPPORTED',
                message: 'Geolocation is not supported by this browser.'
            });
            return;
        }

        this.showLoadingState();

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentPosition = position;
                this.showLocationState(position);
            },
            (error) => {
                this.showErrorState(error);
            },
            options
        );
    }

    displayLocationData(position) {
        const { latitude, longitude, accuracy } = position.coords;

        // Format coordinates to 6 decimal places
        const latitudeFormatted = latitude.toFixed(6);
        const longitudeFormatted = longitude.toFixed(6);
        
        // Format accuracy
        const accuracyFormatted = accuracy ? 
            `${Math.round(accuracy)} ${translations[this.currentLanguage].meters}` : 
            '--';

        // Update display elements
        document.getElementById('latitudeValue').textContent = latitudeFormatted;
        document.getElementById('longitudeValue').textContent = longitudeFormatted;
        document.getElementById('accuracyValue').textContent = accuracyFormatted;

        // Add animation to coordinate values
        this.animateCoordinateValues();
    }

    animateCoordinateValues() {
        const coordinateValues = document.querySelectorAll('.coordinate-value');
        coordinateValues.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    initializeMap(position) {
        const { latitude, longitude } = position.coords;
        
        try {
            // Initialize map if Leaflet is available
            if (typeof L !== 'undefined') {
                // Remove existing map if any
                if (this.map) {
                    this.map.remove();
                }

                // Create new map
                this.map = L.map('map').setView([latitude, longitude], 15);

                // Add tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                }).addTo(this.map);

                // Add marker
                this.marker = L.marker([latitude, longitude])
                    .addTo(this.map)
                    .bindPopup(`
                        <div class="popup-content">
                            <strong>${translations[this.currentLanguage].yourLocation}</strong><br>
                            ${translations[this.currentLanguage].latitude}: ${latitude.toFixed(6)}<br>
                            ${translations[this.currentLanguage].longitude}: ${longitude.toFixed(6)}
                        </div>
                    `)
                    .openPopup();

                // Add custom styling to map container
                document.getElementById('mapContainer').style.display = 'block';
            } else {
                // Hide map container if Leaflet is not available
                document.getElementById('mapContainer').style.display = 'none';
            }
        } catch (error) {
            console.error('Error initializing map:', error);
            document.getElementById('mapContainer').style.display = 'none';
        }
    }

    displayErrorMessage(error) {
        let errorMessage = '';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = translations[this.currentLanguage].permissionDenied;
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = translations[this.currentLanguage].positionUnavailable;
                break;
            case error.TIMEOUT:
                errorMessage = translations[this.currentLanguage].timeout;
                break;
            default:
                errorMessage = translations[this.currentLanguage].unknownError;
                break;
        }

        document.getElementById('errorMessage').textContent = errorMessage;
    }

    async shareLocation() {
        if (!this.currentPosition) {
            return;
        }

        const { latitude, longitude } = this.currentPosition.coords;
        const shareText = `${translations[this.currentLanguage].shareText} ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        const shareUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        // Try native sharing first (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: translations[this.currentLanguage].yourLocation,
                    text: shareText,
                    url: shareUrl
                });
                return;
            } catch (error) {
                // Fall back to clipboard if share is cancelled
            }
        }

        // Fallback to clipboard
        try {
            const textToCopy = `${shareText}\n${shareUrl}`;
            await navigator.clipboard.writeText(textToCopy);
            this.showToast(translations[this.currentLanguage].copied);
        } catch (error) {
            // Final fallback: select text manually
            this.fallbackCopyToClipboard(`${shareText}\n${shareUrl}`);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showToast(translations[this.currentLanguage].copied);
            } else {
                this.showToast(translations[this.currentLanguage].copyFailed);
            }
        } catch (error) {
            this.showToast(translations[this.currentLanguage].copyFailed);
        }

        document.body.removeChild(textArea);
    }

    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            animation: toastIn 0.3s ease-out;
        `;

        // Add toast animation CSS
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toastIn {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                @keyframes toastOut {
                    from {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GeolocationApp();
});

// Add some extra visual effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(1.5)';
            particle.style.opacity = '0.8';
        });
        
        particle.addEventListener('mouseleave', () => {
            particle.style.transform = 'scale(1)';
            particle.style.opacity = '0.3';
        });
    });

    // Add dynamic background color change based on time
    const updateBackgroundBasedOnTime = () => {
        const hour = new Date().getHours();
        const body = document.body;
        
        if (hour >= 6 && hour < 12) {
            // Morning gradient
            body.style.background = 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
        } else if (hour >= 12 && hour < 18) {
            // Afternoon gradient  
            body.style.background = 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)';
        } else if (hour >= 18 && hour < 21) {
            // Evening gradient
            body.style.background = 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)';
        } else {
            // Night gradient
            body.style.background = 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)';
        }
    };

    updateBackgroundBasedOnTime();
    
    // Update background every hour
    setInterval(updateBackgroundBasedOnTime, 3600000);
});
