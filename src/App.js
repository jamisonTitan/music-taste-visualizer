import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let styleOne = {color:'#909', 'fontSize': '24px'};
let styleTwo = {color:'#990', 'fontSize': '20px'};
let btnStyle = {padding: '20px', 'font-size': '54px', 'marginTop':'20px'}

class App extends Component {
  constructor() {
    super();
    this.state = { serverData: {}};
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
      let accessToken = parsed.access_token;
      if (!accessToken)
      return;
      console.log(accessToken);
      fetch('https://api.spotify.com/v1/me',{
        headers: {'authorization': `Bearer ${accessToken}`}
      }).then(response => response.json())
      .then(data => {
        console.log(data.display_name)
        this.setState({serverData: {user: {name: data.display_name}}})
      });
  }
  render() {
    return (
      <div className="App">
        { this.state.serverData.user ?
        <div>
        <h1 style={{...styleOne, 'font-size': '48px'}}>
          {this.state.serverData.user &&
          this.state.serverData.user.name}s Playlist
        </h1>
        <Aggregate songs={this.state.serverData.user &&
                          this.state.serverData.user.songs}/>
        <Playlist/>
        <Playlist/>
        <Playlist/>
      </div> : <button onClick={() =>  window.location='http://localhost:8888/login'}
      style={btnStyle}>Sign in with spotify</button>
    }
    </div>
    );
  }
}

class Aggregate extends Component {
  render() {
    return (
      <div style={{...styleOne, width:'40%', display:'inline-block'}}>
        <h1> song length {this.props.songs &&
                          this.props.songs.length}</h1>
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
      <div style={{...styleTwo, width: '25%'}}>
        <h3 >playlist Name</h3>
        <ul>
          <li> song 1</li>
          <li> song 2 </li>
          <li> song 3 </li>
        </ul>d r
      </div>
    );
  }
}



export default App;
