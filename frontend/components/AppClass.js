import React from 'react'
import axios from 'axios';

const ENDPOINT = 'http://localhost:9000/api/result';

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = { ...initialState };
  }

  getXY = (index) => {
    const y = Math.floor(index / 3);
    const x = index - y * 3;
    return [y + 1, x + 1];
  }

  getXYMessage = () => {
    const [y, x] = this.getXY(this.state.index);
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    this.setState({ ...initialState })
  }

  getNextIndex = (direction) => {
    const moves = {
      left: (idx) => idx % 3 === 0 ? idx : idx - 1,
      right: (idx) => (idx + 1) % 3 === 0 ? idx : idx + 1,
      up: (idx) => idx - 3 < 0 ? idx : idx - 3,
      down: (idx) => idx + 3 > 8 ? idx : idx + 3,
    };
    return moves[direction](this.state.index);
  }

  move = (evt) => {
    const direction = evt.target.id;
    const newIndex = this.getNextIndex(direction);
    if (newIndex === this.state.index) {
      this.setState({ ...this.state, message: `You can't go ${direction}`});
    } else {
      this.setState({ ...this.state,
        index: newIndex,
        steps: this.state.steps + 1,
        message: initialMessage
      })
    }
  }

  onChange = (evt) => {
    this.setState({ ...this.state, email: evt.target.value })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    const [x, y] = this.getXY(this.state.index);
    const { steps, email } = this.state;
    axios.post(ENDPOINT, { x, y, steps, email })
      .then(res => {
        this.setState({ ...this.state, 
          message: res.data.message,
          email: initialEmail,
        })
      })
      .catch(err => {
        this.setState({ ...this.state, 
          message: err.response.data.message,
          email: initialEmail,
        })
      })
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <p>(This component is not required to pass the sprint)</p>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
