import transformers from './transformers/index.js';
import ekoAnalytics from '../ekoAnalytics';

function track(event, data) {
    // Add the "pixel" prefix.
    event = `pixel.${event}`;

    // Apply data transform if exists.
    if (transformers[event]) {
        data = transformers[event](data);
    }

    ekoAnalytics.track(event, data);
}

export default {
    track
};
