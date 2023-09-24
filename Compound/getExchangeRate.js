const Web3 = require('web3');
const web3 = new Web3('http://cloudflare-eth.com/');

const erc20ABI = require('../json/erc20.json');
const cTokenABI = require('../json/cTokenABI.json');
const compoundABI = require("../json/compound.json")
const MKRABI = require("../json/MKR.json")

const compoundContractInstance = new web3.eth.Contract(compoundABI, '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B');


const main =  async function() {
    const allMarkets = await compoundContractInstance.methods.getAllMarkets().call();
    console.log(allMarkets);


    var underlying = '';
    var decimal = 0;
    var underSymbol = '';

    for (let i = 0; i < allMarkets.length; i++) {
        if (allMarkets[i] == '0xF5DCe57282A584D2746FaF1593d3121Fcac444dC') {
            continue
        }

        const cTokenInstance = new web3.eth.Contract(cTokenABI, allMarkets[i]); // cToken contract instance 
        const symbol = await cTokenInstance.methods.symbol().call();

        if (allMarkets[i] == '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5') { // if cETH
            underlying = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';
            decimal = 18;
        } else {
            underlying = await cTokenInstance.methods.underlying().call();
            const underERC = new web3.eth.Contract(erc20ABI, underlying);
            decimal = await underERC.methods.decimals().call();
        }

        if (allMarkets[i] == '0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b') {
            underSymbol = 'MKR';
        } else {
            const erc20 = new web3.eth.Contract(erc20ABI, underlying);
            underSymbol = await erc20.methods.symbol().call()
        }

        console.log(symbol,"underlying type:", underSymbol,"underlying address: ", underlying.toString(), "decimal: ", decimal);
    }
}

main();