import getId from '../getId';

function addEkoProductMetadata(item) {
    let metadata = getId('localStorage', 'eko.metadata');

    if (metadata && metadata[item.itemId]) {
        let product = metadata[item.itemId].product;
        item.id = product?.id;
        item.sku = product?.sku;
        item.upc = product?.upc;
        item.name = product?.name;
    }

    return item;
}

export default {
    addEkoProductMetadata,
};
