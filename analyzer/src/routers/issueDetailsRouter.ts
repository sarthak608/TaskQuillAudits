import express from 'express';
import getIssueDetails from '../controllers/issueDetails';

const router = express.Router();

router.get('/:id', getIssueDetails);

export default router;
