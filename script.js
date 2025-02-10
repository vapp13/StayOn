let isSupported = false;
const statusElem = document.getElementById("wake-lock-status");
const wakeButton = document.getElementById("wake-lock-btn");
const autoWakeCheck = document.getElementById("auto-wake-lock");

// Test support for the Wake Lock API
if ('wakeLock' in navigator) {
    isSupported = true;
    statusElem.textContent = 'StayOn! API supported 🎉';
} else {
    wakeButton.disabled = true;
    statusElem.textContent = 'StayOn! is not supported by this browser.';
}

if (isSupported) {
    let wakeLock = null;

    async function requestWakeLock() {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            document.getElementById("wake-lock-status").textContent = "StayOn! is active.";
            document.getElementById("status-box").classList.replace("border-danger", "border-success");
            document.getElementById("wake-lock-btn").textContent = "Deactivate StayOn!";

            // Listen for the release event
            wakeLock.onrelease = function(ev) {
                console.log('StayOn! released', ev);
                releaseWakeLock();
            };
            wakeLock.addEventListener('release', () => {
                // if StayOn! is released alter the button accordingly
                releaseWakeLock();
            });
        } catch (err) {
            console.error(`StayOn! error: ${err.name}, ${err.message}`);
            releaseWakeLock();
        }
    }

    function releaseWakeLock() {
        if (wakeLock) {
            wakeLock.release().then(() => {
                wakeLock = null;
                document.getElementById("wake-lock-status").textContent = "StayOn! has been released!";
                document.getElementById("status-box").classList.replace("border-success", "border-danger");
                document.getElementById("wake-lock-btn").textContent = "Activate StayOn!";
            });
        }
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
            // Release StayOn! when the tab becomes inactive
            releaseWakeLock();
        } else if (wakeLock === null) {
            // Reacquire StayOn! if the tab becomes active and StayOn! is not active
            if (autoWakeCheck.checked) {
                requestWakeLock();
            }
        }
    };

    // Auto-reactivate StayOn! if checkbox is checked
    autoWakeCheck.addEventListener('change', () => {
        if (autoWakeCheck.checked) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    });

    // If the checkbox is checked, automatically re-acquire StayOn! when the tab becomes active again
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
