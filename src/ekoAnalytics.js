const trackingQueues = {};
let paused = true;
let lastUrl;

export function pause() {
    paused = true;
}

export function track(...args) {
    const trackingUrl = window.location.pathname;
    if (!trackingQueues[trackingUrl]) {
        trackingQueues[trackingUrl] = [];
    }

    if (lastUrl && lastUrl !== trackingUrl) {
        pause();
    }

    if (paused) {
        trackingQueues[trackingUrl].push(args);
    } else if (window.EkoAnalytics) {
        // eslint-disable-next-line new-cap
        window.EkoAnalytics('track', ...args);
    }
    lastUrl = trackingUrl;
}

export function reset(...args) {
    pause();
    if (window.EkoAnalytics) {
        // eslint-disable-next-line new-cap
        window.EkoAnalytics('reset', ...args);
    }
}

export function resume(currentUrl) {
    paused = false;
    lastUrl = currentUrl;

    let trackingQueue = trackingQueues[currentUrl];
    while (trackingQueue?.length > 0) {
        const trackingCall = trackingQueue.shift();
        track(...trackingCall);
    }
}

export default {
    track,
    reset,
    pause,
    resume,
};
