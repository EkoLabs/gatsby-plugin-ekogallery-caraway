import utils from './utils';

// https://shopify.dev/docs/api/liquid/filters/external_video_url
function register(engine) {
    engine.registerFilter('external_video_url', function(input, ...params) {
        let queryParams = Object.keys(params).length ? '?' : '';
        for (const param of params) {
            queryParams += `${param[0]}=${utils.getParamValue(params, param[0])}`;
        }

        const src = `https://www.${input.host}.com/embed/${input.external_id}${queryParams}`;
        return src;
    });
}

export default {
    register
};
