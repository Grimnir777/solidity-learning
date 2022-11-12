const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use an account to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: 1000000 });
});

describe('Lottery', () => {
    it('should deploys the contract',  () => {
        assert.ok(lottery.options.address);
    });

    it('should allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether'),
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });
        assert.equal(players[0], accounts[0]);
        assert.equal(players.length, 1);
    });

    it('should allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether'),
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether'),
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether'),
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });
        assert.equal(players[0], accounts[0]);
        assert.equal(players[1], accounts[1]);
        assert.equal(players[2], accounts[2]);
        assert.equal(players.length, 3);
    });

    it('should requires a minimum amount to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 10
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });


    it('should only let a manager to pick the winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('should sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether'),
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        // At least 1.8 ether has been sent (the difference minus the gas)
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        // Players array has been reset
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        assert.equal(players.length, 0);
    });
});

