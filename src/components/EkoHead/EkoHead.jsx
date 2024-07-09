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
                (function(){"use strict";var d,u;const c={};class w{constructor(n){this.key=\`eko.\${n}\`}setDataStorage(n,t){var r,a;try{let o=(r=window.localStorage)==null?void 0:r.getItem(this.key);o=JSON.parse(o)||{},o[n]=t,(a=window.localStorage)==null||a.setItem(this.key,JSON.stringify(o))}catch(o){console.error(\`[setDataStorage]: \${o}\`)}}getDataStorage(n){var t;try{let r=(t=window.localStorage)==null?void 0:t.getItem(this.key);return r=JSON.parse(r)||{},r[n]}catch(r){console.error(\`[getDataStorage]: \${r}\`)}}removeDataStorage(n){var t,r,a;try{let o=(t=window.localStorage)==null?void 0:t.getItem(this.key);o&&(o=JSON.parse(o),delete o[n],Object.keys(o).length>0?(r=window.localStorage)==null||r.setItem(this.key,JSON.stringify(o)):(a=window.localStorage)==null||a.removeItem(this.key))}catch(o){console.error(\`[removeDataStorage]: \${o}\`)}}}function h(e){return c[e]||(c[e]=new w(e)),c[e]}const g="mobile",f="notmobile",p={MOBILE_DEVICE:g,NOT_MOBILE_DEVICE:f};function m(){return(window.navigator.userAgentData?window.navigator.userAgentData.mobile:navigator.maxTouchPoints>0&&/Mobile|Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&!/Tablet|iPad/i.test(navigator.userAgent))?g:f}function S(e){if(e!==p.MOBILE_DEVICE&&e!==p.NOT_MOBILE_DEVICE)return!0;let n=m();return e.toLowerCase()===n.toLowerCase()}const y=window.eko.splitTesting.productId;let i=window.eko.splitTesting.activeExperiment;const l="CONTROL",s=h("experiment");function O(e,n){let t=(e==null?void 0:e.name)||l;s.setDataStorage(y,{...i,variant:t}),n&&s.setDataStorage(i.id,{chosenVariant:t})}function D(){const e=[],n=m();return i.variants.reduce((t,r)=>{const a=typeof r.traffic=="object"?r.traffic[n]||0:r.traffic;return t+=a,e.push({name:r.name,params:r.params,traffic:t}),t},0),e}function I(e,n){const t=new URL(e.href);for(const[r,a]of Object.entries(n.searchParams))t.searchParams.set(r,a);return n.path&&(t.pathname=n.pathname),t.searchParams.append("originalurl",e.href),t}function b(e,n){let t;const r=D(),a=s.getDataStorage(i.id);if(n)t=n!==l&&r.find(o=>n===o.name);else if(e&&(a!=null&&a.chosenVariant))t=a.chosenVariant!==l&&r.find(o=>a.chosenVariant===o.name);else{const o=crypto.getRandomValues(new Uint32Array(1))[0]%100;t=r.find(v=>o<v.traffic)}return t}try{const e=new URL(window.location.href);if(e.searchParams.get("noexp")===null)if(e.searchParams.get("expvar")!==null){const t=e.searchParams.get("originalurl");t&&history.replaceState({},"",t)}else{try{i=JSON.parse(i)}catch{throw new Error(\`failed to parse experiment config: \${i}\`)}if(i.type==="split"&&S(i.targetDevice)){window.eko.activeExperimentSplitTesting=i,e.searchParams.get("expclear")!==null&&s.removeDataStorage(i.id);const t=typeof i.sticky<"u"?i.sticky:!0,r=e.searchParams.get("forceexpvariant"),a=b(t,r);if(O(a,t),a&&(window.eko.splitTesting.variant=a,(d=a==null?void 0:a.params)!=null&&d.redirectUrl)){const o=I(e,(u=a==null?void 0:a.params)==null?void 0:u.redirectUrl);o.searchParams.append("expvar",a.name),window.location.replace(o.href)}}}}catch(e){console.error("eko gallery split test snippet error:",e)}})();
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
