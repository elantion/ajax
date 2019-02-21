interface ARGUMENTS {
    method: string;
    url: string;
    enctype?: string;
    data?: any;
    isAsync?: boolean;
    headers?: any;
    progressFn?: EventListenerOrEventListenerObject;
}
export default ARGUMENTS;
