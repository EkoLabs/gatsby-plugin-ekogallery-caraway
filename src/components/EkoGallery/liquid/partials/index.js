/* eslint-disable max-len */
import ekoCarouselInteractiveItemPartial from 'raw-loader!../../../../../liquid-auto-generated/ssr-snippets/eko-carousel-interactive-item.liquid';
import ekoCarouselItemPartial from 'raw-loader!../../../../../liquid-auto-generated/ssr-snippets/eko-carousel-item.liquid';
import ekoGlobalVariablesJsonPartial from 'raw-loader!../../../../../liquid-auto-generated/ssr-snippets/eko-global-variables-json.liquid';
import ekoNavItemPartial from 'raw-loader!../../../../../liquid-auto-generated/ssr-snippets/eko-nav-item.liquid';
/* eslint-enable max-len */

const partialsMap = {
    'eko-carousel-interactive-item': ekoCarouselInteractiveItemPartial,
    'eko-carousel-item': ekoCarouselItemPartial,
    'eko-global-variables-json': ekoGlobalVariablesJsonPartial,
    'eko-nav-item': ekoNavItemPartial,
};

function getLiquidOptions() {
    return {
        // NOTE: To avoid `fs.dirname` and `fs.sep` are required for relativeReference warning.
        relativeReference: false,

        // In order to use partials on the browser side, we need to provide an abstract file system to the liquid engine.
        // Based on https://liquidjs.com/tutorials/render-file.html#Abstract-File-System & https://liquidjs.com/api/interfaces/FS.html
        fs: {
            readFileSync(file) {
                return partialsMap[file];
            },
            // eslint-disable-next-line require-await
            async readFile(file) {
                return partialsMap[file];
            },

            existsSync(filepath) {
                return !!partialsMap[filepath];
            },
            // eslint-disable-next-line require-await
            async exists(filepath) {
                return !!partialsMap[filepath];
            },

            // eslint-disable-next-line no-unused-vars
            contains(root, file) {
                return !!partialsMap[file];
            },

            // eslint-disable-next-line no-unused-vars
            resolve(root, file, ext) {
                return file;
            }
        }
    };
}

export default {
    getLiquidOptions
};
