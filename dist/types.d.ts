import { AxiosProxyConfig } from "axios-https-proxy-fix";
export declare type AxiosProxyConfig = AxiosProxyConfig;
export interface BingApiConfig {
    bingApiSubscriptionKey?: string;
}
export interface CdnConfig {
    cdnDomain: string;
}
export interface ClientConfig extends BingApiConfig, StorageConfig, CdnConfig {
}
export interface StorageConfig {
    storageAccount: string;
    storageAccessKey: string;
}
export declare const soundPersons: {
    YatingApollo: {
        gender: string;
        name: string;
    };
    HanHanRUS: {
        gender: string;
        name: string;
    };
    ZhiweiApollo: {
        gender: string;
        name: string;
    };
};
export declare type soundPerson = "YatingApollo" | "HanHanRUS" | "ZhiweiApollo";
export declare type cognitiveModel = {
    text: string;
    volume?: string;
    rate?: string;
    soundPerson?: soundPerson;
};
export declare type postCognitiveModel = {
    authToken: string;
    cognitiveModel: cognitiveModel;
};
