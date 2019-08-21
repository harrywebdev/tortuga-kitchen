import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from 'tortuga-kitchen/config/environment';

export default OAuth2PasswordGrantAuthenticator.extend({
    serverTokenEndpoint: config.api.host + '/oauth/token',
    sendClientIdAsQueryParam: true,
    clientId: config.api.client_id,

    makeRequest(url, data, headers = {}) {
        if (!data['client_secret']) {
            data['client_secret'] = config.api.client_secret;
        }

        return this._super(url, data, headers);
    },
});
