import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface),
  '0x4921d1A6355E74E9CFbf0bfcD26cbf17Cf613CC7'
);

export default instance;
