import addToCartContextPacker from './addToCartContextPacker';
import pageViewedContextPacker from './pageViewedContextPacker';
import productContextPacker from './productContextPacker';
import getId from '../../../webPixel/getId';
import { ekoAnalytics } from '../../../../index';

const GATSBY_PLUGIN_CONTEXT_PACKERS_TAG = 'gatsby-plugin';

function registerGalleryRelatedContextPackers() {
    let experiment = getId('localStorage', 'eko.experiment');
    if (experiment) {
        experiment = JSON.parse(experiment);

        // eslint-disable-next-line new-cap
        window.EkoAnalytics('registerContextPacker', {
            tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
            schema: 'iglu:com.helloeko/experiment/jsonschema/1-0-3',
            match: /^pixel\..*/,
            getData(data) {
                if (!data?.items || !data?.items[0].itemId || !experiment[data.items[0].itemId]) {
                    return;
                }

                const currentProductExperiment = experiment[data.items[0].itemId];

                let experimentData = {
                    experimentid: currentProductExperiment.id || '',
                    experimenttype: currentProductExperiment.type || '',
                    experimentvariant: currentProductExperiment.variant ||
                        (currentProductExperiment.variants?.length && currentProductExperiment.variants[0].name) ||
                        'CONTROL',
                };

                let targetDevice = currentProductExperiment.targetDevice?.toLowerCase();

                if (targetDevice === 'mobile' || targetDevice === 'notmobile') {
                    experimentData.experimenttargeting = {
                        device: targetDevice
                    };
                }

                return experimentData;
            }
        });
    }

    let metadata = getId('localStorage', 'eko.metadata');
    if (metadata) {
        metadata = JSON.parse(metadata);

        // eslint-disable-next-line new-cap
        window.EkoAnalytics('registerContextPacker', {
            tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
            schema: 'iglu:com.helloeko/asset/jsonschema/1-0-0',
            match: /^pixel\..*/,
            getData(data) {
                if (!data?.items || !data?.items[0].itemId || !metadata[data.items[0].itemId] ||
                    !metadata[data.items[0].itemId].assets || !metadata[data.items[0].itemId].assets[0]) {
                    return;
                }

                let asset = metadata[data.items[0].itemId].assets[0];

                return {
                    type: asset?.type,
                    deliverableid: asset?.deliverableId,
                    name: asset?.name,
                    artifactid: '',
                };
            }
        });

        // eslint-disable-next-line new-cap
        window.EkoAnalytics('registerContextPacker', {
            tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
            schema: 'iglu:com.helloeko/organization/jsonschema/1-0-0',
            match: /^pixel\..*/,
            getData: function(data) {
                if (!data?.items || !data?.items[0].itemId || !metadata[data.items[0].itemId] ||
                    !metadata[data.items[0].itemId].assets || !metadata[data.items[0].itemId].customer) {
                    return;
                }

                let customer = metadata[data.items[0].itemId].customer;

                return { id: customer?.organizationId };
            }
        });

        // eslint-disable-next-line new-cap
        window.EkoAnalytics('registerContextPacker', {
            tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
            schema: 'iglu:com.helloeko/space/jsonschema/1-0-2',
            match: /^pixel\..*/,
            getData: function(data) {
                if (!data?.items || !data?.items[0].itemId || !metadata[data.items[0].itemId] ||
                    !metadata[data.items[0].itemId].assets || !metadata[data.items[0].itemId].customer) {
                    return;
                }

                let customer = metadata[data.items[0].itemId].customer;

                return { id: customer?.spaceId };
            }
        });

        // eslint-disable-next-line new-cap
        window.EkoAnalytics('registerContextPacker', {
            tag: GATSBY_PLUGIN_CONTEXT_PACKERS_TAG,
            schema: 'iglu:com.helloeko/variant/jsonschema/1-0-1',
            match: /^pixel\..*/,
            getData: function(data) {
                if (!data?.items || !data?.items[0].itemId || !metadata[data.items[0].itemId] ||
                    !metadata[data.items[0].itemId].product || !data?.items[0].variantId) {
                    return;
                }

                return {
                    id: data?.items[0].variantId,
                };
            }
        });
    }

    productContextPacker();
}

function register(ekoGallery) {
    ekoAnalytics.reset(GATSBY_PLUGIN_CONTEXT_PACKERS_TAG);

    // When the eko gallery is present, we need to register the "add to cart" context packer, the "product viewed"
    // context packer will be added by the gallery code.
    // When the eko gallery is not present, we need to register the context packers that the gallery code would have
    // registered, the "product viewed" and "add to cart" context packers will be added by the EA pixel code.
    if (ekoGallery) {
        addToCartContextPacker();
    } else {
        registerGalleryRelatedContextPackers();
    }

    pageViewedContextPacker();

    // If we're in a page with no gallery. Gallery contexts aren't registered so we resume tracking here
    if (!ekoGallery) {
        ekoAnalytics.resume(window.location.pathname);
    }
}

export default {
    register
};
