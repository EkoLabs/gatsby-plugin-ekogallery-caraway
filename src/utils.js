import { useStaticQuery, graphql } from 'gatsby';
import pkgJson from '../package.json';

const pluginName = pkgJson.name;
const REQUIRED_PLUGIN_OPTIONS = ['shopDomain'];

function usePluginOptionsQuery() {
    let query = graphql`
        query PluginOptionsQuery {
            sitePlugin(name: { eq: "gatsby-plugin-ekogallery" }) {
                pluginOptions
            }
        }
    `;

    let pluginOptions = useStaticQuery(query).sitePlugin?.pluginOptions;

    // Validate plugin options provided.
    if (!pluginOptions) {
        throw new Error(`${pluginName}: plugin options not found`);
    }

    // Validate required plugin options exists.
    REQUIRED_PLUGIN_OPTIONS.forEach(option => {
        if (typeof pluginOptions[option] === 'undefined') {
            throw new Error(`${pluginName}: plugin option "${option}" not found`);
        }
    });

    return pluginOptions;
}

function getGalleryJsUrl(galleryEnv, galleryName) {
    // NOTE: Local development URLs
    // return `http://localhost:5173/src/clients/${galleryName}.js`;
    // return `http://localhost:8080/eko-${galleryName}.js`;

    return `https://${galleryEnv || ''}play.eko.com/components/eko-gallery/eko-${galleryName}.js`;
}

function shouldRenderEkoGallery(ekoProductConfig) {
    // If no product config (metadata) doesn't exist for this product, don't render the gallery.
    if (!ekoProductConfig) {
        return false;
    }

    // If the split testing variant is set to not render the gallery, don't render it.
    if (typeof window !== 'undefined') {
        return window.eko?.splitTesting?.variant?.params?.renderEko !== false;
    }

    return true;
}

export {
    usePluginOptionsQuery,
    getGalleryJsUrl,
    shouldRenderEkoGallery,
};
