import React from 'react';
import PropTypes from 'prop-types';
import { getGalleryJsUrl } from '../../utils.js';

const EkoGalleryHead = (props) => {
    const preloadImages = props.preloadImages ?
        props.preloadImages.map(
            (image) => (<link key={`eko-gallery-image-${image}`} rel="preload" href={image} as="image" />)
        ) :
        null;

    return (
        <>
            <link
                id="eko-gallery-script-preload"
                rel="modulepreload" // TODO: update to "preload" if changing gallery code to be to non module
                as="script"
                href={getGalleryJsUrl(props.config.options.galleryEnv, props.config.options.galleryName)}
            />

            {preloadImages}
        </>
    );
};

EkoGalleryHead.propTypes = {
    config: PropTypes.object.isRequired,
    preloadImages: PropTypes.array,
};

export default EkoGalleryHead;
