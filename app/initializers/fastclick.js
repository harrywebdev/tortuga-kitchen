/* global FastClick */
import { schedule } from '@ember/runloop';

export function initialize() {
    if (typeof FastBoot === 'undefined') {
        schedule('afterRender', function() {
            if (typeof FastClick !== 'undefined') {
                FastClick.attach(document.body);
            }
        });
    }
}

export default {
    initialize,
};
