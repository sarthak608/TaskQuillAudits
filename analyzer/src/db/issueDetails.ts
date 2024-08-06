import { apipool } from '../config/databaseConfig';
import { ISSUE_DETAILS_TABLE } from '../config/constants'; // Make sure to define this constant
import { IssueDetailRecord } from '../interfaces/dataTypes';
import { QueryResult } from 'pg';


const getIssueDetailById = async (issueid: string): Promise<IssueDetailRecord | null> => {
  const query = `SELECT * FROM ${ISSUE_DETAILS_TABLE} WHERE issueid = $1`;
  const values = [issueid];
  try {
    const result = await apipool.query(query, values);
    if (result.rows.length) return result.rows[0] as IssueDetailRecord;
    return null;
  } catch (err) {
    return null;
  }
};

const addIssueDetailToDb = async (
  issueid: string,
  issuedescription: string,
  issue: string,
  impact: string
): Promise<boolean> => {
  const isIssued=await getIssueDetailById(issueid);
  if(isIssued) return true;
  const query = `INSERT INTO ${ISSUE_DETAILS_TABLE} (issueid, issuedescription, issue, impact) VALUES ($1, $2, $3, $4);`;
  const values = [issueid, issuedescription, issue, impact];
  try {
    const result = await apipool.query<QueryResult>(query, values);
    return !!result?.rowCount;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

const updateIssueDetail = async (
  issueid: number,
  issuedescription: string,
  issue: string,
  impact: string
): Promise<boolean> => {
  const query = `UPDATE ${ISSUE_DETAILS_TABLE} SET issuedescription = $1, issue = $2, impact = $3 WHERE issueid = $4`;
  const values = [issuedescription, issue, impact, issueid];
  try {
    const result: QueryResult = await apipool.query<QueryResult>(query, values);
    return !!result?.rowCount;
  } catch (error) {
    return false;
  }
};

const removeIssueDetailFromDb = async (issueid: number): Promise<boolean> => {
  const query = `DELETE FROM ${ISSUE_DETAILS_TABLE} WHERE issueid = $1`;
  const values = [issueid];
  try {
    const result: QueryResult = await apipool.query<QueryResult>(query, values);
    return !!result?.rowCount;
  } catch (error) {
    return false;
  }
};

export default {
  getIssueDetailById,
  addIssueDetailToDb,
  updateIssueDetail,
  removeIssueDetailFromDb,
};
