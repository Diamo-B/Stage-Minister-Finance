import { cleanEnv, str, port, url, email } from 'envalid';
export const $env = cleanEnv(process.env, {
    FRONT_URL: url(),
    PORT: port(),
    API_VERSION: str(),
    DATABASE_URL: url(),
    JWT_SECRET: str(),
    OUTLOOK_MAIL: email(),
    OUTLOOK_PASS: str(),
    EMAIL: email(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    GOOGLE_ACCESS_TOKEN: str(),
    REFRESH_TOKEN: str(),
});
