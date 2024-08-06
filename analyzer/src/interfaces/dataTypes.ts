export interface OpenIssueRecord {
    contractid: number;
    total: number;
    high: number;
    medium: number;
    low: number;
    issueids: number[];
  }
  
export interface IssueDetailRecord {
    issueid: number;
    issuedescription: string;
    issue: string;
    impact: string;
    check:string;
  }


export interface SourceMapping {
  start: number;
  length: number;
  filename_absolute: string;
}

export interface Contract {
  name: string;
  source_mapping: SourceMapping;
}

export interface Detector {
  check: string;
  description: string;
  impact: string;
  confidence: string;
  markdown: string;
  id: string;
  type_specific_fields: {
    parent: Contract;
  };
}

export interface Results {
  detectors: Detector[];
}

export interface Data {
  success: boolean;
  error: string | null;
  results: Results;
}

  