/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function(env) {
    return {
        clientAllowedKeys: ['API_HOST'],
        fastbootAllowedKeys: [],
        failOnMissingKey: true,
        path: path.join(path.dirname(__dirname), `.env.${env}`),
    };
};
