function isObject(obj) {
    return typeof obj === 'object' &&
        !Array.isArray(obj) &&
        obj !== null;
}

function packPrice(data) {
    const packedData = {};
    if (isObject(data)) {
        if (data.amount) {
            packedData.amount = Number(data.amount);
        }

        if (data.currency) {
            packedData.currency = data.currency;
        }
    }

    return packedData;
}

function pack(data) {
    const packedData = {};

    if (!isObject(data)) {
        return packedData;
    }

    if (data.itemId) {
        // eslint-disable-next-line camelcase
        packedData.item_id = data.itemId;
    }

    if (data.itemName) {
        // eslint-disable-next-line camelcase
        packedData.item_name = data.itemName;
    }

    if (isObject(data.itemPrice)) {
        const itemPrice = data.itemPrice;
        // eslint-disable-next-line camelcase
        packedData.item_price = packPrice(itemPrice);
    }

    if (data.quantity) {
        packedData.quantity = Number(data.quantity);
    }

    return packedData;
}

export default {
    pack
};
