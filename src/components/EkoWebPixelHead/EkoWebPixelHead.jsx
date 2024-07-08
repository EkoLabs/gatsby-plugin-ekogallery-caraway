import React from 'react';
import { usePluginOptionsQuery } from '../../utils.js';
import { Script } from 'gatsby';

const EKO_ANALYTICS_PLATFORM_URL = 'https://storage.eko.com/efu/ekoanalytics/master/latest/EkoAnalyticsPlatform.min.js';

function isProductionEnv(shopDomain) {
    // "window" will not be defined in the SSR phase.
    if (typeof window === 'undefined') {
        return false;
    }

    return process.env.NODE_ENV === 'production' && window.location.hostname === shopDomain;
}

const EkoWebPixelHead = () => {
    let pluginOptions = usePluginOptionsQuery();
    let isProduction = isProductionEnv(pluginOptions.shopDomain);
    let pixelId = isProduction ? pluginOptions.shopDomain : '';


    return (
        <>
            <Script
                src={EKO_ANALYTICS_PLATFORM_URL}
                async
                data-pxid={pixelId}
            />
        </>
    );
};

export default EkoWebPixelHead;
