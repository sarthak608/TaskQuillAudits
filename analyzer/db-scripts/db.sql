CREATE DATABASE soconapidb;

\c soconapidb;

CREATE ROLE <username> WITH LOGIN PASSWORD <password>;

GRANT CONNECT ON DATABASE soconapidb TO <username>;

CREATE TABLE open_issues (contractid TEXT PRIMARY KEY, total INT NOT NULL, high INT  NOT NULL, medium INT  NOT NULL, low INT  NOT NULL, informational INT  NOT NULL, issueids TEXT[]);

CREATE TABLE issue_details (issueid TEXT PRIMARY KEY, issuedescription TEXT, issue VARCHAR(20) NOT NULL, impact VARCHAR(20) NOT NULL);