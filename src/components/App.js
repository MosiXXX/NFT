import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Color from '../abis/Color.json'
import ImageNFT from '../abis/ImageNFT.json'
const ipfsClient = require('ipfs-http-client') 
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
//const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadImageNFTBlockchainData()
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('non ethereum detected')
    }
  }

  //Get the account
  //Get the network
  //Get smart contract
  //Get ImageNFT 
  async loadImageNFTBlockchainData(){
    const web3=window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({imgAccount:accounts[0]})
    
    const networkId = await web3.eth.net.getId()
    //console.log('network: ', networkId) //5777
    const networkData = ImageNFT.networks[networkId]
    if(networkData){
      const abi =ImageNFT.abi
      const address = networkData.address
      const imageContract = new web3.eth.Contract(abi,address)
      this.setState({imageContract})
      const imageTotalSupply =await imageContract.methods.totalSupply().call()
      this.setState({imageTotalSupply})
      console.log('imageTotalSupply: ',imageTotalSupply)
      //get colors
      for(var i=1;i<=imageTotalSupply;i++){
        console.log('hala: ')
        const img =await imageContract.methods.imagesList(i-1).call()
        console.log('imagelist: ',img)
        this.setState({
          images:[...this.state.images,img]
        })
       // result.push(color)
    }
    }
    else{
      window.alert('smart contract not connected')
    }


  }
  async loadBlockchainData(){
    const web3=window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account:accounts[0]})
    
    const networkId = await web3.eth.net.getId()
    //console.log('network: ', networkId) //5777
    const networkData = Color.networks[networkId]
    if(networkData){
      const abi =Color.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi,address)
      this.setState({contract})
      const totalSupply =await contract.methods.totalSupply().call()
      this.setState({totalSupply})
      //get colors
      for(var i=1;i<=totalSupply;i++){
        const color =await contract.methods.colors(i-1).call()
        this.setState({
          colors:[...this.state.colors,color]
        })
       // result.push(color)
    }
    }
    else{
      window.alert('smart contract not connected')
    }


  }
  mint =(color)=>{
    console.log(color)
    this.state.contract.methods.mint(color).send({from:this.state.account})
    .once('receipt',(receipt)=>{
      this.setState({
        colors:[...this.state.colors,color]
      })
    })
  }

  captureFile = (event)=>{
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend= ()=>{
      this.setState({buffer: Buffer(reader.result)})
      
    }
    
  }

  //"QmYFGsjmidBgpDAmsDg1pMddLDQL1CxPZxT3JVZANPrEw6"
  //https://ipfs.infura.io/ipfs/QmYFGsjmidBgpDAmsDg1pMddLDQL1CxPZxT3JVZANPrEw6
  onSubmittFile = (event)=>{
    event.preventDefault()
    
    ipfs.add(this.state.buffer,(error,result)=>{
      const res=result[0]
      this.setState({imgHash:res.hash})
// const bb =this.state.images.map((a)=>a)
      // for(var i=0;i<this.state.imageTotalSupply;i++){
        //console.log('images: ',bb)
      // }
      
      console.log('current: ',res.hash)
      if(this.state.images.indexOf(res.hash) > 0){
        window.alert('repeated')
        return
      }

      console.log('contract: ', this.state.imageContrac)
      // console.log('contract address: ', this.state.imageContrac.options.address)
      const estimGas = this.state.imageContract.methods.mint(this.state.imgAccount,res.hash).estimateGas()
      console.log('Gas: ',estimGas)
      const jj =this.state.imageContract.methods.mint(this.state.imgAccount,res.hash).send({from:this.state.imgAccount})
      .on('transactionHash', function(hash){
        console.log('transactionHash: ',hash)
    })
    .on('receipt', function(receipt){
      console.log('receipt: ',receipt)
  })
  .on('confirmation', function(confirmationNumber, receipt){
    console.log('confirmation Number: ',confirmationNumber)
    console.log('confirmation receipt: ',receipt)
  })
    //   jj.on('receipt', function(receipt){
    //     console.log(logs[0].topics[3]); // this prints the hex value of the tokenId
    //     // you can use `web3.utils.hexToNumber()` to convert it to decimal
    // });
        console.log('IS it TX: ',jj)
      this.setState({
        images:[...this.state.images,res.hash]
      })
      if(error){
        console.error(error)
        return
      }
    })
    
  }
  constructor(props) {
    super(props)
    this.state = {  
      account: '',
      imgAccount: '',
      contract: null,
      imageContract: null,
      totalSupply:0,
      imageTotalSupply:0,
      colors:[],
      images:[],
      buffer:null,
      imgHash:'QmYFGsjmidBgpDAmsDg1pMddLDQL1CxPZxT3JVZANPrEw6'
    }

  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white" ><span id="account">Mosix:{this.state.account}</span></small>
          </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

              {/* <img src={'https://ipfs.infura.io/ipfs/'+this.state.imgHash} className='mintedImg' alt="myImg" /> */}
              <h1>Image Tokens</h1>
                <form onSubmit={this.onSubmittFile}>
                  <input type='file' className='form-control mb-1' 
                  onChange={this.captureFile}
                  />
                  <input type='submit' className='btn btn-block btn-primary' value='MintToIPFS'/>
                </form>

                <div className="row text-center">
                  {this.state.images.map((image,key)=> {
                    return(
                      <div key={key} className="col-md-3 mb-3">
                        <div className="imageToken" >
                          <img src={'https://ipfs.infura.io/ipfs/'+image} className='mintedImg' alt="myImg" />
                        </div>
                        <div > </div>
                      </div>
                    )
                  })}
                </div>

                <h1 className="seprator">Colors Tokens</h1>
                <form onSubmit={(event)=>{
                  event.preventDefault()
                  const color =this.color.value
                  this.mint(color)
                }}>
                  <input type='text' className='form-control mb-1' placeholder='e.g #FFFFFF'
                  ref={(input)=> this.color=input}
                  />
                  <input type='submit' className='btn btn-block btn-primary' value='Mint'/>
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            {this.state.colors.map((color,key)=> {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{backgroundColor:color}}></div>
                  <div >{color} </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
