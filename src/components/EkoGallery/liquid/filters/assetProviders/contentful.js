// Accepted query params by the contentful images API:
// Image format, Sub format, width, height, fit, focus, crop radius, quality and background color

import utils from '../utils';

const QUERY_PARAMS_KEYS = {
    height: 'h',
    width: 'w',
    format: 'fm',
    loselessformat: 'fl',
    fit: 'fit',
    focus: 'f',
    cropradius: 'r',
    quality: 'q',
    backgroundcolor: 'bg'
};

function buildImageUrl(baseUrl, params) {
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
            encodeURIComponent(QUERY_PARAMS_KEYS[key]) + '=' +
            encodeURIComponent(queryParams[key])
        );
    }

    return imageUrl;
}

export default {
    buildImageUrl
};
