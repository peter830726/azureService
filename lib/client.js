"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var USER_ID = "07D3234E49CE426DAA29772419F436CA", CLIENT_ID = "1ECFAE91408841A480F00935DC390960";
var http_1 = require("./http");
var xmlbuilder = require("xmlbuilder");
var Types = require("./types");
var URL = require("./urls");
var azure_storage_1 = require("azure-storage");
var Client = /** @class */ (function () {
    function Client(config) {
        this.config = config;
        this.blobService = azure_storage_1.createBlobService(config.storageAccount, config.storageAccessKey);
    }
    Client.prototype.generateCdnFileUrl = function (cdnSubDomain, container, fileName) {
        return "https://" + cdnSubDomain + ".azureedge.net/" + container + "/" + fileName + ".mp3";
    };
    Client.prototype.getToken = function () {
        return this.post(URL.getToken, {
            'Ocp-Apim-Subscription-Key': this.config.bingApiSubscriptionKey
        });
    };
    Client.prototype.cognitive = function (authToken, cognitiveModel) {
        cognitiveModel.rate === undefined ? cognitiveModel.rate = "+0%" : null;
        cognitiveModel.volume === undefined ? cognitiveModel.volume = "+0%" : null;
        cognitiveModel.soundPerson === undefined ? cognitiveModel.soundPerson = "YatingApollo" : null;
        var ssmlDoc = xmlbuilder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', 'zh-TW')
            .ele('voice')
            .att('xml:lang', 'zh-TW')
            .att('xml:gender', Types.soundPersons[cognitiveModel.soundPerson].gender)
            .att('name', Types.soundPersons[cognitiveModel.soundPerson].name)
            .ele('prosody')
            .att('volume', "" + cognitiveModel.volume)
            .att('rate', "" + cognitiveModel.rate)
            .txt(cognitiveModel.text)
            .end();
        return this.stream(URL.cognitive, {
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
            'Authorization': "Bearer " + authToken,
            'X-Search-AppId': USER_ID,
            'X-Search-ClientID': CLIENT_ID,
        }, ssmlDoc.toString());
    };
    ;
    Client.prototype.textToSpeech = function (cognitiveModel, container, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var token, stream_1, url, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.getToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, this.cognitive(token, cognitiveModel)];
                    case 2:
                        stream_1 = _a.sent();
                        return [4 /*yield*/, this.uploadSteramToStorage(stream_1, container, fileName)];
                    case 3:
                        url = _a.sent();
                        return [4 /*yield*/, Promise.resolve(url)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        e_1 = _a.sent();
                        return [2 /*return*/, Promise.reject('textToSpeech Error: ' + e_1)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ;
    Client.prototype.uploadSteramToStorage = function (stream, container, fileName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            stream.pipe(_this.blobService.createWriteStreamToBlockBlob(container, fileName + ".mp3", {
                contentSettings: { contentType: 'audio/mpeg' }
            }, function (error, result, response) {
                if (!error) {
                    if (response.isSuccessful === true) {
                        resolve(_this.generateCdnFileUrl(_this.config.cdnDomain, container, fileName));
                    }
                    else {
                        reject("createWriteStreamToBlockBlob Error: unkown error");
                    }
                }
                else {
                    reject("createWriteStreamToBlockBlob Error: " + error);
                }
            }));
        });
    };
    Client.prototype.post = function (url, headers, body) {
        return http_1.post(url, headers, body);
    };
    Client.prototype.stream = function (url, headers, body) {
        return http_1.stream(url, headers, body);
    };
    return Client;
}());
exports.default = Client;
