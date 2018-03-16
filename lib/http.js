"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var exceptions_1 = require("./exceptions");
var fileTypeStream = require("file-type-stream").default;
var pkg = require("../package.json");
function wrapError(err) {
    if (err.response) {
        throw new exceptions_1.HTTPError(err.message, err.response.status, err.response.statusText, err);
    }
    else if (err.code) {
        throw new exceptions_1.RequestError(err.message, err.code, err);
    }
    else if (err.config) {
        // unknown, but from axios
        throw new exceptions_1.ReadError(err);
    }
    // otherwise, just rethrow
    throw err;
}
var userAgent = pkg.name + "/" + pkg.version;
function stream(url, headers, data) {
    headers["User-Agent"] = userAgent;
    return axios_1.default
        .post(url, data, { headers: headers, responseType: "stream" })
        .then(function (res) { return res.data; });
}
exports.stream = stream;
function get(url, headers) {
    headers["User-Agent"] = userAgent;
    return axios_1.default
        .get(url, { headers: headers })
        .then(function (res) { return res.data; })
        .catch(wrapError);
}
exports.get = get;
function post(url, headers, data) {
    headers["Content-Type"] = "application/json";
    headers["User-Agent"] = userAgent;
    return axios_1.default
        .post(url, data, { headers: headers })
        .then(function (res) { return res.data; })
        .catch(wrapError);
}
exports.post = post;
function del(url, headers) {
    headers["User-Agent"] = userAgent;
    return axios_1.default
        .delete(url, { headers: headers })
        .then(function (res) { return res.data; })
        .catch(wrapError);
}
exports.del = del;
