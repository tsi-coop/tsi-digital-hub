// export const TSICONFIG: any = {
//     LOCAL_STORAGE_KEY: 'CONSENT_LOCAL_STORAGE_KEY',
//     TSI_COOP_ENV_CONSENT: 'tsi_coop_sandbox_envt_consent',
//     USER_ID: 'tsi_coop_user_id',
//     REACT_APP_FIDUCIARY_KEY: '4b11744a-2fdf-4e99-be87-654887f5834e',
//     REACT_APP_POLICY_KEY: '91facc77-f1b6-456d-9796-f6ad3e2d7135',
//     REACT_APP_API_BASE_URL: 'https://dpdp-cms.tsicoop.org',
//     REACT_APP_EXPIRY_DAYS: 365,
//     NODE_ENV: 'dev'
// };

const NODE_ENV = 'prod'

// const devConfig = {
//     COOKIE_LOCAL_STORAGE_KEY: 'CONSENT_LOCAL_STORAGE_KEY',
//     LOCALSTORAGE_ENV_CONSENT: 'tsi_coop_sandbox_envt_consent',
//     USER_ID: 'tsi_coop_user_id',
//     REACT_APP_FIDUCIARY_KEY: '4b11744a-2fdf-4e99-be87-654887f5834e',
//     REACT_APP_POLICY_KEY: '91facc77-f1b6-456d-9796-f6ad3e2d7135',
//     REACT_APP_API_BASE_URL: 'https://dev.dpdp-cms.tsicoop.org',
//     REACT_APP_EXPIRY_DAYS: 365,
//     NODE_ENV: 'dev',
// };

// const prodConfig = {
//     COOKIE_LOCAL_STORAGE_KEY: 'CONSENT_LOCAL_STORAGE_KEY',
//     LOCALSTORAGE_ENV_CONSENT: 'tsi_coop_sandbox_envt_consent',
//     USER_ID: 'tsi_coop_user_id',
//     REACT_APP_FIDUCIARY_KEY: '4b11744a-2fdf-4e99-be87-654887f5834e',
//     REACT_APP_POLICY_KEY: '91facc77-f1b6-456d-9796-f6ad3e2d7135',
//     REACT_APP_API_BASE_URL: 'https://dpdp-cms.tsicoop.org',
//     REACT_APP_EXPIRY_DAYS: 365,
//     NODE_ENV: 'prod',
// };


export const devConfig = {
    COOKIE_LOCAL_STORAGE_KEY: process.env.REACT_APP_LOCAL_STORAGE_KEY,
    LOCALSTORAGE_ENV_CONSENT: process.env.REACT_APP_TSI_COOP_ENV_CONSENT,
    USER_ID: process.env.REACT_APP_USER_ID,
    REACT_APP_FIDUCIARY_KEY: process.env.REACT_APP_FIDUCIARY_KEY,
    REACT_APP_POLICY_KEY: process.env.REACT_APP_POLICY_KEY,
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    REACT_APP_EXPIRY_DAYS: Number(process.env.REACT_APP_EXPIRY_DAYS),
    NODE_ENV: process.env.NODE_ENV,
};

const prodConfig = {
    COOKIE_LOCAL_STORAGE_KEY: process.env.REACT_APP_LOCAL_STORAGE_KEY,
    LOCALSTORAGE_ENV_CONSENT: process.env.REACT_APP_TSI_COOP_ENV_CONSENT,
    USER_ID: process.env.REACT_APP_USER_ID,
    REACT_APP_FIDUCIARY_KEY: process.env.REACT_APP_FIDUCIARY_KEY,
    REACT_APP_POLICY_KEY: process.env.REACT_APP_POLICY_KEY,
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    REACT_APP_EXPIRY_DAYS: Number(process.env.REACT_APP_EXPIRY_DAYS),
    NODE_ENV: process.env.NODE_ENV,
};

console.log("REACT_APP_CONFIGREACT_APP_CONFIG", devConfig)
console.log("SERVER_URL",  process.env.REACT_APP_TSI_API_BASE_URL)


export const TSICONFIG: any = (NODE_ENV == "prod") ? prodConfig : devConfig