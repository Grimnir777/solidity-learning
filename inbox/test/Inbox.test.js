const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');
const INITIAL_MESSAGE = 'Hi there';

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use an account to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: 1000000 });
});

describe('Inbox', () => {
    it('should deploys a contract',  () => {
        assert.ok(inbox.options.address);
    });

    it('should have a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('should update the message', async () => {
        const newMessage = 'Hello there'
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0], gas: 1000000 });
        const message = await inbox.methods.message().call();
        assert.equal(message, newMessage)
    });
});

