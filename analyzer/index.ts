import app from './app';
import { PORT } from './src/config/constants';
import { extractVulnerabilities, processVulnerabilities } from './src/utils/readVulnerablity';


// Start the service
const service = app.listen(PORT, async () => {
const jsonFilePath = './slither_output.json'; // Path to your slither_output.json file
const vulnerabilities = extractVulnerabilities(jsonFilePath);
await processVulnerabilities(vulnerabilities);
});
export default service;
