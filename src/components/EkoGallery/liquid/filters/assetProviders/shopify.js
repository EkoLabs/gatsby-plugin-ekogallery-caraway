// Accepted query params by the shopify image_url liquid filter:
// width, height, crop, format, pad_color

import utils from '../utils';

function buildImageUrl(baseUrl, params) {
    if (!baseUrl) {
        return '';
    }
    let width = utils.getParamValue(params, 'width');
    let height = utils.getParamValue(params, 'height');

    if (typeof width === 'undefined' && height === 'undefined') {
        // eslint-disable-next-line max-len
        throw Error('You need to specify either a width or height parameter. If neither are specified, then an error is returned.');
    }

    let queryParams = {};
    if (width) {
        queryParams.width = width;
    }
    if (height) {
        queryParams.height = height;
    }

    let imageUrl = baseUrl;

    for (const key in queryParams) {
        const separator = imageUrl.indexOf('?') === -1 ? '?' : '&';
        imageUrl += (
            separator +
            encodeURIComponent(key) + '=' +
            encodeURIComponent(queryParams[key])
        );
    }

    return imageUrl;
}

export default {
    buildImageUrl
};
