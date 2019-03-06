const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const EMPContract = require('./build/EMPContract.json');

//Ropsten
const provider = new HDWalletProvider(
 // 'open bridge wish expose talent vessel smoke bullet enable damp rifle adapt',
 'yard connect giant midnight dog upset disagree grant pull grant talent little',
  'https://ropsten.infura.io/v3/0de330113ff14c638f8ec78c590907c8'
);

//Rinkeby
// const provider = new HDWalletProvider(
//   'spot faith gown habit strike palm bubble icon calm coach damp admit',
//   'https://rinkeby.infura.io/v3/0de330113ff14c638f8ec78c590907c8'
// );

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(EMPContract.interface)
  )
    .deploy({ data: EMPContract.bytecode })
    .send({ gas: '3000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
