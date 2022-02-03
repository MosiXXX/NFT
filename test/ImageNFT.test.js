const { assert } = require('chai')

const ImageNFT = artifacts.require('./ImageNFT.sol') 

require('chai')
.use(require('chai-as-promised'))
.should()

contract('ImageNFT',(accounts)=>{
    let contract
    before(async()=>{
        contract = await ImageNFT.deployed()
    })
    
    describe('deployment',async()=>{
        it('address Check',async()=>{
            const address = contract.address
            // console.log('ContractAddress: ',address)
            // console.log('AccountAddress: ',accounts[0])
            assert.notEqual(address,0x0)
            assert.notEqual(address,null)
            assert.notEqual(address,'')
            assert.notEqual(address,undefined)
        })        
    })

    describe('storage',async()=>{
        it('update ImageNFT',async()=>{
            let imgHash
            imgHash='tag123'
            console.log('contract address: ', contract.address)
            console.log('account address: ', accounts[0])
            // console.log('contract: ', contract)
            const res = await contract.mint(contract.address,imgHash)
            console.log('TX address: ',res.tx)
            assert.equal('tag123',imgHash)
        })
        
    })
})