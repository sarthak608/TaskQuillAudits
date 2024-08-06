import { apipool } from '../config/databaseConfig';
import { OPEN_ISSUES_TABLE } from '../config/constants'; // Make sure to define this constant
import { OpenIssueRecord } from '../interfaces/dataTypes';
import { QueryResult } from 'pg';

const getOpenIssueByContractId = async (contractid: string): Promise<OpenIssueRecord | null> => {
  const query = `SELECT * FROM ${OPEN_ISSUES_TABLE} WHERE contractid = $1`;
  const values = [contractid];
  try {
    const result = await apipool.query(query, values);
    if (result.rows.length) return result.rows[0] as OpenIssueRecord;
    return null;
  } catch (err) {
    console.log('Error fetching open issue:', err);
    return null;
  }
};

const addOpenIssueToDb = async (
  contractid: string,
  total: number,
  high: number,
  medium: number,
  low: number,
  informational: number,
  issueids: string[]
): Promise<boolean> => {
  const query = `INSERT INTO ${OPEN_ISSUES_TABLE} (contractid, total, high, medium, low, informational, issueids) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
  const values = [contractid, total, high, medium, low, informational, issueids];
  try {
    const result = await apipool.query(query, values);
    return !!result?.rowCount;
  } catch (error) {
    console.log('Error adding open issue:', error);
    return false;
  }
};

const updateOpenIssue = async (
  contractid: string,
  total: number,
  high: number,
  medium: number,
  low: number,
  informational: number,
  issueids: string[]
): Promise<boolean> => {
  const query = `UPDATE ${OPEN_ISSUES_TABLE} SET total = $1, high = $2, medium = $3, low = $4, informational = $5, issueids = $6 WHERE contractid = $7`;
  const values = [total, high, medium, low, informational, issueids, contractid];
  try {
    const result: QueryResult = await apipool.query(query, values);
    return !!result?.rowCount;
  } catch (error) {
    console.log('Error updating open issue:', error);
    return false;
  }
};

const removeOpenIssueFromDb = async (contractid: string): Promise<boolean> => {
  const query = `DELETE FROM ${OPEN_ISSUES_TABLE} WHERE contractid = $1`;
  const values = [contractid];
  try {
    const result: QueryResult = await apipool.query(query, values);
    return !!result?.rowCount;
  } catch (error) {
    console.log('Error removing open issue:', error);
    return false;
  }
};

export default {
  getOpenIssueByContractId,
  addOpenIssueToDb,
  updateOpenIssue,
  removeOpenIssueFromDb,
};
