import { Request, Response } from 'express';
import { openIssues} from '../db';


const getOpenIssueDetails = async (req: Request, res: Response) => {
  try {
    //get id from params
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Bad request, enter all the fields required.' });
    const details = await openIssues.getOpenIssueByContractId(id);
    if(!details) return res.status(400).json({ status: false });
    return res.status(200).json({ details});

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};  

export default getOpenIssueDetails;
