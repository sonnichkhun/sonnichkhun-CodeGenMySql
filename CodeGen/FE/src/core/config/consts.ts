export const __DEV__: boolean = process.env.NODE_ENV === 'development';

export const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL ?? window.location.origin;

export const BASE_URL: string = process.env.REACT_APP_BASE_URL ?? window.location.origin;

export const INPUT_DEBOUNCE_TIME: number = 400;

export const STANDARD_DATE_FORMAT: string = 'YYYY-MM-DD';
export const STANDARD_TIME_FORMAT: string = 'HH:mm:ss';
export const STANDARD_DATE_TIME_FORMAT: string = `${STANDARD_DATE_FORMAT}${'T' + STANDARD_TIME_FORMAT}`;
export const STANDARD_DATE_TIME_FORMAT_VIEW: string = `${STANDARD_DATE_FORMAT} ${STANDARD_TIME_FORMAT}`;

export const DEFAULT_TAKE: number = 10;
