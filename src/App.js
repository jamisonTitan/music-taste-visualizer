import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let styleOne = {color:'#909', 'font-size': '24px'}
let styleTwo = {color:'#909', 'font-size': '20px'}

class Aggregate extends Component {
  render() {
    return (
      <div style={{...styleOne, width:'40%', display:'inline-block'}}>
        <h1> number, text</h1>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <input type='text'/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return(
      <div style={{...styleOne, width: '25%'}}>
        <h3 >playlist Name</h3>
        <ul>
          <li> song 1</li>
          <li> song 2 </li>
          <li> song 3 </li>
        </ul>
      </div>
    );
  }
}

class App extends Component {
  render() {
    let textStyle = {color:'lightBlue', 'font-size': '50px'}
    return (
      <div className="App">
        <h1>
          imploding orange pajama lasers
        </h1>
        <Filter/>
        <Aggregate/>
        <Aggregate/>
        <Playlist/>
        <Playlist/>
        <Playlist/>
      </div>
    );
  }
}

export default App;
