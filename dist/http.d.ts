/// <reference types="node" />
import { AxiosProxyConfig } from "axios-https-proxy-fix";
import { Readable } from "stream";
export declare type AxiosProxyConfig = AxiosProxyConfig;
export declare function stream(url: string, headers?: any, data?: any, proxy?: AxiosProxyConfig): Promise<Readable>;
export declare function get(url: string, headers: any, proxy?: AxiosProxyConfig): Promise<any>;
export declare function post(url: string, headers?: any, data?: any, proxy?: AxiosProxyConfig): Promise<any>;
export declare function del(url: string, headers: any, proxy?: AxiosProxyConfig): Promise<any>;
