import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import { Line, Circle } from 'rc-progress';

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

class ListeningData extends Component {
  constructor() {
    super();
  }
  componentDidMount() {

  }
  render() {
    let playlistsAudioData = []
    let playlists = this.props.playlists;
    let averages = {
          danceability: 0,
          energy: 0,
          loudness: 0,
          acousticness: 0,
          instrumentalness: 0,
          valence : 0,
          tempo : 0,
        };
    playlists.forEach((playlist, i) => {
      let keys;
       playlist.forEach((songData, j) => {
         if(songData){
           keys = Object.keys(songData);
           keys.forEach(key => {
             averages[key] += songData[key]
           });
        }
       })
       keys.forEach(key => {
          //get average of values
         averages[key] /= playlist.length;
       });
     });
    return (
      <div style={{width:'50%',padding:'24px'}}>
        <h2>danceability:{Math.floor(averages.danceability * 100)}</h2>
        <Line percent={Math.floor(averages.danceability * 100)} strokeWidth="4" trailWidth='4'
        trailColor='#b3b3b3' strokeColor="#800080"/>
        <h2>Energy:{Math.floor(averages.energy * 100)}</h2>
        <Line percent={Math.floor(averages.energy * 100)} strokeWidth="4" trailWidth='4'
        trailColor='#b3b3b3' strokeColor="rgb(220,20,60)"/>
        <h2>Loudness:{Math.floor((averages.loudness + 60) * (100/60))}</h2>
        <Line percent={Math.floor((averages.loudness + 60) * (100/60))} strokeWidth="4" trailWidth='4'
        trailColor='#b3b3b3' strokeColor="#000"/>
        <h2>Acousticness:{Math.floor(averages.acousticness * 100)}</h2>
        <Line percent={Math.floor(averages.acousticness * 100)} strokeWidth="4" trailWidth='4'
        trailColor='#b3b3b3' strokeColor="rgb(255,228,181)"/>
        <h2>Valence:{Math.floor(averages.valence * 100)}</h2>
        <Line percent={Math.floor(averages.valence * 100)} strokeWidth="4" trailWidth='4'
        trailColor='#b3b3b3' strokeColor="rgb(50,205,50)"/>
      </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let songsToDisplay = this.props.playlists.reduce((songsToDisplay, playlists) => {
      return songsToDisplay.concat(playlists.songsToDisplay)
    }, [])
    let totalDuration = songsToDisplay.reduce((sum, song) => {
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
    let getPlaylistData = playlistData => {
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
            if(playlists[i]){
              playlists[i].trackDatas = trackData.items
                .map(item => item.track)
                .map(trackData => ({
                  name: trackData.name,
                  duration: trackData.duration_ms / 1000,
                  uri: trackData.uri.split(':')[2]
                }))
            }
          })
          return playlists;

        })
        return playlistsPromise;
  }

    let playlists;
    let parsed = queryString.parse(window.location.search);
      let accessToken = parsed.access_token;
      if (!accessToken)
      return;
      fetch('https://api.spotify.com/v1/me',{
        headers: {'authorization': `Bearer ${accessToken}`}
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
            user: {
                name: data.display_name,
              }
        });
      });
      let audioDatas = [];
      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(getPlaylistData)
      .then(playlists => {
          let songUriArrays = playlists.map(item => {
            return item.trackDatas.map(trackData => {return trackData.uri;})
          })
          let allSongUriPromises = Promise.all(songUriArrays.map(songUris => {
              let songDatasPromise = fetch(`https://api.spotify.com/v1/audio-features/?ids=${
                songUris.slice(0,100).join(',') //only first 100 songs
              }`,{
                headers: {'authorization': `Bearer ${accessToken}`}
              }).then(res => res.json())
              return songDatasPromise
            })
          )
          return allSongUriPromises;
        })
        .then(audioDatas => {
          let audioFeatures = audioDatas.map(audioData => {
            let audioFeatures = audioData.audio_features.map(item => {
              if(item){
               return {
                 danceability: item.danceability,
                 energy: item.energy,
                 loudness:item.loudness,
                 acousticness: item.acousticness,
                 instrumentalness: item.instrumentalness,
                 valence : item.valence,
                 tempo : item.tempo,
               }
              }
             })
             return audioFeatures;
          })
            this.setState({
              playlists: playlists.map((item, i) => {
                return {
                    name: item.name,
                    imageURL: item.images[0].url,
                    songsToDisplay: item.trackDatas.slice(0,3),
                    songs: item.trackDatas,
                    audioFeatures: audioFeatures[i]
                }

              }),
            });
          })

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
      <ListeningData playlists={
        playlistsToRender.map(playlist=>{return playlist.audioFeatures
      })}/>
      {playlistsToRender.map((playlist, i) =>{
        return(
        <Playlist playlist={playlist} audioFeatures={playlist.audioFeatures} />
      )
      }
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
  constructor(props) {
    super(props);
    this.state = {
      averages: {
        danceability: 0,
        energy: 0,
        loudness: 0,
        acousticness: 0,
        instrumentalness: 0,
        valence : 0,
        tempo : 0,
      },
    };
  }
  componentWillMount(){
  //  console.log(this.props.playlists);
    //console.log(this.props.index);
    let audioFeatures = this.props.audioFeatures;
    console.log(audioFeatures);
    let keys;
    let averages = {
          danceability: 0,
          energy: 0,
          loudness: 0,
          acousticness: 0,
          instrumentalness: 0,
          valence : 0,
          tempo : 0,
    }
    audioFeatures.forEach((songData) => {
      if(songData){
        keys = Object.keys(songData);
        keys.forEach(key => {
          console.log(key, averages[key],songData[key])
          averages[key] += songData[key]
        });
     }
   });
   keys.forEach(key => {
        //get average of values
       averages[key] /= audioFeatures.length;
     });
   this.setState({
     averages: averages,
   })
  }
  render() {
    let playlist = this.props.playlist;
    let danceability = Math.floor(this.state.averages.danceability * 100),
      energy = Math.floor(this.state.averages.energy * 100),
      loudness = Math.floor((this.state.averages.loudness + 60) * (100/60)),
      acousticness = Math.floor(this.state.averages.acousticness * 100),
      valence = Math.floor(this.state.averages.valence * 100);
    return (
      <div>
        <h2>{playlist.name}</h2>
            <ul style={{width:'50%'}}>
            <li>{`danceability: ${danceability}`}</li>
            <li><Line percent={danceability} strokeWidth="4" trailWidth='4'
            trailColor='#b3b3b3' strokeColor="#800080"/></li>
            <li>{`energy: ${energy}`}</li>
            <li><Line percent={energy} strokeWidth="4" trailWidth='4'
            trailColor='#b3b3b3' strokeColor="rgb(220,20,60)"/></li>
            <li>{`loudness: ${loudness}`}</li>
            <li><Line percent={loudness} strokeWidth="4" trailWidth='4'
            trailColor='#b3b3b3' strokeColor="#000"/></li>
            <li>{`acousticness: ${acousticness}`}</li>
            <li><Line percent={acousticness} strokeWidth="4" trailWidth='4'
            trailColor='#b3b3b3' strokeColor="rgb(255,228,181)"/></li>
            <li>{`valence: ${valence}`}</li>
            <li><Line percent={valence} strokeWidth="4" trailWidth='4'
            trailColor='#b3b3b3' strokeColor="rgb(50,205,50)"/></li>
            </ul>
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
