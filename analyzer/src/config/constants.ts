import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
const nodeEnv = process.argv[2] || 'local';
const result = config({ path: `.env.${nodeEnv}` });

if (result.error) {
  console.log(0, `Error loading .env.${nodeEnv} file: ${result.error.message}`);
  process.exit(1);
}

//general
const DB_SSL_KEY_PATH = "ssl-tls-key.pem";
export const PORT = process.env['PORT'] || 3000;


//db config
export const PG_API_CONFIG = {
  user: process.env['PG_API_USER'] as string,
  host: process.env['PG_API_HOST'] as string,
  database: process.env['PG_API_DATABASE'] as string,
  password: process.env['PG_API_PASSWORD'] as string,
  port: Number.parseInt(process.env['PG_API_PORT'] as string),
  ssl: nodeEnv === 'local' ? false : {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(DB_SSL_KEY_PATH)).toString()
  }
};

// db k
export const ISSUE_DETAILS_TABLE = 'issue_details';
export const OPEN_ISSUES_TABLE = 'open_issues';



