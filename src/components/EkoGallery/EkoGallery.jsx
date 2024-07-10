import { Script, ScriptStrategy } from 'gatsby';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ekoGalleryLiquid from 'raw-loader!../../../liquid-auto-generated/eko-gallery.liquid';
import liquid from './liquid/index.js';
import { getGalleryJsUrl } from '../../utils.js';
import './eko-caraway.css';
import { ekoAnalytics } from '../../../index';

let template = liquid.parse(ekoGalleryLiquid);

function getProductWithMetafield(product, config, variantId) {
    let productWithMetafield = structuredClone(product);

    // eslint-disable-next-line camelcase
    productWithMetafield.selected_or_first_available_variant = {
        id: variantId || product.variants[0]?.id,
    };

    productWithMetafield.metafields = {
        custom: {
            // eslint-disable-next-line camelcase
            eko_gallery: {
                value: structuredClone(config),
            }
        },
    };

    return productWithMetafield;
}

function getRenderedLiquid(product) {
    // Render the liquid with the product data as scope (wrapped in a "product" object to match shopify's scope).
    let scope = { product: product };
    return liquid.renderSync(template, scope);
}

function trackCoverDisplayed() {
    const coverElement = document.querySelector('.eko-carousel > li > img');
    if (coverElement?.complete) {
        ekoAnalytics.track('gallery.cover.displayed');
    } else {
        coverElement?.addEventListener('load', function() {
            ekoAnalytics.track('gallery.cover.displayed');
        });
    }
}

function shouldWaitForVariantMatch(variantId, product) {
    return variantId && product.variants?.length > 0 && product.variants.every((variant) => variant.id !== variantId);
}

const EkoGallery = (props) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [galleryHtml, setGalleryHtml] = useState(null);
    const renderGalleryOnVariantMatchRef = useRef(false);

    function renderGallery() {
        let newProductWithMetafield = getProductWithMetafield(props.product, props.config, props.variantId);
        let newGalleryHtml = getRenderedLiquid(newProductWithMetafield);
        setGalleryHtml(newGalleryHtml);
        props.onEkoGalleryRendered();
    }

    useEffect(() => {
        window.eko = window.eko || {};
        window.eko.ekoGalleryRendered = true;

        return () => {
            window.eko.ekoGalleryRendered = false;
        };
    }, []);

    useEffect(() => {
        if (galleryHtml) {
            // Setup cover display tracking once the gallery html is rendered.
            trackCoverDisplayed();
        }
    }, [galleryHtml]);

    useEffect(() => {
        if (scriptLoaded && galleryHtml) {
            ekoAnalytics.reset('gallery');
            window.eko?.gallery?.init();
            ekoAnalytics.resume(window.location.pathname);
            window.eko?.gallery?.setVariant(props.variantId);
        }
    }, [scriptLoaded, galleryHtml]);

    useEffect(() => {
        // Hacky fix - in Caraway, the "variantId" prop changes after the product has been changed.
        // If we try to render the gallery on product change we might get a brief cover of a wrong (previous) variant.
        // See https://interlude.atlassian.net/browse/PLATFORM-4025
        // NOTE: This assumes the "variantId" prop change will happens later...
        if (shouldWaitForVariantMatch(props.variantId, props.product)) {
            renderGalleryOnVariantMatchRef.current = true;
        } else {
            renderGallery();
        }
    }, [props.product.id, props.config.product.id]);

    useEffect(() => {
        if (renderGalleryOnVariantMatchRef.current && !shouldWaitForVariantMatch(props.variantId, props.product)) {
            renderGalleryOnVariantMatchRef.current = false;
            renderGallery();
        }

        window.eko?.gallery?.setVariant(props.variantId);
    }, [props.variantId]);

    return (
        <>
            {/*
                NOTE: The gallery html should not contain any <script> tags since "dangerouslySetInnerHTML"
                NOTE: does not evaluate them
            */}
            <div dangerouslySetInnerHTML={{ __html: galleryHtml }}></div>

            <Script
                id="eko-gallery-script"
                src={getGalleryJsUrl(props.config.options.galleryEnv, props.config.options.galleryName)}
                type="module" // TODO: update if changing gallery code to be to non module
                strategy={ScriptStrategy.postHydrate}
                onLoad={() => setScriptLoaded(true)}
            />
        </>
    );
};

EkoGallery.propTypes = {
    product: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    variantId: PropTypes.string,
    onEkoGalleryRendered: PropTypes.func,
};

EkoGallery.defaultProps = {
    onEkoGalleryRendered: () => {},
};

export default EkoGallery;
