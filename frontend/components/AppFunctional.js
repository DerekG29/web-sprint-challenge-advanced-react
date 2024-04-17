import React, { useState } from 'react';
import axios from 'axios';

const ENDPOINT = 'http://localhost:9000/api/result';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  const [y, x] = getXY(index);

  function getXY(index) {
    const y = Math.floor(index / 3);
    const x = index - y * 3;
    return [y + 1, x + 1];
  }

  function getXYMessage() {
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    const moves = {
      left: (idx) => idx % 3 === 0 ? idx : idx - 1,
      right: (idx) => (idx + 1) % 3 === 0 ? idx : idx + 1,
      up: (idx) => idx - 3 < 0 ? idx : idx - 3,
      down: (idx) => idx + 3 > 8 ? idx : idx + 3,
    };
    return moves[direction](index);
  }

  function move(evt) {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);
    if (newIndex === index) {
      setMessage(`You can't go ${direction}`);
    } else {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage(initialMessage);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault()
    axios.post(ENDPOINT, { x, y, steps, email })
      .then(res => {
        setMessage(res.data.message);
        setEmail(initialEmail);
      })
      .catch(err => {
        setMessage(err.response.data.message);
        setEmail(initialEmail);
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(index)}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time': 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
