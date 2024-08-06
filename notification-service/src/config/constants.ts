import { config } from 'dotenv';

const nodeEnv = process.argv[2] || 'local';
const result = config({ path: `.env.${nodeEnv}` });

if (result.error) {
  console.log(0, `Error loading .env.${nodeEnv} file: ${result.error.message}`);
  process.exit(1);
}

//general
export const PORT = process.env['PORT'] || 3010;

//socon public address
export const SOCON_MAIN_WALLET = '0x7ef27552FBf9f20Cb95b4722EFa9015F9fE9e7C5';

//monitor contract addresses
export const MONITOR_CONTRACT_ADDRESS = process.env['MONITOR_CONTRACT_ADDRESS'] as string;
//blockchain providers are keys
export const ETH_NETWORK = 'sepolia';
export const PROVIDER_URL = process.env['PROVIDER_URL'] as string;
export const TRUSTED_SENDER_PRIVATE_KEY = process.env['TRUSTED_SENDER_PRIVATE_KEY'] as string;

//email
export const SMTP_HOST = process.env['SMTP_HOST'];
export const SMTP_PORT = process.env['SMTP_PORT'];
export const SMTP_USER = process.env['SMTP_USER'];
export const SMTP_PASS = process.env['SMTP_PASS'];
export const ALERT_EMAIL_RECIPIENT = process.env['ALERT_EMAIL_RECIPIENT'];
