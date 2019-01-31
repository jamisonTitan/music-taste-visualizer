
export default function sketch (p) {
  let noisex, noisey;
  let xoff = 0, yoff = 0;
  let data;
  let repeat = 4;
  let width = 300, height = width;
  let first = true;
  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if(props.data){
      data=props.data;
      if(props.width){
        width = props.width; height = props.height;
      }
    }
}
  const drawShape = () => {
    if(data){
      p.rect((noisex * width) * (Math.random() * 2) , (noisey * height) * (Math.random() * 2)
       , width * 0.02 * (noisex + 1),height * 0.02 * (noisey +1), data.valence / 5);
    }
  }
  p.setup = function () {
    p.createCanvas(width, height);
  };

  p.draw = function () {
     if(data){
        //the lower the acousticness the more opaque the stroke
        p.stroke((data.acousticness * (255 / 100) + 10));
        if(first){
          p.background(data.loudness * (255 / 100));
          first = false;
        }
        p.noiseDetail(data.energy, data.energy / 100);
        if(p.mouseY > -100 && p.mouseY < height + 100){
          for(let i = 0; i < data.danceability * repeat;i++){
            xoff+=0.01;
            yoff+=0.1;
            noisex = p.noise(xoff);
            noisey = p.noise(yoff + data.energy / 5);
            p.fill(128,0,128,data.energy * (255/100));
            console.log('wtf')
            drawShape();
          }
          noisex=0;
          noisey=0;
          for(let i = 0; i < data.energy * repeat;i++){
            xoff+=0.01;
            yoff+=0.1;
            noisex = p.noise(xoff);
            noisey = p.noise(yoff + data.energy / 5);
            p.fill(220,20,60, data.energy * (255/100));
            drawShape();
          }
          noisex=0;
          noisey=0;
          for(let i = 0; i < (100 - data.loudness);i++){
            xoff+=0.01;
            yoff+=0.1;
            noisex = p.noise(xoff);
            noisey = p.noise(yoff + data.energy / 5);
            p.fill(0,0,0);
            drawShape();
          }
          noisex=0;
          noisey=0;
          for(let i = 0; i < data.acousticness;i++){
            xoff+=0.01;
            yoff+=0.1;
            noisex = p.noise(xoff);
            noisey = p.noise(yoff + data.energy / 5);
            p.fill(100,149,237, data.energy * (255/100));
            drawShape();
          }
          noisex=0;
          noisey=0;
          for(let i = 0; i < data.valence;i++){
            xoff+=0.01;
            yoff+=0.1;
            noisex = p.noise(xoff);
            noisey = p.noise(yoff + data.energy / 5);
            p.fill(50,205,50, data.energy * (255/100));
            drawShape();
        }
      }
    }
  };
}
