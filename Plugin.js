
// Parameters list:

const cromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", 
"A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const keyboard = [
  ["E3", "F3", "F#3", "G3", "G#3"],
  ["B2", "C2", "C#2", "D2", "D#2"],
  ["G2", "G#2", "A2", "A#2", "B2"],
  ["D1", "D#1", "E2", "F2", "F#2"],
  ["A1", "A#1", "B1", "C1", "C#1"],
  ["E1", "F1", "F#1", "G1", "G#1"],
];

const majRule = [4, 7];
const minRule = [3, 7];
const dimRule = [3, 6];
const augRule = [5, 8];
const rule4 = 5;
const rule7 = 11;
const rule9 = 14;
let chordPieces = ["", "", ""];
let chord = "";
let progressionPieces = [];
let chordProgression = "";
let chordProgressionLength = 4;

// Close the dropdown menu that is already open and opens the clicked one
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function exitFunction(num) {
  if (document.getElementById("myDropdown1").classList.contains("show")) {
    document.getElementById("myDropdown1").classList.remove("show");
  }
  if (document.getElementById("myDropdown2").classList.contains("show")) {
    document.getElementById("myDropdown2").classList.remove("show");
  }
  if (document.getElementById("myDropdown3").classList.contains("show")) {
    document.getElementById("myDropdown3").classList.remove("show");
  }
  if (num == 1) {
    document.getElementById("myDropdown1").classList.toggle("show");
  }
  if (num == 2) {
    document.getElementById("myDropdown2").classList.toggle("show");
  }
  if (num == 3) {
    document.getElementById("myDropdown3").classList.toggle("show");
  }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function collectNote(input) {
  let noteclass = menuBar.getElementsByClassName("note");
  for (var i = 0; i < noteclass.length; i++) {
    if (input.toString() == noteclass[i].getAttribute("value")) {
      chordPieces[0] = input.toString();
    }
  }

  let modeclass = menuBar.getElementsByClassName("mode");
  for (var i = 0; i < modeclass.length; i++) {
    if (input.toString() == modeclass[i].getAttribute("value")) {
      chordPieces[1] = input.toString();
    }
  }

  let extensclass = menuBar.getElementsByClassName("extension");
  for (var i = 0; i < extensclass.length; i++) {
    if (input.toString() == extensclass[i].getAttribute("value")) {
      chordPieces[2] = input.toString();
    }
  }
  chord = chordPieces[0] + " " + chordPieces[1] + chordPieces[2];
  document.getElementById("chordValue").innerHTML = chord;

  var box = document.getElementById("chordBox");
  box.style.display = "inline-flex";
}

// Adds the chord to the sequence, reset the chord box and fills the sequence box
function AddChord() {
  chordProgression = "";
  if (
    document.getElementById("chordValue").innerHTML != " " &&
    chordPieces[0] != ""
  ) {
    if (chordPieces[1] == "") {
      chordPieces[1] = "Maj";
    }
    progressionPieces.push([chordPieces[0], chordPieces[1], chordPieces[2]]);
    if (progressionPieces.length > chordProgressionLength) {
      window.alert("Number of chords exceeded");
      progressionPieces.shift();
    }
  } else {
    window.alert("Invalid Chord: Please insert a Note for the chord.");
  }

  for (var i = 0; i < progressionPieces.length; i++) {
    for (var j = 0; j < progressionPieces[i].length; j++) {
      chordProgression =
        chordProgression.toString() + progressionPieces[i][j].toString();
    }
    if (i != progressionPieces.length - 1) {
      chordProgression = chordProgression.toString() + " - ";
    }
  }
  document.getElementById("chordProgression").innerHTML = chordProgression;
  chordPieces = ["", "", ""];
  document.getElementById("chordValue").innerHTML = "";
}

function RemoveChord() {
  progressionPieces.pop();
  chordProgression = "";
  if (progressionPieces.length == 0) {
    document.getElementById("chordProgression").innerHTML = "";
  } else {
    for (var i = 0; i < progressionPieces.length; i++) {
      for (var j = 0; j < progressionPieces[i].length; j++) {
        chordProgression =
          chordProgression.toString() + progressionPieces[i][j].toString();
      }
      if (i != progressionPieces.length - 1) {
        chordProgression = chordProgression.toString() + " - ";
      }
    }
    echo(progressionPieces);
    document.getElementById("chordProgression").innerHTML = chordProgression;

  }
}

function ClearChords(diagr) {
  if(progressionPieces.length>0){
  progressionPieces = [];
  document.getElementById("chordProgression").innerHTML = "";
  }
  //Erase all previous tab diagrams
  if (diagr) {
    document.getElementById("tabDisplay").innerHTML = "";
  }
  if(document.getElementById("toggleContainer").classList.contains("show")){
    document.getElementById("toggleContainer").classList.remove("show");
  }
  var box = document.getElementById("chordBox");
  box.style.display = "none";
}

////////////////////////////////// TAB GENERATION SECTION ////////////////////////////////

function GenerateTab() {
  let matches;
  let output = [];
  let tabPoints;
  let tabOutput = [];
  let accordi=[];
  let daje= [];
  //Erase all previous tab diagrams
  document.getElementById("tabDisplay").innerHTML = "";

  echo(progressionPieces);

  //Loop on the chord sequence
  for (var i = 0; i < progressionPieces.length; i++) {
    let voicing = [];
    let consideredChord = [];
    matches = [];
    //Generating chord using rules and chromatic scale
    consideredChord = GenerateChord((inputChord = progressionPieces[i]));
    echo(`Considered Chord: ${consideredChord}`);

    //For every note of the considered chord
    for (var h = 0; h < consideredChord.length; h++) {
      echo(`Nota considerata: ${consideredChord[h]}`);

      //For every string of the guitar collects all the matches
      for (var k = 0; k < keyboard.length; k++) {
        echo(`String considerata: ${keyboard[k]}`);
        if (keyboard[k].some((e) => e.includes(consideredChord[h]))) {
          echo("Match: ");
          echo(keyboard[k].findIndex(element => element.includes(consideredChord[h].toString())));
          matches.push({
            note: consideredChord[h],
            string: k,
            fret: keyboard[k].findIndex((element) =>
              element.includes(consideredChord[h].toString())
            ),
          });
        }
      }
    }
    echo(`Matches: ${JSON.stringify(matches)}`);
    //Loops until all the notes have been matched with a ergonomical tab
    while (voicing.length < consideredChord.length) {
      let left = null;
      let right = null;
      voicing = [];
      tabPoints = [];
      //For every note
      for (let m = 0; m < consideredChord.length; m++) {
        //For every match found
        for (let n = 0; n < matches.length; n++) {
          //If the match contains the considered note
          if (matches[n].note == consideredChord[m]) {
            //If the left variable contains a value and it is 1 string away
            if (left != null && matches[n].string == left - 1) {
              //Update left variable with the new value
              left = matches[n].string;
              //Removes the considered match so that it won't be considered in the following loops(in case this loops doesn't find an ergonomic voicing)
              voicing.push(keyboard[matches[n].string][matches[n].fret]);
              tabPoints.push({
                string: matches[n].string,
                fret: matches[n].fret,
              });
              //Ends the loop by assigning to n the lenght of the array
              n = matches.length;
            } else {
              if (right != null && matches[n].string == right + 1) {
                right = matches[n].string;
                voicing.push(keyboard[matches[n].string][matches[n].fret]);
                tabPoints.push({
                  string: matches[n].string,
                  fret: matches[n].fret,
                });
                n = matches.length;
              } else {
                if (left == null && left == null) {
                  left = matches[n].string;
                  right = matches[n].string;
                  voicing.push(keyboard[matches[n].string][matches[n].fret]);
                  tabPoints.push({
                    string: matches[n].string,
                    fret: matches[n].fret,
                  });
                  matches.splice(n, 1);
                  n = matches.length;
                }
              }
            }
          }
        }
      }
    }
    echo(`output parziale:${voicing}`);
    //Saving the voiving in the output variable
    output.push(voicing);
    tabOutput.push(tabPoints);


    accordi.push(output);
    
  }
  
 let daje_2;
  
  
  echo(`tabOutput: ${JSON.stringify(tabOutput)}`);
  echo(`diosborra output: ${JSON.stringify(accordi)}`);
  echo(`diosborroso output: ${JSON.stringify(accordi[0])}`);
  accordi=JSON.stringify(accordi);
  console.log(accordi);
  
  
  //////// Tab visualization section /////////////
  //For every chord in the output
  let text = '<div class="page"> ';
  for (let k = 0; k < tabOutput.length; k++) {
    text =
      text +
      '<div class="diagram-wrap"> ' +
      '<div class="diagram"> ' +
      '<h3 class="chordname">' +
      progressionPieces[k][0].toString();

    if (progressionPieces[k][1].toString() != "Maj")
      text = text + progressionPieces[k][1].toString();

    text = text + progressionPieces[k][2].toString() + "</h3>";

    //For each string
    for (let s = 0; s < 6; s++) {
      let label = false;
      if (s == 0) {
        text = text + '<div class="row first"> ';
      } else {
        if (s == 5) {
          text = text + '<div class="row last"> ';
        } else {
          text = text + '<div class="row"> ';
        }
      }
      text =
        text +
        '<div class="cell label"><div class="note stringname">' +
        keyboard[s][0].toString().slice(0, -1) +
        "</div></div> ";
      //For every single tab point
      let found = false;
      for (let g = 0; g < tabOutput[k].length; g++) {
        if (tabOutput[k][g].string == s) {
          found = true;
          //For every column of the output diagram (frets)
          for (let c = 0; c <= 4; c++) {
            if (tabOutput[k][g].fret == c) {
              if (c > 0) {
                text =
                  text +
                  '<div class="cell fret"><div class="blue note"></div></div> ';
              } else {
                if (!label) {
                  text =
                    text +
                    '<div class="cell label"><div class="note openstring">&#x25CB</div></div> ';
                  label = true;
                }
              }
            } else {
              if (!label) {
                text = text + '<div class="cell label"></div> ';
                label = true;
              }
              if (c > 0) {
                text = text + '<div class="cell fret"></div> ';
              }
            }
          }
          text = text + "</div> ";
        }
      }
      if (!found) {
        text =
          text +
          '<div class="cell label"><div class="note openstring">&times;</div></div> ' +
          '<div class="cell fret"></div> ' +
          '<div class="cell fret"></div> ' +
          '<div class="cell fret"></div> ' +
          '<div class="cell fret"></div> ' +
          "</div> ";
      }
    }
    text = text + "</div> </div>";
  }
  text = text + "</div> </div>";
  echo(text);
  document.getElementById("tabDisplay").insertAdjacentHTML("beforeend", text);
  //Shows display button
  document.getElementById("toggleContainer").classList.add("show");
  
  console.log(output,"gaetano_uno_di_noi")
  return output;
 
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function GenerateChord(inputChord) {
  let computedChord = [];
  //Select the starting note on the cromatic scale
  start = cromaticScale.indexOf(inputChord[0]);
  //Select the mode of the chord
  switch (inputChord[1].toString()) {
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
  computedChord.push(
    inputChord[0],
    cromaticScale[start + chosenRule[0]],
    cromaticScale[start + chosenRule[1]]
  );

  //If present, computes the variation of the chord
  if (inputChord[2] != "") {
    switch (inputChord[2].toString()) {
      case "4":
        computedChord[3] = cromaticScale[start + rule4];
        break;
      case "7":
        computedChord[3] = cromaticScale[start + rule7];
        break;
      case "9":
        computedChord[3] = cromaticScale[start + rule9];
        break;
    }
  }
  return computedChord;
}

function echo(toPrint) {
  console.log(toPrint);
}






/////////filippo


