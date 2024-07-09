import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import EkoWebPixelHead from '../EkoWebPixelHead/EkoWebPixelHead.jsx';
import EkoGalleryHead from '../EkoGalleryHead/EkoGalleryHead.jsx';
import ekoAnalytics from '../../ekoAnalytics';
import { shouldRenderEkoGallery } from '../../utils.js';

function getSplitTestingScript(product, config) {
    /* eslint-disable max-len */
    return `
        // NOTE: Wrap in a self-invoking function to avoid polluting the global scope.
        (function() {
            // NOTE: Although we are JSON stringifying the values here, they will be parsed back to objects in the inline script.
            let product = ${JSON.stringify(product)};
            let config = ${JSON.stringify(config)};

            // ----------------------------------------------------------------------------
            // Converted (manually) from "eko-split-test.liquid":
            // ----------------------------------------------------------------------------
            let activeExperiment = false;
            const today_date = Math.floor(Date.now() / 1000);

            if (config.experiments) {
                for (const experiment of config.experiments) {
                    const start_date = Math.floor(new Date(experiment.startDate).getTime() / 1000);
                    const end_date = Math.floor(new Date(experiment.endDate).getTime() / 1000);

                    if (experiment.type === 'split' && experiment.active === true && today_date > start_date && today_date < end_date) {
                        activeExperiment = experiment;
                    }
                }
            }

            if (activeExperiment) {
                window.eko = window.eko || {};
                window.eko.splitTesting = {
                    productId: product.id,
                    activeExperiment: JSON.stringify(activeExperiment),
                };

                // ----------------------------------------------------------------------------
                // The split testing code - taken from the "splitTesting.js" snippet build:
                // ----------------------------------------------------------------------------
                (function(){"use strict";var d;const c={};class w{constructor(n){this.key=\`eko.\${n}\`}setDataStorage(n,t){var a,r;try{let o=(a=window.localStorage)==null?void 0:a.getItem(this.key);o=JSON.parse(o)||{},o[n]=t,(r=window.localStorage)==null||r.setItem(this.key,JSON.stringify(o))}catch(o){console.error(\`[setDataStorage]: \${o}\`)}}getDataStorage(n){var t;try{let a=(t=window.localStorage)==null?void 0:t.getItem(this.key);return a=JSON.parse(a)||{},a[n]}catch(a){console.error(\`[getDataStorage]: \${a}\`)}}removeDataStorage(n){var t,a,r;try{let o=(t=window.localStorage)==null?void 0:t.getItem(this.key);o&&(o=JSON.parse(o),delete o[n],Object.keys(o).length>0?(a=window.localStorage)==null||a.setItem(this.key,JSON.stringify(o)):(r=window.localStorage)==null||r.removeItem(this.key))}catch(o){console.error(\`[removeDataStorage]: \${o}\`)}}}function h(e){return c[e]||(c[e]=new w(e)),c[e]}const f="mobile",p="notmobile",m={MOBILE_DEVICE:f,NOT_MOBILE_DEVICE:p};function u(){return(window.navigator.userAgentData?window.navigator.userAgentData.mobile:navigator.maxTouchPoints>0&&/Mobile|Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&!/Tablet|iPad/i.test(navigator.userAgent))?f:p}function S(e){if(e!==m.MOBILE_DEVICE&&e!==m.NOT_MOBILE_DEVICE)return!0;let n=u();return e.toLowerCase()===n.toLowerCase()}const l=window.eko.splitTesting.productId;let i=window.eko.splitTesting.activeExperiment;const g="CONTROL",s=h("experiment");function y(e,n){let t=(e==null?void 0:e.name)||g;s.setDataStorage(l,{...i,variant:t}),n&&s.setDataStorage(i.id,{chosenVariant:t})}function D(){const e=s.getDataStorage(l);(e==null?void 0:e.type)==="split"&&s.removeDataStorage(l)}function O(){const e=[],n=u();return i.variants.reduce((t,a)=>{const r=typeof a.traffic=="object"?a.traffic[n]||0:a.traffic;return t+=r,e.push({name:a.name,params:a.params,traffic:t}),t},0),e}function v(e,n){const t=new URL(e.href);for(const[a,r]of Object.entries(n.searchParams))t.searchParams.set(a,r);return n.pathname&&(t.pathname=n.pathname),t.searchParams.append("ekooriginalurl",e.href),t}function I(e,n){let t;const a=O(),r=s.getDataStorage(i.id);if(n)t=n!==g&&a.find(o=>n===o.name);else if(e&&(r!=null&&r.chosenVariant))t=r.chosenVariant!==g&&a.find(o=>r.chosenVariant===o.name);else{const o=crypto.getRandomValues(new Uint32Array(1))[0]%100;t=a.find(b=>o<b.traffic)}return t}try{const e=new URL(window.location.href);if(e.searchParams.get("expvar")!==null){const t=e.searchParams.get("ekooriginalurl");t&&history.replaceState({},"",t)}else if(D(),e.searchParams.get("noexp")===null){try{i=JSON.parse(i)}catch{throw new Error(\`failed to parse experiment config: \${i}\`)}if(i&&i.active&&i.type==="split"&&S(i.targetDevice)){window.eko.activeExperimentSplitTesting=i,e.searchParams.get("expclear")!==null&&s.removeDataStorage(i.id);const t=typeof i.sticky<"u"?i.sticky:!0,a=e.searchParams.get("forceexpvariant"),r=I(t,a);if(y(r,t),r&&(window.eko.splitTesting.variant=r,(d=r==null?void 0:r.params)!=null&&d.redirectUrl)){const o=v(e,r.params.redirectUrl);o.searchParams.append("expvar",r.name),window.location.replace(o.href)}}}}catch(e){console.error("eko gallery split test snippet error:",e)}})();
            }
        })();
    `;
    /* eslint-enable max-len */
}

const EkoHead = (props) => {
    let config = props.ekoProductConfig;
    let isEkoGallery = shouldRenderEkoGallery(config);

    useEffect(() => {
        return () => {
            ekoAnalytics.reset('gallery');
        };
    }, [props.product.id]);

    return (
        <>
            {config && <script>{getSplitTestingScript(props.product, config)}</script>}

            <EkoWebPixelHead ekoGallery={isEkoGallery} product={props.product} />
            {config && isEkoGallery && <EkoGalleryHead preloadImages={props.preloadImages} config={config} />}
        </>
    );
};

EkoHead.propTypes = {
    product: PropTypes.object.isRequired,
    ekoProductConfig: PropTypes.object,
    preloadImages: PropTypes.array,
};

export default EkoHead;
