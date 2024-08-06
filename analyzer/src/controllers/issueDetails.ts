import { Request, Response } from 'express';
import { issueDetails} from '../db';

const getIssueDetails = async (req: Request, res: Response) => {
  try {
    //get email for params
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Bad request, enter all the fields required.' });
    const details = await issueDetails.getIssueDetailById(id);
    if(!details) return res.status(400).json({ status: false });
    return res.status(200).json({ details });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};  

export default getIssueDetails;
