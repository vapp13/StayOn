let isSupported = false;
const statusElem = document.getElementById("wake-lock-status");
const wakeButton = document.getElementById("wake-lock-btn");
const autoWakeCheck = document.getElementById("auto-wake-lock");

// Test support for the Wake Lock API
if ('wakeLock' in navigator) {
    isSupported = true;
    statusElem.textContent = 'Screen Wake Lock API supported 🎉';
} else {
    wakeButton.disabled = true;
    statusElem.textContent = 'Wake lock is not supported by this browser.';
}

if (isSupported) {
    let wakeLock = null;

    async function requestWakeLock() {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            document.getElementById("wake-lock-status").textContent = "Wake lock is active!";
            document.getElementById("status-box").classList.replace("border-danger", "border-success");
            document.getElementById("wake-lock-btn").textContent = "Turn Wake Lock Off";

            // Listen for the release event
            wakeLock.onrelease = function(ev) {
                console.log('Wake lock released', ev);
                releaseWakeLock();
            };
            wakeLock.addEventListener('release', () => {
                // if wake lock is released alter the button accordingly
                changeUI('released');
            });
        } catch (err) {
            console.error(`Wake Lock error: ${err.name}, ${err.message}`);
            changeUI('released');
        }
    }

    function releaseWakeLock() {
        if (wakeLock) {
            wakeLock.release().then(() => {
                wakeLock = null;
                document.getElementById("wake-lock-status").textContent = "Wake lock has been released!";
                document.getElementById("status-box").classList.replace("border-success", "border-danger");
                document.getElementById("wake-lock-btn").textContent = "Turn Wake Lock On";
            });
        }
    }

    function changeUI(status = 'acquired') {
        const acquired = status === 'acquired' ? true : false;
        wakeButton.dataset.status = acquired ? 'on' : 'off';
        wakeButton.textContent = `Turn Wake Lock ${acquired ? 'OFF' : 'ON'}`;
        statusElem.textContent = `Wake Lock ${acquired ? 'is active!' : 'has been released!'}`;
    }

    wakeButton.addEventListener("click", () => {
        if (wakeLock) {
            releaseWakeLock();
        } else {
            requestWakeLock();
        }
    });

    // Handle visibility change
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            // Release the wake lock when the tab becomes inactive
            releaseWakeLock();
        } else if (wakeLock === null) {
            // Reacquire the wake lock if the tab becomes active and wake lock is not active
            if (autoWakeCheck.checked) {
                requestWakeLock();
            }
        }
    };

    // Auto-reactivate wake lock if checkbox is checked
    autoWakeCheck.addEventListener('change', () => {
        if (autoWakeCheck.checked) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    });

    // If the checkbox is checked, automatically re-acquire the wake lock when the tab becomes active again
    if (autoWakeCheck.checked) {
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }
}

// Theme toggle functionality
document.getElementById("toggle-theme").addEventListener("click", () => {
    const htmlElement = document.documentElement;
    const toggleButton = document.getElementById("toggle-theme");

    // Switch between light and dark themes
    const newTheme = htmlElement.dataset.bsTheme === "light" ? "dark" : "light";
    htmlElement.dataset.bsTheme = newTheme;

    // Add or remove the 'bg-light' class based on the current theme
    if (newTheme === "dark") {
        toggleButton.classList.add("bg-light");
    } else {
        toggleButton.classList.remove("bg-light");
    }
});
