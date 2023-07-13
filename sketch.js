let arr=[];
arr[arr.length]=12;

let arp=document.getElementById("arpeggio");
var output=[];

function genera_suoni()
{
    
for(i=0;i<output.length;i++){
  let accordo=output[i];
    let chord_1 = [];
    chord_1[0] = accordo[0];
    arpeggio.push(chord_1[0]);
    chord_1[1] = accordo[1];
    arpeggio.push(chord_1[1]);
    chord_1[2] = accordo[2];
    arpeggio.push(chord_1[2]);
    if(accordo.length>3){
    chord_1[3] = accordo[3];
    arpeggio.push(chord_1[3]);
    }
    chords.push(chord_1);
    
}

  console.log(chords)
}

function fai_cose(){
     output = GenerateTab();
    
  }
 

let gui;
let settings={
    volume:-1,
    reverb:0.5,
    decay:1,
    sustain:0.5,
    attack:0.1,
    release:1,
    delay:0.5,
    gain:0.9,
    textSize:100,
    distortion:0.9,
    tremolo_freq:500,
    tremolo_depth:1,//compreso tra 0 e 1
    vibrato_freq:4,
    //vibrato_freq ci sta bene fino 7-8 max
    vibrato_depth:0.1,//compreso tra 0 e 1
}


let arpeggio=[];
let ready = false;



let chords = [];



let poly;
let plucky;
let FFT; 


function setup() {
  createCanvas(windowWidth, windowHeight);
 

}

//-------------------------------------------------------
function initializeAudio() {
  Tone.Master.volume.value = settings.volume; 

  poly = new Tone.PolySynth(Tone.AMSynth, {
    envelope: {
      attack: settings.attack,
      decay:settings.decay,
      sustain:settings.sustain,
      release: settings.release
    }});
    plucky=new Tone.PolySynth();
  
  let gain=new Tone.Gain(settings.gain);
  
  gain.toDestination();
  poly.connect(gain);
  

  let delay = new Tone.FeedbackDelay("8n.", settings.delay);
  let dist = new Tone.Distortion(settings.distortion);
  let tremolo = new Tone.Tremolo(settings.tremolo_freq,settings.tremolo_depth);
  let reverb = new Tone.Reverb(settings.reverb);
  let vibrato=new Tone.Vibrato(settings.vibrato_freq,settings.vibrato_depth);
  let phaser = new Tone.Phaser({
	"frequency" : 15,
	"octaves" : 5,
	"baseFrequency" : 1000
});
let widener= new Tone.StereoWidener([0.5]);


  
    if(document.getElementById("distortion").checked){
      poly.connect(dist);
      dist.connect(gain);
    }
      poly.connect(delay);
      delay.connect(gain);
      if(document.getElementById("tremolo").checked==true){ 
        poly.connect(tremolo);
        tremolo.connect(gain);}
        if(document.getElementById("vibrato").checked==true){
          poly.connect(vibrato);
          vibrato.connect(gain);
        }
      
      if(document.getElementById("reverb")){
      poly.connect(reverb);
      reverb.connect(gain);
      }
      if(document.getElementById("phaser").checked==true){
        poly.connect(phaser);
        phaser.connect(gain);
      }
      if(document.getElementById("widener").checked==true){
        poly.connect(widener);
        widener.connect(gain);
      }
     
      
    
  

  FFT = new Tone.FFT(1024); // number of frequency bin: has to be a power of 2
  Tone.Master.connect(FFT);

 

  Tone.Transport.schedule(changeChord, "1");
  Tone.Transport.start();
  
   
}
//if( document.getElementById("arpeggiello").checked==true   ){a=2}
//else{a=1}
//-------------------------------------------------------

let currentChord = 0;








//function uncheck() {
//  document.getElementById("myCheck").checked = false;
// 
//}





 





//-------------------------------------------------------
function modulo(n, m) {
  return ((n % m) + m) % m;
}

//-------------------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//-------------------------------------------------------

var changeChord;

//-------------------------------------------------------
function fai_play() {
  
  if (!ready) {
    if(document.getElementById("arpeggio").checked){
      
      changeChord=function(time) {
           console.log(arpeggio,"uella")
            if(currentChord>=arpeggio.length){
                Tone.Transport.state == "paused";
            return;
        }
          let duration = 0.4 + "m";
          poly.triggerAttackRelease(arpeggio[currentChord], duration, time);
          console.log(arpeggio[currentChord])
          console.log(currentChord)
          currentChord++;
          Tone.Transport.schedule(changeChord, "+" + duration);
            }
        }
        else {
          changeChord=function(time) {
           console.log(chords,"uella")
            if(currentChord>=chords.length){
                Tone.Transport.state == "paused";
            return;
        }
          let duration = 1 + "m";
          poly.triggerAttackRelease(chords[currentChord], duration, time);
          console.log(chords[currentChord])
          console.log(currentChord)
          currentChord++;
          Tone.Transport.schedule(changeChord, "+" + duration);
            }  
        
        
            
    }
    genera_suoni();
    initializeAudio();
   
    ready = true;
  } else {
    // click again to start/stop...
    if (Tone.Transport.state == "paused") Tone.Transport.start();
    else if (Tone.Transport.state == "started") Tone.Transport.pause();
  }
}