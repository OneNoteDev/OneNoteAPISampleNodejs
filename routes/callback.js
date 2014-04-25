var express = require('express');
var router = express.Router();

var liveConnect = require('../lib/liveconnect-client');

/* GET Live Connect Auth callback. */
router.get('/', function (req, res) {
    // Get the auth code from the callback url query parameters
    var authCode = req.query['code'];

    if (authCode) {
        // Request an access token from the auth code
        liveConnect.requestAccessTokenByAuthCode(authCode,
            function (responseData) {
                var accessToken = responseData['access_token'],
                    refreshToken = responseData['refresh_token'],
                    expiresIn = responseData['expires_in'];
                if (accessToken && refreshToken && expiresIn) {
                    // Save the access token on a session. Using cookies in this case:
                    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000});
                    res.cookie('refresh_token', refreshToken);

                    res.render('callback');
                } else {
                    // Handle an authentication error response
                    res.render('error', {
                        message: 'Invalid Live Connect Response',
                        error: {details: JSON.stringify(responseData, null, 2)}
                    });
                }
            });
    } else {
        // Handle an error passed from the callback query params
        var authError = req.query['error'],
            authErrorDescription = req.query['error_description'];
        res.render('error', {
            message: 'Live Connect Auth Error',
            error: {status: authError, details: authErrorDescription}
        });
    }

});

module.exports = router;
