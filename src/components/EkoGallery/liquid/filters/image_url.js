import urlBuilder from './assetProviders/factory.js';

// https://shopify.dev/docs/api/liquid/filters/image_url
function register(engine) {
    engine.registerFilter('image_url', function(input, ...params) {
        try {
            return urlBuilder.getImageUrl('contentful', input?.preview_image.src, params);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    });
}

export default {
    register
};
