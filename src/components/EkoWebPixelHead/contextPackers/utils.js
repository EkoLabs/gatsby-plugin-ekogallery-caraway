/* eslint-disable camelcase */

function isObject(obj) {
    return typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null;
}

function pricePack(data) {
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

function itemPack(data) {
    const packedData = {};

    if (!isObject(data)) {
        return packedData;
    }

    if (data.itemId) {
        packedData.item_id = data.itemId;
    }

    if (data.itemName) {
        packedData.item_name = data.itemName;
    }

    if (isObject(data.itemPrice)) {
        const itemPrice = data.itemPrice;
        packedData.item_price = pricePack(itemPrice);
    }

    if (data.quantity) {
        packedData.quantity = Number(data.quantity);
    }

    return packedData;
}

export default {
    isObject,
    pricePack,
    itemPack,
};
