"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_https_proxy_fix_1 = require("axios-https-proxy-fix");
const exceptions_1 = require("./exceptions");
const fileTypeStream = require("file-type-stream").default;
const pkg = require("../package.json");
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
const userAgent = `${pkg.name}/${pkg.version}`;
function stream(url, headers, data, proxy) {
    headers["User-Agent"] = userAgent;
    return axios_https_proxy_fix_1.default
        .post(url, data, { headers, responseType: "stream", proxy })
        .then(res => res.data);
}
exports.stream = stream;
function get(url, headers, proxy) {
    headers["User-Agent"] = userAgent;
    return axios_https_proxy_fix_1.default
        .get(url, { headers, proxy })
        .then(res => res.data)
        .catch(wrapError);
}
exports.get = get;
function post(url, headers, data, proxy) {
    headers["Content-Type"] = "application/json";
    headers["User-Agent"] = userAgent;
    return axios_https_proxy_fix_1.default
        .post(url, data, { headers, proxy })
        .then(res => res.data)
        .catch(wrapError);
}
exports.post = post;
function del(url, headers, proxy) {
    headers["User-Agent"] = userAgent;
    return axios_https_proxy_fix_1.default
        .delete(url, { headers, proxy })
        .then(res => res.data)
        .catch(wrapError);
}
exports.del = del;
