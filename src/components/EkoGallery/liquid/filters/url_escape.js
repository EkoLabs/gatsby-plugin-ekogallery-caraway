// https://shopify.dev/docs/api/liquid/filters/url_escape
function register(engine) {
    // eslint-disable-next-line no-unused-vars
    engine.registerFilter('url_escape', function(input, ...params) {
        return encodeURI(input);
    });
}

export default {
    register
};
