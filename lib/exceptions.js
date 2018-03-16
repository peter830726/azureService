"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SignatureValidationFailed = /** @class */ (function (_super) {
    __extends(SignatureValidationFailed, _super);
    function SignatureValidationFailed(message, signature) {
        var _this = _super.call(this, message) || this;
        _this.signature = signature;
        return _this;
    }
    return SignatureValidationFailed;
}(Error));
exports.SignatureValidationFailed = SignatureValidationFailed;
var JSONParseError = /** @class */ (function (_super) {
    __extends(JSONParseError, _super);
    function JSONParseError(message, raw) {
        var _this = _super.call(this, message) || this;
        _this.raw = raw;
        return _this;
    }
    return JSONParseError;
}(Error));
exports.JSONParseError = JSONParseError;
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(message, code, originalError) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.originalError = originalError;
        return _this;
    }
    return RequestError;
}(Error));
exports.RequestError = RequestError;
var ReadError = /** @class */ (function (_super) {
    __extends(ReadError, _super);
    function ReadError(originalError) {
        var _this = _super.call(this, originalError.message) || this;
        _this.originalError = originalError;
        return _this;
    }
    return ReadError;
}(Error));
exports.ReadError = ReadError;
var HTTPError = /** @class */ (function (_super) {
    __extends(HTTPError, _super);
    function HTTPError(message, statusCode, statusMessage, originalError) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.statusMessage = statusMessage;
        _this.originalError = originalError;
        return _this;
    }
    return HTTPError;
}(Error));
exports.HTTPError = HTTPError;
