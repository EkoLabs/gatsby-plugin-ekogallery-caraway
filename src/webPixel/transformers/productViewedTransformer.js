import utils from './utils.js';

export default function(data) {
    let item = {
        itemId: data.id,
        itemName: data.name,
        itemPrice: data.price,
        quantity: data.quantity || 1,
        variantId: data.variantId,
    };

    item = utils.addEkoProductMetadata(item);

    return {
        items: [item],
    };
}
