const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: 1000000 });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: 1000000,
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("Deploys a factory and a campaigns", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("Allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: 200,
      from: accounts[1],
    });

    const isContributor = await campaign.methods.approvers(accounts[1]);
    assert(isContributor);
  });

  it("Requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: 5,
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", 100, accounts[1])
      .send({
        gas: 1000000,
        from: accounts[0],
      });

    const request = await campaign.methods.requests(0).call();

    assert.equal(request.description, "Buy batteries");
  });

  it("Processes requests", async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[0],
    });

    await campaign.methods
      .createRequest(
        "Buy batteries",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({
        gas: 1000000,
        from: accounts[0],
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: 1000000,
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: 1000000,
    });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;

    // At least 1.8 ether has been sent (the difference minus the gas)
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });

  it("Full scenario with failure finalization", async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[0],
    });
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[1],
    });
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[3],
    });

    await campaign.methods
      .createRequest(
        "Buy batteries",
        web3.utils.toWei("5", "ether"),
        accounts[4]
      )
      .send({
        gas: 1000000,
        from: accounts[0],
      });

    // 1/3 approve
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: 1000000,
    });

    // Here the finalization should fail as only 1/3 of approvers has approved
    try {
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 1000000,
      });
      assert(false);
    } catch (e) {
      assert(e);
    }

    // 2/3 approve
    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: 1000000,
    });

    const initialBalance = await web3.eth.getBalance(accounts[4]);
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: 1000000,
    });

    const finalBalance = await web3.eth.getBalance(accounts[4]);
    const difference = finalBalance - initialBalance;

    // At least 3.8 ether has been sent (the difference minus the gas)
    assert(difference > web3.utils.toWei("3.8", "ether"));
  });
});
