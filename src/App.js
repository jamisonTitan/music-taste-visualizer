import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let styleOne = {color:'#303', 'fontSize': '24px'};
let styleTwo = {color:'#330', 'fontSize': '20px'};
let btnStyle = {padding: '20px', 'fontSize': '54px', 'marginTop':'20px'}

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...styleOne, width: "40%", display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{...styleOne, width: "40%", display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{...styleOne, padding : '12px'}}>
        <img/>
        <input type="text" onKeyUp={event =>
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { filterString: ''};
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
        console.log(data)
        this.setState({
            user: {
                name: data.display_name,
              }
        });
      });

      fetch('https://api.spotify.com/v1/me/playlists',{
        headers: {'authorization': `Bearer ${accessToken}`}
      }).then(response => response.json())
      .then(data => {
          this.setState({
            playlists: data.items.map(item => {
              console.log(item)
              return {
                name: item.name,
                imageURL: item.images[0].url,
                songs: []
              }
            }),
          });
      });

  }


  render() {
    let playlistToRender =
       this.state.user &&
       this.state.playlists
         ? this.state.playlists.filter(playlist =>
           playlist.name.toLowerCase().includes(
             this.state.filterString.toLowerCase()))
 : []
    return (
      <div className="App">
        { this.state.user ?
        <div>
        <h1 style={{...styleOne, 'fontSize': '48px'}}>
          {this.state.user &&
          this.state.user.name}s Playlists
        </h1>
        <Filter onTextChange={text => {
            this.setState({filterString: text})
          }}/>
      <PlaylistCounter playlists={playlistToRender}/>
      <HoursCounter playlists={playlistToRender}/>
      {playlistToRender.map(playlist =>
        <Playlist playlist={playlist} />
      )}
      </div> : <button onClick={() => {
        window.location = window.location.href.includes('localhost')
        ? 'http://localhost:8888/login'
        : 'https://naive-react-app-backend.herokuapp.com/login'}}
      style={btnStyle}>Sign in with spotify</button>
    }
    </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{...styleOne, display: 'inline-block', width: "25%"}}>
        <img src={playlist.imageURL} style={{width: '60px', height: '60px', padding: '12px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}



export default App;
