# Gatsby EkoGallery Plugin

This is a gatsby plugin to integrate the [eko](https://eko.com) gallery into your gatsby site.

## Installation

### Install the plugin as a dependency

```bash
npm install gatsby-plugin-ekogallery --save
```

OR

```bash
yarn add gatsby-plugin-ekogallery
```

## Configuration

### Add the plugin configuration to your `gatsby-config.js`

```js
module.exports = {
    plugins: [
        {
            resolve: 'gatsby-plugin-ekogallery',
            options: {
                shopDomain: 'https://www.yourdomain.com',
            },
        },
    ],
}
```

## Usage

### EkoHead

This `EkoHead` component is used to inject the necessary scripts, configuration and styles for the eko gallery into the head of your site.

In your page component:

```jsx
import { EkoHead } from 'gatsby-plugin-ekogallery';

export const Head = () => {
    return (
        <EkoHead product={product} ekoProductConfig={ekoProductConfig} preloadImages={preloadImages} />
    );
};
```

This component accepts the following props:

| Prop | Type | Description |
| -----| ---- | ----------- |
| product | Object | Product data object, which includes id, variants and media attributes. Should be structured according eko's product schema. Advise with the eko team for the required structure. |
| ekoProductConfig | Object | The eko gallery configuration. This object will be published via the eko platform and exposed via an api endpoint or in a Shopify product's metafield. |
| preloadImages | Array | _Optional._ An array of strings, which represent the sources of the images requiring preloading, these images should be the images shown in the navigation of the gallery. |

> The `EkoHead` integration is via gatsby's [Head API](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/) which was added in gatsby version 4.19.0.

### EkoGallery

The `EkoGallery` component is used to render the eko gallery on your site. It should replace your existing gallery component.

```jsx
import { EkoGallery } from 'gatsby-plugin-ekogallery';

export default ProductPage = ({ pageContext: { product, ekoProductConfig, variantId } }) => {
    return (
        <EkoGallery product={product} config={ekoProductConfig} variantId={variantId} />
    );
};
```

This component accepts the following props:

| Prop | Type | Description |
| -----| ---- | ----------- |
| product | Object | Product data object, which includes id, variants and media attributes. Should be structured according eko's product schema. Advise with the eko team for the required structure. |
| config | Object | The eko gallery configuration. This object will be published via the eko platform and exposed via an api endpoint or in a Shopify product's metafield. |
| variantId | String | _Optional._ The selected variant (if applicable). It is used to switch to the relevant variant gallery assets when the product variant changes. |
| onEkoGalleryRendered | Function | _Optional._ Callback function that will be called once the eko gallery has ben rendered. |

```jsx
export default ProductPage = ({ pageContext: { product, ekoProductConfig, variantId } }) => {
    let GalleryComp = <RegularGallery product={product} variantId={variantId} />;

    // For products with eko gallery, use the eko gallery component.
    if (ekoProductConfig) {
        GalleryComp = <EkoGallery product={product} config={ekoProductConfig} variantId={variantId} />;
    }

    return (
        <GalleryComp />
    );
};
```

### ekoWebPixel

The `ekoWebPixel` API is used to track events on your site, for example:

```jsx
import { ekoWebPixel } from 'gatsby-plugin-ekogallery';

ekoWebPixel.track('cart.add', {
    id,
    name,
    price,
    quantity,
});
ekoWebPixel.track('page_viewed', { ... });
ekoWebPixel.track('product_viewed', { ... });
// etc...
```