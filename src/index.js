import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button onClick={props.onClick} className={props.hilight ? 'square hilight' : 'square'}>
      {props.value}
    </button>
    )
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square key={i} 
      hilight={this.props.winnerCase.includes(i)}
      winnerCase={this.props.winnerCase} value={this.props.squares[i]} onClick={() => this.props.handleClick(i)}/>;
  }

  render() {
    return <div className='game-board-grid'>
      {
        this.props.squares.map((squareNumber, index) => this.renderSquare(index))
      }
    </div>
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) , row: 0, col: 0, id: 0}],
      xIsNext: true,
      stepNumber: 0,
      order: 'asc',
      winnerCase: [],
      winner: '',
    }

    this.handleClick = this.handleClick.bind(this);
    this.toggleOrder = this.toggleOrder.bind(this);
    this.calculateWinner = this.calculateWinner.bind(this);
  }

  toggleOrder(){
    let order = this.state.order === 'asc' ? 'desc' : 'asc';
    
    this.setState({
      order: order
    });
  }

  handleClick(i){
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];
    let squares = current.squares.slice();

    if(this.calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.stepNumber % 2 == 0 ? 'X' : 'O';

    this.setState({
      history:  history.concat([{ 
          squares: squares,
          row: i <= 2 ? 1 : i <= 5 ? 2 : 3,
          col: (i % 3) + 1,
          id: this.state.stepNumber + 1,
        }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1,
    })
  }

  jumpTo(moveNumber){

    this.setState({stepNumber: moveNumber});
  }
  
  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          winnerCase: [a,b,c]
        }
      }
    }
    return null;
  }
  isArrayFilled(array){
    for(let i = 0; i < array.length; i++){
      if(!array[i]) return false;
    }
    return true;
  }
  render() {

    let history = this.state.history;
    let current = history[this.state.stepNumber];
    let squares = current.squares;

    let gameResult = this.calculateWinner(squares);
    let winner = gameResult && gameResult.winner;
    let winnerCase = gameResult && gameResult.winnerCase;

    let status;
    
    if(winner)
      status = 'The Winner is ' + winner;
    else if(!winner && this.isArrayFilled(squares))
      status = 'no ones wines.. it is a draw';
    else    
      status = 'Next player: ' + (this.state.stepNumber % 2 == 0 ? 'X' : 'O' );


    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={squares}
          handleClick={(i) => this.handleClick(i)}
          winnerCase={winnerCase || []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>

          <button onClick={this.toggleOrder}>{this.state.order == 'asc' ? 'asc' : 'desc'}</button>

          <ol>
            {
              this.state.order == 'desc' ?
              this.state.history.slice().reverse().map((historyStep, historyMoveNumber) => <li key={historyMoveNumber}>
                <button 
                  onClick={() => this.jumpTo(this.state.history.length - 1 - historyMoveNumber)} 
                  className={this.state.stepNumber == (this.state.history.length - 1 - historyMoveNumber) ? 'boldMe' : ''}
                >
                  {'Go To step #' + historyMoveNumber + ` || row ${historyStep.row} col ${historyStep.col}`}
                </button>
              </li>)
              :
              this.state.history.slice().map((historyStep, historyMoveNumber) => <li key={historyMoveNumber}>
                <button 
                  onClick={() => this.jumpTo(historyMoveNumber)} 
                  className={this.state.stepNumber == historyMoveNumber ? 'boldMe' : ''}
                >
                  {'Go To step #' + historyMoveNumber + ` || row ${historyStep.row} col ${historyStep.col}`}
                </button>
              </li>)
            }
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
