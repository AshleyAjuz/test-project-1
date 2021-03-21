// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];// Start off with an empty array
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter=0;
var trials=0; //Will store how many times the user has messed up the sequence
var Timer; 


//Create a function for starting the game
function startGame(){
  
  //fill the pattern array with 8 random numbers between 1 and 6
  for(var x=0; x<8; x++)
  {
      pattern[x]=Math.floor((Math.random()*6)+1);
  } 
    //initialize game variables
    progress = 0;
    gamePlaying = true;
   trials=0;
  document.getElementById("Trials").innerHTML="Trials: "+trials;

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

//Create a function for stoping the game
function stopGame(){
  //Set gamePlaying variable back to false and trials back to 0
    gamePlaying = false;
    trials=0;
   document.getElementById("Trials").innerHTML="Trials: "+trials;
 
// swap the Start and Stop buttons
document.getElementById("startBtn").classList.remove("hidden");
document.getElementById("stopBtn").classList.add("hidden");
 
 //Stop Timer 
 clearInterval(Timer);
 document.getElementById("timer").innerHTML = " ";
}

//Create functions for lighting and clearing the button
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

//Function for playing a single block
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

//Function for playing a sequency of blocks
function playClueSequence(){
  //At the beginning of play sequence stop the timer
  clearInterval(Timer);
  document.getElementById("timer").innerHTML = " ";
  
  guessCounter=0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime; //Maybe try and get rid of this
    delay += cluePauseTime;
  }
  
  //After the first round, a timer will start
  //If the user does not finish the sequence in time, then they lose that round
  //The setTimeout function starts the timer after the playCube sequence finishes
  if(progress>0 && gamePlaying==true)
  {
     setTimeout(function(){
      var timeleft = 10;
      Timer = setInterval(function(){
      if(timeleft <= 0 ){
      {
        clearInterval(Timer);
        document.getElementById("timer").innerHTML = " ";
        loseGame(); 
      }

    }//end of first nested if statement
    else {
      document.getElementById("timer").innerHTML = timeleft + " seconds remaining";
    }

      timeleft-=1;
    },1000);
  
      }, delay); //end of setTimeout function
    }//end of outer if statement
  
}

function checkTrials()
{
  if(trials==3)
   { 
     document.getElementById("Trials").innerHTML="Trials: "+trials;
     loseGame(); //If the user reaches 3 tries, they lose the game
   } //end of if statement
  else
    {
      document.getElementById("Trials").innerHTML="Trials: "+trials;
      playClueSequence(); //otherwise, replay the sequence
    }//end of statement
}

//Function for if the user loses the game
function loseGame(){
  clearInterval(Timer);
  trials=0;
  stopGame();
  alert("Game Over. You lost.");
}

//Function for if the user wins the game
function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

//Create the guess function
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  //Check if guess is correct
  if(pattern[guessCounter]==btn)
  {
    //Check to see if turn is over 
    if(guessCounter==progress)
    {
        //Finally, check to see if this is the last turn
        if(progress==pattern.length-1)
        {
            //Call winGame function
             winGame();
        }//end of second nested if statement
        
        else
        {
          progress++; //Increment progress
          playClueSequence(); //Call playClueSequence function
        }//end of second nested else statement
    }//end of first nested if statement
    else
    {
       guessCounter++; //Increment counter 
    }//end of first nested else statement
     
  }//end of outer if statement
  else
  {
    
    //Increment trials
      trials++;
    //Call the checkTrials function
      checkTrials();
      
      
  }//end of outer else statement
  
}//end of guess function

// Sound Synthesis Functions
const freqMap = {
  1: 440, //(A)
  2: 493.9, //(B)
  3: 261.6, //(C)
  4: 392.3, //(G)
  5: 329.6, //(E)
  6: 349.2 //(F)
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


