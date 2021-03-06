// noprotect
import React, { Component} from "react";
import "./LotteryApp.css";
import { ethers } from "ethers";

class LotteryApp_1 extends Component {
  _tokenContract;
    sig;
  constructor(props) {
    super(props);
    this._tokenContract = props.cont;
    this.sig = props.sign;
    this.state = {
      _tokenContract: this._tokenContract,
      signer: this.sig,
      manager: "",
      isManager: "No",
      contractBalance: 0,
      playersCount: 0,
      message: "Message Place Holder",
    };
    debugger
  
    this.findTotalPlayersCount = this.findTotalPlayersCount.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.pickWinner = this.pickWinner.bind(this);
    this.findManager = this.findManager.bind(this);
  }
  
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <h3>
          Find total players entered:
          <button onClick={this.findTotalPlayersCount}>Find</button>
          {this.state.playersCount}
        </h3>
        <p>
          This contract is managed by {" "} {this.state.manager}. There are currently {" "}
          {this.state.playersCount} people in the pool, competing to win {" "}
          {this.state.contractBalance} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Each lottery ticket costs exactly 1 Ether.</label>
          </div>
          <button>Enter</button>
        </form>
        <button onClick={this.findManager}>Am I a manager</button>
        {this.state.isManager}
        {
          <>
            <hr />
            <h4>Ready to pick a winner?</h4>
            <button onClick={this.pickWinner}>Pick a winner!</button>
          </>
        }
        <hr />
        <h2>{this.state.message}</h2>
      </div>
    );
  }

  async findTotalPlayersCount(event) {
    event.preventDefault();
    debugger
    const count = await this.state._tokenContract.totalPlayersEntered();
    console.log("json count: " + JSON.stringify(count));
    var c = count.toNumber();
    this.setState({ playersCount: c }, () => {
      console.log("count: " + this.state.playersCount);
    });

    const contractBalance = await this.state._tokenContract.contractBalance();
    this.setState({contractBalance: contractBalance.toNumber()});
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({ message: "Waiting for the transaction to be mined..." });
    const add1 = await this.state.signer.getAddress();
    console.log("this.wallet address: " + add1);
    await this.state._tokenContract.enter(add1, {
      value: ethers.utils.parseEther("2.0"),
    });

    console.log("player is entered");
    this.setState({
      message: "You have been entered into the lottery! Good luck!!",
    });
  }

  async pickWinner(event) {
    event.preventDefault();
    this.setState({ message: "Waiting for the transaction to be mined..." });
    await this.state._tokenContract.chooseWinner();
    this.setState({ message: "A winner has been picked!" });
  }

  async findManager() {
    const mngr = await this.state._tokenContract.manager();
    console.log("mngr " + mngr);
    const add = await this.state.signer.getAddress();
    console.log("add" + add);
    this.setState({ manager: mngr }, () => {
      console.log("manager: " + this.state.manager);

      if (add === this.state.manager) {
        console.log("i am manager");
        this.setState({ isManager: "true" });
      } else {
        console.log("i am not manager");
        this.setState({ isManager: "false" });
      }
    });
  }
}

/*
function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');
 
  useEffect(() => {
    async function asyncCalls() {
      debugger
      await lottery.methods.findManager().call().then(result => {
        debugger
        setManager(result)});
      debugger
      console.log("manager is: " + manager);
      //await lottery.methods.players(0).call().then(result => setPlayers(result));
      await web3.eth.getBalance(lottery.options.address).then(result => {
        debugger
        setBalance(result)});      
    }
 
    asyncCalls();
  }, [])
 
  const onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting for the transaction to be mined...');
    await lottery.methods.enter(accounts[0]).send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether'),
    });
    setMessage('You have been entered into the lottery! Good luck!!');
  }
 
  const pickWinner = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting for the transaction to be mined...');
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setMessage('A winner has been picked!');
  };
 
  const isManager = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    return accounts[0] === manager;
  }
 
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}.
        There are currently {players.length} people in the pool,
        competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Each lottery ticket costs exactly 1 Ether.</label>
        </div>
        <button>Enter</button>
      </form>
      { isManager &&
        <>
          <hr />
          <h4>Ready to pick a winner?</h4>
          <button onClick={pickWinner}>Pick a winner!</button>
        </>
      }
      <hr />
      <h2>{message}</h2>
    </div>
  );
}
*/

export default LotteryApp_1;
