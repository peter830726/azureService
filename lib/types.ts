import { AxiosProxyConfig } from "axios-https-proxy-fix";

export type AxiosProxyConfig = AxiosProxyConfig;

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

const YatingApollo = {
    gender: "Female",
    name: "Microsoft Server Speech Text to Speech Voice (zh-TW, Yating, Apollo)"
}

const HanHanRUS = {
    gender: "Female",
    name: "Microsoft Server Speech Text to Speech Voice (zh-TW, HanHanRUS)"
}

const ZhiweiApollo = {
    gender: "Male",
    name: "Microsoft Server Speech Text to Speech Voice (zh-TW, Zhiwei, Apollo)"
}

export const soundPersons = {
    YatingApollo,
    HanHanRUS,
    ZhiweiApollo
};

export type soundPerson = "YatingApollo" | "HanHanRUS" | "ZhiweiApollo";

export type cognitiveModel = {
    text: string,
    volume?: string,
    rate?: string,
    soundPerson?: soundPerson;
}

export type postCognitiveModel = {
    authToken: string,
    cognitiveModel: cognitiveModel
}