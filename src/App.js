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
    let songsToDisplay = this.props.playlists.reduce((songsToDisplay, playlists) => {
      return songsToDisplay.concat(playlists.songsToDisplay)
    }, [])
    let totalDuration = songsToDisplay.reduce((sum, song) => {
      console.log(song.duration);
      return sum + song.duration
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
    let playlists;
    let parsed = queryString.parse(window.location.search);
      let accessToken = parsed.access_token;
      if (!accessToken)
      return;
      console.log(accessToken);
      fetch('https://api.spotify.com/v1/me',{
        headers: {'authorization': `Bearer ${accessToken}`}
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
            user: {
                name: data.display_name,
              }
        });
      });

      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(playlistData => {
        console.log(playlistData.items);
        playlists = playlistData.items;
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {'Authorization': 'Bearer ' + accessToken}
          })
          let trackDataPromise = responsePromise
            .then(response => response.json())
          return trackDataPromise
        })
        let allTracksDataPromises =
          Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000,
                uri: trackData.uri.split(':')[2]
              }))
          })
          return playlists;
        })
        return playlistsPromise;
  })
      .then(playlists => {
          this.setState({
            playlists: playlists.map(item => {
              return {
                  name: item.name,
                  imageURL: item.images[0].url,
                  songsToDisplay: item.trackDatas.slice(0,3),
                  songs: item.trackDatas
              }
            }),
          });
      });
      console.log(playlists);

  }


  render() {
    let playlistsToRender =
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
      <PlaylistCounter playlists={playlistsToRender}/>
      <HoursCounter playlists={playlistsToRender}/>
      {playlistsToRender.map(playlist =>
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
  constructor() {
    super();
    this.state = {
        songAudioData: {
              danceability: 0,
              acousticness: 0,
              energy: 0,
              instrumentalness: 0,
              loudness: 0,
              valence: 0,
              bpm: 0
            },
      };
  }

  render() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    let playlist = this.props.playlist;
    let length = 7;
    playlist.songs.forEach((song, i) => {
      fetch(`https://api.spotify.com/v1/audio-features/${playlist.songs[i].uri}`,{
        headers: {'authorization': `Bearer ${accessToken}`}
      })
      .then(response => response.json())
      .then(data => {
      this.state.songAudioData.danceability += data.danceability;
      this.state.songAudioData.acousticness += data.acousticness;
      this.state.songAudioData.energy += data.energy;
      this.state.songAudioData.instrumentalness += data.instrumentalness;
      this.state.songAudioData.loudness += data.loudness;
      this.state.songAudioData.valence += data.valence;
      this.state.songAudioData.bpm +=  data.tempo;
      });
    });

    return (
      <div style={{...styleOne, display: 'inline-block',
      width: "100%", display: 'flex', 'justifyContent':'left'}}>
        <div>
        <img src={playlist.imageURL} style={{width: '120px', height: '120px', padding: '12px'}}/>
        <h3>{playlist.name}</h3>
        </div>
        <ul>
          {playlist.songsToDisplay.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}



export default App;
