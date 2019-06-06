import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Line(props) {
    return (
        <div className={props.result ? props.result + ' line' : 'hidden'}></div>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            >
            </Square>
        );
    }

    renderLine(){
        return (
            <Line result={this.props.result}></Line>
        );
    }

    render() { 
        return (
          <div className="board">
            
            {/* this.renderLine() */}
            {this.renderLine()}
        
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xTurn: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        //ignore clicks if winner declared or square already filled
        if(calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xTurn ? 'x' : 'o';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xTurn: !this.state.xTurn
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xTurn: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        let result; 
        
        
        if (winner) {
            status = 'Winner: ' + winner.squares;
            result = winner.result;
            console.log(result);
            // drawResult(result);

        } else {
            status = 'Next player: ' + (this.state.xTurn ? 'x' : 'o');
        }

        return (
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                result={result}
                onClick={i => this.handleClick(i)}
              >
              </Board>
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 'horizontal-top'],
    [3, 4, 5, 'horizontal-mid'],
    [6, 7, 8, 'horizontal-bot'],
    [0, 3, 6, 'vertical-left'],
    [1, 4, 7, 'vertical-mid'],
    [2, 5, 8, 'vertical-right'],
    [0, 4, 8, 'diagonal-topleft'],
    [2, 4, 6, 'diagonal-botleft'],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
        // console.log(lines[i]);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        var winner = {
            squares: squares[a],
            result: lines[i][3]
        }
        return winner;
    }
  }
  return null;
}
