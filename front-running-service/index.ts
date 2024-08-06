import app from './app';
import {blockchain} from './src/blockchain';
import { PORT } from './src/config/constants';


// Start the service
const service = app.listen(PORT, () => {
  blockchain.frontRunningCheckService(); 

});
export default service;
