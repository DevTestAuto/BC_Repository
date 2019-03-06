import web3 from './web3';
import EMPContract from './build/EMPContract.json';
import ConstantsList from "../constants/address.js";

const instance = new web3.eth.Contract(
  JSON.parse(EMPContract.interface),
  ConstantsList.contractAddress
);

export default instance;
