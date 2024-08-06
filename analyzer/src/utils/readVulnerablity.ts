import * as fs from 'fs';
import { randomBytes, createHash } from 'crypto';
import { issueDetails, openIssues } from '../db';
import { Detector, Data } from '../interfaces/dataTypes';

// Function to generate a random string
function generateRandomString(length: number): string {
  return randomBytes(length).toString('hex');
}

// Function to generate a random hash
function generateRandomHash(): string {
  const randomString = generateRandomString(16); // Generate a 16-byte random string
  const hash = createHash('sha256').update(randomString).digest('hex'); // Hash the random string using SHA-256
  return hash;
}

function extractVulnerabilities(jsonFilePath: string): Detector[] {
  try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
    const data: Data = JSON.parse(rawData);

    if (!data.success || data.error || !data.results || !Array.isArray(data.results.detectors)) {
      throw new Error('Invalid data structure');
    }

    return data.results.detectors;
  } catch (error) {
    console.error('Error extracting vulnerabilities:', error);
    return [];
  }
}

async function processVulnerabilities(vulnerabilities: Detector[]): Promise<void> {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    console.log('No vulnerabilities found.');
    return;
  }

  let total = vulnerabilities.length;
  let high = 0, medium = 0, low = 0;
  const issueIds: string[] = [];
  let issueDetailsPromises: Promise<boolean | void>[] = [];

  vulnerabilities.forEach((vulnerability) => {
    const id = vulnerability.id;
    issueIds.push(id);

    switch (vulnerability.impact.toLowerCase()) {
      case 'high':
        high++;
        break;
      case 'medium':
        medium++;
        break;
      case 'low':
        low++;
        break;
    }

    let issueDetailPromise = issueDetails.addIssueDetailToDb(
      id,
      vulnerability.description,
      vulnerability.check,
      vulnerability.impact
    ).catch(console.error);

    issueDetailsPromises.push(issueDetailPromise);
  });

  await Promise.all(issueDetailsPromises);

  const contractId = generateRandomHash();
  const isOpenIssueAdded= await openIssues.addOpenIssueToDb(
    contractId,
    total,
    high,
    medium,
    low,
    total-high-medium-low,
    issueIds
  )
  if(!isOpenIssueAdded){
      console.log('Open issue couldnt add to db');
  }
  console.log("contractId", contractId);
}

export { extractVulnerabilities, processVulnerabilities };