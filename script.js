
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

