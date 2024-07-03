import getId from './getId';
import { v4 as uuidv4 } from 'uuid';

const userItemId = 'eauid';
const sessionItemId = 'easid';
const MAX_AGE_FOR_USER_ID_COOKIE = 'max-age=2147483647';

function getUrlParam(itemId) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(itemId);
}

function generateEkoId(storage, itemId) {
    let generatedId = uuidv4();

    // Store in local storage
    window[storage].setItem(itemId, generatedId);

    // Store in cookies
    const maxAgeProperty = itemId === userItemId ? MAX_AGE_FOR_USER_ID_COOKIE : '';
    // eslint-disable-next-line max-len
    window.document.cookie = `${itemId}=${generatedId}; domain=.${window.location.hostname}; path=/; secure; samesite=strict; ${maxAgeProperty}`;

    return generatedId;
}

function getEkoId(storage, itemId) {
    const paramId = getUrlParam(itemId);
    if (paramId) {
        return paramId;
    }

    let ekoId = getId(storage, itemId);

    if (!ekoId) {
        ekoId = generateEkoId(storage, itemId);
    }

    return ekoId;
}

function getEkoIds() {
    let userId;
    let sessionId;

    userId = getEkoId('localStorage', userItemId);
    sessionId = getEkoId('sessionStorage', sessionItemId);

    // When client disable storage case
    if (!userId) {
        userId = getUrlParam(userItemId) || '';
    }

    // When client disable storage case
    if (!sessionId) {
        sessionId = getUrlParam(sessionItemId) || '';
    }

    return {
        userId,
        sessionId
    };
}

export default getEkoIds;
