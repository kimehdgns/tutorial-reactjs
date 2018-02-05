import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    var className = 'square ' + props.className;
    return (
        <button className={className} onClick={props.onClick}>
            {props.value}

        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const className = i === this.props.lastIndex ? 'active' : '';
        return <Square value={this.props.squares[i]}
                       onClick={() => this.props.onClick(i)}
                       className={className}/>;
    }

    render() {
        return (
            <div>
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
                squares: Array(9).fill(null),
                lastIndex: null
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }

    calculatePositionFromArrayIndex(index) {
        if (index === null) {
            return {x: null, y: null};
        } else {
            const x = index % 3 + 1;
            const y = index / 5 > 1 ? 1 : index / 2 > 1 ? 2 : 3;
            return {x: x, y: y};
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastIndex: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'go to move #' + move :
                'go to game start';
            return <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        });

        let status;
        if (winner) {
            status = 'winner : ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const lastPosition = this.calculatePositionFromArrayIndex(current.lastIndex);
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                           onClick={(i) => this.handleClick(i)}
                           lastIndex={current.lastIndex}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className="game-current-position active">({lastPosition.x}, {lastPosition.y})</div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
            return squares[a];
        }
    }
    return null;
}