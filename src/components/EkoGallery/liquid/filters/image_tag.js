import utils from './utils.js';

// https://shopify.dev/docs/api/liquid/filters/image_tag
function register(engine) {
    engine.registerFilter('image_tag', function(input, ...params) {
        let width = utils.getParamValue(params, 'width');
        let height = utils.getParamValue(params, 'height');
        let alt = utils.getParamValue(params, 'alt');
        // let preload = utils.getParamValue(params, 'preload', 'lazy');
        let loading = utils.getParamValue(params, 'loading');
        let fetchpriority = utils.getParamValue(params, 'fetchpriority');
        let sizes = utils.getParamValue(params, 'sizes');
        let widths = utils.getParamValue(params, 'widths');
        let srcset = utils.buildSrcsetAttribute(input, widths);

        // eslint-disable-next-line max-len
        const htmlAttributes = `${utils.getHtmlElementString('width', width)}${utils.getHtmlElementString('height', height)}${utils.getHtmlElementString('alt', alt)}${utils.getHtmlElementString('srcset', srcset)}${utils.getHtmlElementString('loading', loading)}${utils.getHtmlElementString('fetchpriority', fetchpriority)}${utils.getHtmlElementString('sizes', sizes)}`;
        return `<img src="${input}" ${htmlAttributes}/>`;
    });
}

export default {
    register
};
