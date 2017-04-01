import ARGUMENTS from './interface/ARGUMENTS';
declare class Ajax {
    constructor();
    static request(args: ARGUMENTS): Promise<any>;
    static get(url: string, data?: any, headers?: any): Promise<any>;
    static post(url: string, data?: any, headers?: any, enctype?: string): Promise<any>;
}
export = Ajax;
