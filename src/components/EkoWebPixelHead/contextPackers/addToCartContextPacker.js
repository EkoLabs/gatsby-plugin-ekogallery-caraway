/* eslint-disable camelcase */

import utils from './utils.js';

const GATSBY_PLUGIN_CONTEXT_PACKERS_TAG = 'gatsby-plugin';

export default function() {
    // eslint-disable-next-line new-cap
    window.EkoAnalytics('registerContextPacker', {
        tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
        schema: 'iglu:com.helloeko/cart/jsonschema/1-0-1',
        match: 'pixel.cart.add',

        // NOTE: Implementation taken from EA pixel code.
        getData(data) {
            data = data || {};
            const packedData = {};

            // Id
            if (data.cartId) {
                packedData.cart_id = data.cartId;
            }

            // Items
            if (Array.isArray(data.items)) {
                packedData.items = data.items.map(dataItem => {
                    return utils.itemPack(dataItem);
                });
            }

            // Total price
            if (utils.isObject(data.totalPrice)) {
                const totalPrice = data.totalPrice;
                packedData.total_price = utils.pricePack(totalPrice);
            }


            // Total quantity
            if (data.totalQuantity) {
                packedData.total_quantity = Number(data.totalQuantity);
            }

            return packedData;
        }
    });
}
