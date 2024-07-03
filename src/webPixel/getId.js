function getIdFromCookies(itemId) {
    // Split the cookie string into an array of individual cookies
    const cookies = document.cookie.split(';');

    // Loop through each cookie to find the one with the specified name
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        // Check if this cookie has the specified name as a key
        if (cookie.indexOf(itemId + '=') === 0) {
            return cookie.substring(itemId.length + 1);
        }
    }

    return '';
}

export default function getId(storage, itemId) {
    let storageId = '';

    try {
        const storageObject = window[storage];
        storageId = storageObject.getItem(itemId);
        if (!storageId) {
            storageId = getIdFromCookies(itemId);
        }
    } catch (err) {
        // Do nothing in case of error, can be caused if local storage is not allowed.
        // eslint-disable-next-line no-console
        console.warn('Error while getting the id from storage:', itemId, err);
    }

    return storageId;
}
