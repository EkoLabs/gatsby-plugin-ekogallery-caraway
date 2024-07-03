import cartAddTransformer from './cartAddTransformer';
import productViewedTransformer from './productViewedTransformer';

export default {
    'pixel.cart.add': cartAddTransformer,
    'pixel.product_viewed': productViewedTransformer,
};
