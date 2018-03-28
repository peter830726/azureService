/// <reference types="node" />
import { Readable } from "stream";
import * as Types from "./types";
import { BlobService } from "azure-storage";
export default class Client {
    config: Types.ClientConfig;
    blobService: BlobService;
    proxyConfig: Types.AxiosProxyConfig;
    constructor(config: Types.ClientConfig, proxyConfig?: Types.AxiosProxyConfig);
    generateCdnFileUrl(container: string, fileName: string): string;
    getToken(): Promise<any>;
    cognitive(authToken: string, cognitiveModel: Types.cognitiveModel): Promise<Readable>;
    textToSpeech(cognitiveModel: Types.cognitiveModel, container: string, fileName: string): Promise<string>;
    uploadSteramToStorage(stream: Readable, container: string, fileName: string): Promise<string>;
    private post(url, headers, body?);
    private stream(url, headers, body?);
}
