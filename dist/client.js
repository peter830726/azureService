"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const USER_ID = "07D3234E49CE426DAA29772419F436CA", CLIENT_ID = "1ECFAE91408841A480F00935DC390960";
const http_1 = require("./http");
const xmlbuilder = require("xmlbuilder");
const Types = require("./types");
const URL = require("./urls");
const azure_storage_1 = require("azure-storage");
class Client {
    constructor(config) {
        this.config = config;
        this.blobService = azure_storage_1.createBlobService(config.storageAccount, config.storageAccessKey);
    }
    generateCdnFileUrl(container, fileName) {
        return `https://${this.config.cdnDomain}.azureedge.net/${container}/${fileName}.mp3`;
    }
    getToken() {
        return this.post(URL.getToken, {
            'Ocp-Apim-Subscription-Key': this.config.bingApiSubscriptionKey
        });
    }
    cognitive(authToken, cognitiveModel) {
        cognitiveModel.rate === undefined ? cognitiveModel.rate = "+0%" : null;
        cognitiveModel.volume === undefined ? cognitiveModel.volume = "+0%" : null;
        cognitiveModel.soundPerson === undefined ? cognitiveModel.soundPerson = "YatingApollo" : null;
        let ssmlDoc = xmlbuilder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', 'zh-TW')
            .ele('voice')
            .att('xml:lang', 'zh-TW')
            .att('xml:gender', Types.soundPersons[cognitiveModel.soundPerson].gender)
            .att('name', Types.soundPersons[cognitiveModel.soundPerson].name)
            .ele('prosody')
            .att('volume', `${cognitiveModel.volume}`)
            .att('rate', `${cognitiveModel.rate}`)
            .txt(cognitiveModel.text)
            .end();
        return this.stream(URL.cognitive, {
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
            'Authorization': `Bearer ${authToken}`,
            'X-Search-AppId': USER_ID,
            'X-Search-ClientID': CLIENT_ID,
        }, ssmlDoc.toString());
    }
    ;
    textToSpeech(cognitiveModel, container, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = yield this.getToken();
                let stream = yield this.cognitive(token, cognitiveModel);
                let url = yield this.uploadSteramToStorage(stream, container, fileName);
                return yield Promise.resolve(url);
            }
            catch (e) {
                return Promise.reject('textToSpeech Error: ' + e);
            }
        });
    }
    ;
    uploadSteramToStorage(stream, container, fileName) {
        return new Promise((resolve, reject) => {
            stream.pipe(this.blobService.createWriteStreamToBlockBlob(container, `${fileName}.mp3`, {
                contentSettings: { contentType: 'audio/mpeg' }
            }, (error, result, response) => {
                if (!error) {
                    if (response.isSuccessful === true) {
                        resolve(this.generateCdnFileUrl(container, fileName));
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
    }
    post(url, headers, body) {
        return http_1.post(url, headers, body);
    }
    stream(url, headers, body) {
        return http_1.stream(url, headers, body);
    }
}
exports.default = Client;
