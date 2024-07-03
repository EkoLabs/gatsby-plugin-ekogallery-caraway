import externalVideoUrlFilter from './external_video_url.js';
import imageTagFilter from './image_tag.js';
import imageUrlFilter from './image_url.js';
import urlEscapeFilter from './url_escape.js';

function register(engine) {
    externalVideoUrlFilter.register(engine);
    imageTagFilter.register(engine);
    imageUrlFilter.register(engine);
    urlEscapeFilter.register(engine);
}

export default {
    register
};
