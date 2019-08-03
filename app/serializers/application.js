import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.JSONAPISerializer.extend({
    keyForAttribute(attr) {
        return underscore(attr);
    },

    normalizeQueryResponse(store, primaryModelClass, payload) {
        const result = this._super(...arguments);

        // HACK: add next/prev to every record, then used for pagination
        if (payload.links) {
            const pagination = this._extractPaginationFromLinks(payload.links);
            payload.data = payload.data.map(record => {
                record.attributes.pagination = pagination;
                return record;
            });
        }

        return result;
    },

    _extractPaginationFromLinks(links) {
        let pagination = {};

        if (links.next) {
            pagination.next = this._extractCursorFromLink(links.next);
        }

        if (links.prev) {
            pagination.prev = this._extractCursorFromLink(links.prev);
        }

        return pagination;
    },

    _extractCursorFromLink(link) {
        const matches = link.match(/[before|after]=([^&]+)/);

        if (matches) {
            return decodeURIComponent(matches[1]);
        }

        return null;
    },
});
