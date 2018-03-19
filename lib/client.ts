const USER_ID = "07D3234E49CE426DAA29772419F436CA",
    CLIENT_ID = "1ECFAE91408841A480F00935DC390960";

import { Readable } from "stream";
import { post, stream } from "./http";
import * as xmlbuilder from "xmlbuilder";
import * as Types from "./types";
import * as URL from "./urls";
import { Stream } from "stream";
import { promisify } from "util";
import { createBlobService, BlobService } from "azure-storage";

export default class Client {
    public config: Types.ClientConfig;
    public blobService: BlobService;

    constructor(config: Types.ClientConfig) {
        this.config = config;
        this.blobService = createBlobService(config.storageAccount, config.storageAccessKey);
    }
    
    public generateCdnFileUrl(container: string, fileName: string): string {
        return `https://${this.config.cdnDomain}.azureedge.net/${container}/${fileName}.mp3`;
    }

    public getToken(): Promise<any> {
        return this.post(URL.getToken, {
            'Ocp-Apim-Subscription-Key': this.config.bingApiSubscriptionKey
        });
    }

    public cognitive(authToken: string, cognitiveModel: Types.cognitiveModel): Promise<Readable> {

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
    };
    
    public async textToSpeech(cognitiveModel: Types.cognitiveModel, container: string, fileName: string) {
        try {
            let token = await this.getToken();
            let stream = await this.cognitive(
                token,
                cognitiveModel
            );
            let url = await this.uploadSteramToStorage(stream, container, fileName);
            return await Promise.resolve(url);
        } catch (e) {
            return Promise.reject('textToSpeech Error: ' + e);
        }
    };

    public uploadSteramToStorage(stream: Readable, container: string, fileName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            stream.pipe(this.blobService.createWriteStreamToBlockBlob(container, `${fileName}.mp3`, {
                contentSettings: { contentType: 'audio/mpeg' }
            }, (error, result, response) => {
                if (!error) {
                    if (response.isSuccessful === true) {
                        resolve(this.generateCdnFileUrl(container, fileName));
                    } else {
                        reject("createWriteStreamToBlockBlob Error: unkown error");
                    }
                } else {
                    reject("createWriteStreamToBlockBlob Error: " + error);
                }
            }));
        });
    }

    private post(url: string, headers: any, body?: any): Promise<any> {
        return post(url, headers, body);
    }

    private stream(url: string, headers: any, body?: any): Promise<Readable> {
        return stream(url, headers, body);
    }
}


