delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
import { Pool } from 'pg';
import { PG_API_CONFIG } from './constants';

// Create a pool instance for API database
const apipool = new Pool(PG_API_CONFIG);


// Function to close database connections
async function closeDbConnection() {
  try {
    await apipool.end();
  } catch (error) {
  }
}

export { apipool, closeDbConnection };
