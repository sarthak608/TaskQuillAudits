import express from 'express';
import getOpenIssueDetails from '../controllers/openIssue';

const router = express.Router();

router.get('/:id', getOpenIssueDetails);

export default router;
