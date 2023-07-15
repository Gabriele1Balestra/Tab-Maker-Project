let output;
let ga=true;
let chords=[];
let poly;
let settings = {
  volume: -1,
  Reverb: 0.5,
  decay: 1,
  sustain: 0.5,
  attack: 0.1,
  release: 1,
  Delay: 0.5,
  gain: 0.9,
  textSize: 100,
  Distortion: 0.9,
  Tremolo_freq: 500,
  Tremolo_depth: 1, //compreso tra 0 e 1
  Vibrato_freq: 4,
  //Vibrato_freq ci sta bene fino 7-8 max
  Vibrato_depth: 0.1, //compreso tra 0 e 1
};
let Arpeggio = [];

function genera_suoni() {
  
  for (let i = 0; i < output.length; i++) {
    let accordo = output[i];
    let chord_1 = [];
    chord_1[0] = accordo[0];
    Arpeggio.push(chord_1[0]);
    chord_1[1] = accordo[1];
    Arpeggio.push(chord_1[1]);
    chord_1[2] = accordo[2];
    Arpeggio.push(chord_1[2]);
    if (accordo.length > 3) {
      chord_1[3] = accordo[3];
      Arpeggio.push(chord_1[3]);
    }
    chords.push(chord_1);
  }
  echo("dio maiale")
  echo(chords)
}

function launch_GenerateTab() {
  output = GenerateTab();
}

//-------------------------------------------------------
function initializeAudio() {

  Tone.Master.volume.value = settings.volume;

  poly = new Tone.PolySynth(Tone.AMSynth, {
    envelope: {
      attack: settings.attack,
      decay: settings.decay,
      sustain: settings.sustain,
      release: settings.release,
    },
  });

  let gain = new Tone.Gain(settings.gain);

  gain.toDestination();
  poly.connect(gain);

  if (document.getElementById("Distortion").checked) {
    let dist = new Tone.Distortion(settings.Distortion);
    poly.connect(dist);
    dist.connect(gain);
  }
  if (document.getElementById("Delay").checked) {
    let Delay = new Tone.FeedbackDelay("8n.", settings.Delay);
    poly.connect(Delay);
    Delay.connect(gain);
  }
  if (document.getElementById("Tremolo").checked == true) {
    let Tremolo = new Tone.Tremolo(
      settings.Tremolo_freq,
      settings.Tremolo_depth
    );
    poly.connect(Tremolo);
    Tremolo.connect(gain);
  }
  if (document.getElementById("Vibrato").checked == true) {
    let Vibrato = new Tone.Vibrato(
      settings.Vibrato_freq,
      settings.Vibrato_depth
    );
    poly.connect(Vibrato);
    Vibrato.connect(gain);
  }
  if (document.getElementById("Reverb")) {
    let Reverb = new Tone.Reverb(settings.Reverb);
    poly.connect(Reverb);
    Reverb.connect(gain);
  }
  if (document.getElementById("Phaser").checked == true) {
    let Phaser = new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
    });
    poly.connect(Phaser);
    Phaser.connect(gain);
  }
  if (document.getElementById("Widener").checked == true) {
    let Widener = new Tone.StereoWidener([0.5]);
    poly.connect(Widener);
    Widener.connect(gain);
  }
 

  Tone.Transport.schedule(changeChord,0.5 + "m");
  Tone.Transport.stop();
  
  Tone.Transport.start();
  echo("dajee")
  echo(chords[currentChord])
}
function timeRefresh(time) {
  setTimeout("location.reload();", time);
}

//-------------------------------------------------------

var changeChord;
let currentChord;
currentChord=0;
let duration_chords = 0.8 + "m";
let duration_arpeggio = 0.5 + "m";
function play() {
   chords = [];
    Arpeggio = [];
    currentChord=0;   
  
  
  echo("Arpeggio")
  echo(Arpeggio)
  echo("Output")
  echo(output)
  echo("chords")
  echo(chords)
  
  echo("maddona lurida")
   
  genera_suoni(); 

  if (document.getElementById("Arpeggio").checked) {
    changeChord = function (time) {
      if (currentChord >= Arpeggio.length) {
        Tone.Transport.cancel();
        
        return;
      }
      
      
      Tone.Transport.schedule(changeChord, "+" + duration_arpeggio);
      poly.triggerAttackRelease(Arpeggio[currentChord], duration_arpeggio, time);
      
      
    
      currentChord++;
      
  echo(output)
    };
  } else {
    
    changeChord = function (time) {
      if (currentChord >= chords.length) {
        Tone.Transport.cancel();
      
        return;
      }

      
      Tone.Transport.schedule(changeChord, "+" + duration_chords);
      echo("jalluca")
      echo(currentChord)
      
      poly.triggerAttackRelease(chords[currentChord], duration_chords, time);
     currentChord++;
      
  
  
      
      echo("accordi suonati")
      echo(chords[currentChord])
    
    };
  }

   initializeAudio();

   //setInterval(timeRefresh,5000)
 // poly.triggerAttackRelease("C4", "8n");


}
