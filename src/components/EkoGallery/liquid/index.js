import { Liquid } from 'liquidjs';
import partials from './partials/index.js';
import filters from './filters/index.js';

let engine = new Liquid({
    // Trim result to get a cleaner template (blank lines, etc...).
    // https://liquidjs.com/api/interfaces/LiquidOptions.html
    greedy: true,
    trimTagLeft: true,
    trimTagRight: true,

    ...partials.getLiquidOptions(),
});

filters.register(engine);

export default engine;
