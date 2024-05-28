import { omit } from 'lodash-es';

type Params = {
    el: HTMLElement | undefined;
    reverseMerge?: boolean;
};
export const extractAmplitudeParams = ({ el, reverseMerge }: Params): object => {
    if (!el) return {};
    let amplitudeParamEl = el;
    const amplitudeParams = {};
    for (let i = 0; i < 10; i++) {
        const paramsEl = amplitudeParamEl.closest('[data-amplitude-params]');
        if (!paramsEl || !paramsEl.parentElement) break;
        const params = paramsEl.getAttribute('data-amplitude-params');
        if (reverseMerge) {
            Object.assign(amplitudeParams, omit(JSON.parse(params ?? '{}'), Object.keys(amplitudeParams)));
        } else {
            Object.assign(amplitudeParams, JSON.parse(params ?? '{}'));
        }

        amplitudeParamEl = paramsEl.parentElement;
    }
    return amplitudeParams;
};
