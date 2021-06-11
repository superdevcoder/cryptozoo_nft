const { assert } = require('chai');

const CryptoZoo = artifacts.require("CryptoZoo");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("Crypto Zoo", accounts => {
    let contract
    let acct1 = accounts[0]
    let acct2 = accounts[1]

    before(async () => {
      contract = await CryptoZoo.deployed()
    })

    describe('deployment', async() => {
      it('deploys successfully', async () => {
        const address = contract.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

      it('has a name', async () => {
        const name = await contract.name()
        assert.equal(name, 'CryptoZoo')
      })

      it('has a symbol', async () => {
        const symbol = await contract.symbol()
        assert.equal(symbol, 'ZOO')
      })
    })

    describe('buying', async () => {
      it('creates a new animal', async() => {
        result = await contract.buyAnimal({
          from: acct1,
          value: web3.utils.toWei("100", "finney"), // 100 finney = 0.1 ether
          gas: 508460,
          gasPrice: web3.utils.toWei("20", "gwei")
        })  
        const event = result.logs[0].args
        // first token is one. 
        assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
        assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
        assert.equal(event.to, acct1, 'to is correct')
        //console.log(event)
      })

      it('rejects lesser valuations', async() => {
          await contract.buyAnimal({
            from: acct1,
            value: web3.utils.toWei("10", "finney"), // 10 finney = 0.01 ether
            gas: 508460,
            gasPrice: web3.utils.toWei("20", "gwei")
          }).should.be.rejected;
      })
    })

    describe('breeding', async () => {
      it('it can breed', async() => {
        // make two animals
        result1 = await contract.buyAnimal({
            from: acct1,
            value: web3.utils.toWei("100", "finney"), // 100 finney = 0.1 ether
            gas: 508460,
            gasPrice: web3.utils.toWei("20", "gwei")
        })
        const event1 = result1.logs[0].args
        result2 = await contract.buyAnimal({
            from: acct1,
            value: web3.utils.toWei("100", "finney"), // 100 finney = 0.1 ether
            gas: 508460,
            gasPrice: web3.utils.toWei("20", "gwei")
        })
        const event2 = result2.logs[0].args
        // breed the two animals
        breedTx = await contract.breedAnimals(event1.tokenId, event2.tokenId, {
          from: acct1, 
          value: web3.utils.toWei("50", "finney"), // 50 finney = 0.05 ether
          gas: 508460,
          gasPrice: web3.utils.toWei("20", "gwei")
        })
        assert(breedTx.logs.length > 0)

        const babyEvent = breedTx.logs[0].args
        const birth = breedTx.logs[1].args
        //console.log('event 1 token id: ', event1.tokenId)
        //console.log('breed token id: ', babyEvent.tokenId)
        
        assert(birth.species.toNumber, 0, 'it is a mutant')
        assert(birth.generation, 1, "it is next generation")
        result4 = await contract.breedAnimals(event1.tokenId, babyEvent.tokenId, {
          from: acct1, 
          value: web3.utils.toWei("50", "finney"), // 50 finney = 0.05 ether
          gas: 508460,
          gasPrice: web3.utils.toWei("20", "gwei")
        }).should.be.rejected;

        // make sure mutants can't mate!


      })
    })
});
