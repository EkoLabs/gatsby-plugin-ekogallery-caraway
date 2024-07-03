const GATSBY_PLUGIN_CONTEXT_PACKERS_TAG = 'gatsby-plugin';

export default function() {
    // eslint-disable-next-line new-cap
    window.EkoAnalytics('registerContextPacker', {
        tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
        schema: 'iglu:com.helloeko/page/jsonschema/1-0-0',
        match: /^pixel\..*$/,
        getData: function() {
            return {
                url: document.location.href || '',
                referrer: document.referrer || '',
                title: document.title || '',
            };
        }
    });
}
