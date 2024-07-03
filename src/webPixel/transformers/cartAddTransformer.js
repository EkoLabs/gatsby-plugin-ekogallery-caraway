export default function(data) {
    return {
        cartId: data.cartId,
        items: [
            {
                itemId: data.id,
                itemName: data.name,
                itemPrice: data.price,
                quantity: data.quantity || 1,
                variantId: data.variantId,
            }
        ],
        totalPrice: data.totalPrice,
        totalQuantity: data.totalQuantity,
    };
}
