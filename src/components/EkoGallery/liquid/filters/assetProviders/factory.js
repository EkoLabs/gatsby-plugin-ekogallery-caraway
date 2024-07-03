import contentful from './contentful';
import shopify from './shopify';

function getImageUrl(provider, baseUrl, params) {
    if (provider === 'shopify') {
        return shopify.buildImageUrl(baseUrl, params);
    }
    if (provider === 'contentful') {
        return contentful.buildImageUrl(baseUrl, params);
    }
}

export default {
    getImageUrl
};
