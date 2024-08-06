import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import openIssuesRouter from "./src/routers/openIssuesRouter";
import issueDetailsRouter from "./src/routers/issueDetailsRouter";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (res:Response) => {
    return res.status(200).send('Service is Active');
});
app.use('/openissues', openIssuesRouter);
app.use('/issuedetails', issueDetailsRouter);

export default app;
