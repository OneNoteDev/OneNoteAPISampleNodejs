var request = require('request');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var CreateExamples = function () {
    var oneNotePagesApiUrl = 'https://www.onenote.com/api/v1.0/pages';

    /* Pages API request builder & sender */
    function createPage(accessToken, payload, callback, multipart) {
        var options = {
            url: oneNotePagesApiUrl,
            headers: {'Authorization': 'Bearer ' + accessToken}
        };
        // Build simple request
        if (!multipart) {
            options.headers['Content-Type'] = 'text/html';
            options.body = payload;
        }
        var r = request.post(options, callback);
        // Build multi-part request
        if (multipart) {
            var CRLF = '\r\n';
            var form = r.form(); // FormData instance
            _.each(payload, function (partData, partId) {
                form.append(partId, partData.body, {
                    // Use custom multi-part header
                    header: CRLF +
                        '--' + form.getBoundary() + CRLF +
                        'Content-Disposition: form-data; name=\"' + partId + '\"' + CRLF +
                        'Content-Type: ' + partData.contentType + CRLF + CRLF
                });
            });
        }
    }

    function dateTimeNowISO() {
        return new Date().toISOString();
    }

    /**
     * @callback createPageCallback
     * @param {object} Error
     * @param {object} HTTP Response
     * @param {string} Response body
     */

    /**
     * Create OneNote Page with Text
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
    this.createPageWithSimpleText = function (accessToken, callback) {
        var htmlPayload =
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <title>A page created from basic HTML-formatted text (Node.js Sample)</title>" +
            "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
            "</head>" +
            "<body>" +
            "    <p>This is a page that just contains some simple <i>formatted</i>" +
            "    <b>text</b></p>" +
            "</body>" +
            "</html>";
        
        createPage(accessToken, htmlPayload, callback, false);
    };

    /**
     * Create OneNote Page with Text and Images
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
    this.createPageWithTextAndImage = function (accessToken, callback) {
        var htmlPayload =
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <title>A page created containing an image (Node.js Sample)</title>" +
            "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
            "</head>" +
            "<body>" +
            "    <p>This is a page that just contains some simple <i>formatted</i>" +
            "    <b>text</b> and an image</p>" +
            "    <img src=\"name:ImageData\" width=\"426\" height=\"68\" >" +
            "</body>" +
            "</html>";
        
        createPage(accessToken, {
            'Presentation': {
                body: htmlPayload,
                contentType: 'text/html'
            },
            'ImageData': {
                body: fs.readFileSync(path.normalize(__dirname + '/../image.jpg')),
                contentType: 'image/jpeg'
            }
        }, callback, true);
    };

    /**
     * Create OneNote Page with a Screenshot of HTML
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
    this.createPageWithScreenshotFromHtml = function (accessToken, callback) {
        var htmlPayload =
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <title>A page created with a screenshot of HTML on it (Node.js Sample)</title>" +
            "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\"/>" +
            "</head>" +
            "<body>" +
            "    <img data-render-src=\"name:HtmlForScreenshot\" />" +
            "</body>" +
            "</html>",

            htmlForScreenshot =
            "<html>" +
            "<head>" +
            "   <title>Embedded HTML</title>" +
            "</head>" +
            "<body>" +
            "    <h1>This is a screen grab of a web page</h1>" +
            "    <p>" +
            "    Lorem ipsum dolor sit amet, consectetur adipiscing elit." +
            "    Nullam vehicula magna quis mauris accumsan, nec imperdiet nisi tempus. " +
            "    Suspendisse potenti. Duis vel nulla sit amet turpis venenatis elementum. " +
            "    Cras laoreet quis nisi et sagittis. Donec euismod at tortor ut porta. " +
            "    Duis libero urna, viverra idaliquam in, ornare sed orci. " +
            "    Pellentesque condimentum gravida felis, sed pulvinar erat suscipit sit amet. Nulla id felis quis " +
            "    sem blandit dapibus. " +
            "    Utviverra auctor nisi ac egestas. " +
            "    Quisque ac neque nec velit fringilla sagittis porttitor sit amet quam." +
            "    </p>" +
            "</body>" +
            "</html>";

        createPage(accessToken, {
            'Presentation': {
                body: htmlPayload,
                contentType: 'text/html'
            },
            'HtmlForScreenshot': {
                body: htmlForScreenshot,
                contentType: 'text/html'
            }
        }, callback, true);
    };

    /**
     * Create OneNote Page with a Screenshot of a URL
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
    this.createPageWithScreenshotFromUrl = function (accessToken, callback) {
        var htmlPayload =
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <title>A page created with a URL snapshot on it (Node.js Sample)</title>" +
            "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\"/>" +
            "</head>" +
            "<body>" +
            "    <img data-render-src=\"http://www.onenote.com\" alt=\"An important web page\" />" +
            "    Source URL: <a href=\"http://www.onenote.com\">http://www.onenote.com</a>" +
            "</body>" +
            "</html>";

        createPage(accessToken, htmlPayload, callback, false);
    };

    /**
     * Create OneNote Page with an Embedded File
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
    this.createPageWithFile = function (accessToken, callback) {
        var htmlPayload =
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <title>A page with a file on it (Node.js Sample)</title>" +
            "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\"/>" +
            "</head>" +
            "<body>" +
            "    <object data-attachment=\"PDF File.pdf\" data=\"name:EmbeddedFile\" type=\"application/pdf\"></object>" +
            "    <img data-render-src=\"name:EmbeddedFile\" />" +
            "</body>" +
            "</html>";

        createPage(accessToken, {
            'Presentation': {
                body: htmlPayload,
                contentType: 'text/html'
            },
            'EmbeddedFile': {
                body: fs.readFileSync(path.normalize(__dirname + '/../file.pdf')),
                contentType: 'application/pdf'
            }
        }, callback, true);
    }

};
module.exports = new CreateExamples();