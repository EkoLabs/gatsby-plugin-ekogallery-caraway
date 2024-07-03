/* eslint-disable camelcase */

import item from './item';

const GATSBY_PLUGIN_CONTEXT_PACKERS_TAG = 'gatsby-plugin';

function packProductItem(data) {
    const packedData = item.pack(data);

    // Products have database product properties which we add here on top of the items for checkout and cart
    if (data.id) {
        packedData.id = data.id;
    }

    if (data.sku) {
        packedData.sku = data.sku;
    }

    if (data.upc) {
        packedData.upc = data.upc;
    }

    if (data.name) {
        packedData.name = data.name;
    }

    return packedData;
}

export default function() {
    // eslint-disable-next-line new-cap
    window.EkoAnalytics('registerContextPacker', {
        tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
        match: /^pixel\..*/,
        schema: 'iglu:com.helloeko/products/jsonschema/1-0-1',
        getData(data) {
            if (!data?.items) {
                return;
            }

            return {
                items: data.items.map(dataItem => packProductItem(dataItem)),
            };
        }
    });
}
