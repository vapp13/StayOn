document.addEventListener('DOMContentLoaded', () => {
    let wakeLock = null;

    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock is active');
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    requestWakeLock();

    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });
});
