import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePluginOptionsQuery } from '../../utils.js';
import contextPackers from './contextPackers/index.js';
import { Script } from 'gatsby';

const EKO_ANALYTICS_PLATFORM_URL = 'https://storage.eko.com/efu/ekoanalytics/master/latest/EkoAnalyticsPlatform.min.js';

function isProductionEnv(shopDomain) {
    // "window" will not be defined in the SSR phase, check only NODE_ENV and filter events according production/not production url.
    if (typeof window === 'undefined') {
        return process.env.NODE_ENV === 'production';
    }

    return process.env.NODE_ENV === 'production' && window.location.hostname === shopDomain;
}

function getEkoAnalyticsSnippet(galleryEnv) {
    /* eslint-disable max-len */
    return `if (!window.EkoAnalytics) {
        !function () {
            var t, a, e, s, n;
            'undefined' == typeof window || window.EkoAnalytics || (t = window, a = 'EkoAnalytics', e = document, s = 'script', t[a] || (t[a] = function () {
                t[a].f ? (t[a].q.push(arguments), t[a].ts.push(Date.now())) : t[a].apply(t, arguments);
            }, t[a].f = !0, t[a].q = t[a].q || [], t[a].ts = t[a].ts || [], t[a].t = Number(new Date), t[a].sa = [], t[a].cb = [], t[a].init = function (ids) {
                t[a].id = ids;
            }, t[a].childRequestIdsCallback = function (e) {
                e.data && 'ea-ids-request' === e.data.type && t[a].sa.push(e.source);
            }, t.addEventListener('message', t[a].childRequestIdsCallback)));
        }();
        
        window.EkoAnalytics.cb.push(() => {
            let setCookie = (key, value, additionalProperties = '') => {
                let hostname = window.location.hostname;
                let domain = hostname;
            
                let parts = hostname.split('.');
                if (parts.length > 2) {
                    domain = parts.slice(-2).join('.');
                }
            
                window.document.cookie = \`\${key}=\${value}; domain=.\${domain}; path=/; secure; samesite=strict; \${additionalProperties}\`;
            };

            setCookie('easid', encodeURIComponent(window.EkoAnalytics('getSid')));
            setCookie('eauid', encodeURIComponent(window.EkoAnalytics('getUid')), 'max-age=2147483647');
        });

        window.EkoAnalytics('configure', {
            snowplow: {
                options: {
                    appId: 'ekoStore',
                },
            },
            ekoEnv: '${galleryEnv}',
            env: 'website',
        });
        window.EkoAnalytics('track', 'PageView');
    }`;
    /* eslint-enable max-len */
}

const EkoWebPixelHead = (props) => {
    let pluginOptions = usePluginOptionsQuery();
    let isProduction = isProductionEnv(pluginOptions.shopDomain);
    let pixelId = isProduction ? pluginOptions.shopDomain : '';
    let galleryEnv = isProduction ? 'production' : 'development';

    useEffect(() => {
        if (window?.EkoAnalytics) {
            contextPackers.register(props.ekoGallery);
        }
    }, [props.product.id, props.ekoGallery]);

    return (
        <>
            <Script
                src={EKO_ANALYTICS_PLATFORM_URL}
                async
                pxid={pixelId}
            />
            <script>{getEkoAnalyticsSnippet(galleryEnv)}</script>
        </>
    );
};

EkoWebPixelHead.propTypes = {
    ekoGallery: PropTypes.bool.isRequired,
    product: PropTypes.object.isRequired,
};

export default EkoWebPixelHead;
