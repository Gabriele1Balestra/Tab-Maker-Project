/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
// Parameters list:


const cromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const keyboard = [
["E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C3", "C#3", "D3", "D#3"],
["B2", "C2", "C#2", "D2", "D#2", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3"],
["G2", "G#2", "A2", "A#2", "B2", "C2", "C#2", "D2", "D#2", "E3", "F3", "F#3"],
["D1", "D#1", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C2", "C#2"],
["A1", "A#1", "B1", "C1", "C#1", "D1", "D#1", "E2", "F2", "F#2", "G2", "G#2"],
["E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", "C1", "C#1", "D1", "D#1"]
]; 

const majRule = [4, 7];
const minRule = [3, 7];
const dimRule = [3, 6];
const augRule = [5, 8];
let chordPieces = ["", "", ""];
let chord ="";
let progressionPieces = [];
let chordProgression = "";
let chordProgressionLength = 4;
let numCicli = 10;
let computedChord = ["", "", "", ""];

// Close the dropdown menu that is already open and opens the clicked one
function exitFunction(num) {
  if(document.getElementById("myDropdown1").classList.contains("show")){document.getElementById("myDropdown1").classList.remove("show");}
  if(document.getElementById("myDropdown2").classList.contains("show")){document.getElementById("myDropdown2").classList.remove("show");}
  if(document.getElementById("myDropdown3").classList.contains("show")){document.getElementById("myDropdown3").classList.remove("show");}
  if(num==1){document.getElementById("myDropdown1").classList.toggle("show");}
  if(num==2){document.getElementById("myDropdown2").classList.toggle("show");}
  if(num==3){document.getElementById("myDropdown3").classList.toggle("show");}
}
  

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
} 


function collectNote(input) {
  let noteclass = menuBar.getElementsByClassName("note")
  for(var i=0; i<noteclass.length; i++){
    if(input.toString() == noteclass[i].getAttribute("value")){ chordPieces[0] =input.toString()}
  }

  let modeclass = menuBar.getElementsByClassName("mode")
  for(var i=0; i<modeclass.length; i++){
    if(input.toString() == modeclass[i].getAttribute("value")){ chordPieces[1] =input.toString()}
  }

  let extensclass = menuBar.getElementsByClassName("extension")
  for(var i=0; i<extensclass.length; i++){
    if(input.toString() == extensclass[i].getAttribute("value")){ chordPieces[2] =input.toString()}
  }
  chord = chordPieces[0] + " " + chordPieces[1] + chordPieces[2]
  document.getElementById("chordValue").innerHTML = chord;
}

// Adds the chord to the sequence, reset the chord box and fills the sequence box
function AddChord(){
chordProgression = "";
 if(document.getElementById("chordValue").innerHTML != " " && chordPieces[0]!=""){
   if(chordPieces[1] == ""){chordPieces[1] = 'Maj'}
  progressionPieces.push([chordPieces[0], chordPieces[1], chordPieces[2]]);
  if(progressionPieces.length > chordProgressionLength){
    window.alert("Number of chords exceeded");
    progressionPieces.shift();
  }
 } else { window.alert("Invalid Chord"); }

 for(var i = 0; i < progressionPieces.length; i++){
    for(var j = 0; j < progressionPieces[i].length; j++){
      chordProgression = chordProgression.toString() + progressionPieces[i][j].toString();
    }
    if(i != progressionPieces.length-1){
     chordProgression = chordProgression.toString() + " - ";
    }
  }
 document.getElementById("chordProgression").innerHTML = chordProgression;
 chordPieces = ["", "", ""];
 document.getElementById("chordValue").innerHTML = "";
}

function RemoveChord(){
  progressionPieces.pop();
  chordProgression = "";
  if(progressionPieces.length == 0){
    document.getElementById("chordProgression").innerHTML = "";
  }else{
    for(var i = 0; i < progressionPieces.length; i++){
      for(var j = 0; j < progressionPieces[i].length; j++){
        chordProgression = chordProgression.toString() + progressionPieces[i][j].toString();
      }
      if(i != progressionPieces.length-1){
       chordProgression = chordProgression.toString() + " - ";
      }
    }
    //console.log(progressionPieces);
   document.getElementById("chordProgression").innerHTML = chordProgression;
  }
}

function ClearChords(){
  progressionPieces = [];
  document.getElementById("chordProgression").innerHTML = "";
}

////////////////////////////////// TAB GENERATION SECTION ////////////////////////////////


function GenerateTab(){
  //Loop for the iterations of the computation algoithm 
  for(var ciclo = 0; ciclo < numCicli; ciclo ++){
    //Loop on the chord sequence
    for(var i = 0; i<progressionPieces.length; i++){
      //Condition valid only for the first computation of the first chord
      if(i == 0 && ciclo == 0){GenerateChord(ciclo = ciclo, chord1 = progressionPieces[i] )}
      //GenerateChord(chord1 = progressionPieces[i], chord0 = progressionPieces[i-1], ciclo = ciclo);
    }
  }
}

function GenerateChord(ciclo, chord1, chord0){
  // Initial chord generation
  if(chord0 == undefined){
    //Select the starting note on the cromatic scale
    start = cromaticScale. indexOf(chord1[0]);
    //Select the mode of the chord
    switch(chord1[1].toString()){
      case "Maj": 
      chosenRule = majRule;
      break;
      case "min": 
      chosenRule = minRule;
      break;
      case "dim": 
      chosenRule = dimRule;
      break;
      case "aug": 
      chosenRule = augRule;
      break;
    }
    computedChord[0] = chord1[0];
    computedChord[1] = cromaticScale[start + chosenRule[0]];
    computedChord[2] = cromaticScale[start + chosenRule[1]];
    //If present, computes the variation of the chord
    switch(chord1[2]){
      case '7': 
      computedChord[3] = cromaticScale[parseInt(chord1[2].toString()) + start + 4];
      break;
      case '9':
      computedChord[3] = cromaticScale[parseInt(chord1[2].toString()) + start + 5];
      break;
    }
    return(computedChord);
  } else {
    
  }
}
