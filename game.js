
var game = {
  npc: true, // if true, npc will be created
  board: [
    "", "", "",
    "", "", "",
    "", "", ""
  ],
  counter: "",
  tics: "",
  humLett: "",
  npcLett: ""
}
var circle = '<div class="box box-o"><div class="circle"></div></div>';
var cross = '<div class="box box-x"><hr class="rotate-left" /><hr class="rotate-right" /></div>';
function toggleDisplay(element){
  element.classList.toggle("hidden");
}
function fade(elem){
  elem.style.visibility = elem.style.visibility=="hidden" ? "" : "hidden";
  elem.style.opacity = elem.style.opacity=="0" ? "" : "0";
}
window.onload = function main() {
  var gameTypes = document.getElementsByClassName("type-choice");
  for (let i=0; i<gameTypes.length; i++){
    gameTypes[i].addEventListener("click", selectType, false);
  }

  var choices = document.getElementsByClassName("choice");
  for (let i=0; i<choices.length; i++) {
    choices[i].addEventListener("click", startGame, false);
  }
  function selectType(){
    for (let j=0; j<gameTypes.length; j++){
      gameTypes[j].classList.toggle("highlighted");
    }
    var toggles = document.getElementsByClassName("toggle");
    for (let j=0; j<toggles.length; j++){
      toggleDisplay(toggles[j]);
    }
  }
}
function startGame() {
  game.tics = document.getElementsByClassName("tic");
  for (let j=0; j<game.tics.length; j++) {
    game.tics[j].innerHTML = "";
  }
  for (let k=0; k<game.board.length; k++) {
    game.board[k] = "";
  }
  game.counter = 0;
  var param = this.id=="choice-x" ? "x" : "o";
  fade(document.getElementById("overlay"));
  game.npc = this.id=="start" ? false : true;
  console.log(this.id);
  play(param);
}
function finishGame(b) {
  game.tics.forEach(function(val) {
    document.getElementById(val).removeEventListener("click", humMove, false);
  });
  var result = gameOver(b);
  if (result==game.humLett) {
    // highlight the winner blue
    var arr = document.getElementsByClassName("box-" + game.humLett);
    for (let i=0; i<arr.length; i++) {
      arr[i].className += " win-border";
    }
    document.getElementById("result-message").textContent = game.npc ? "You win" : game.humLett + " wins";
  } else if (result==game.npcLett) {
    // highlight the winner red
    var arr = document.getElementsByClassName("box-" + game.npcLett);
    for (let i=0; i<arr.length; i++) {
      arr[i].className += " lose-border";
    }
    document.getElementById("result-message").textContent = game.npc ? "You lose" : game.humLett + " wins";
  } else {
    document.getElementById("result-message").textContent = "Draw";
  }
  setTimeout(function(){fade(document.getElementById("overlay"));}, 1000);
}
// DETERMINE OUTCOME OF GAME (STATE)
function gameOver(b) {
  if (b[0] == b[1] && b[0] == b[2] && b[0] == "x" ||
    b[3] == b[4] && b[3] == b[5] && b[3] == "x" ||
    b[6] == b[7] && b[6] == b[8] && b[6] == "x" ||
    b[0] == b[3] && b[0] == b[6] && b[0] == "x" ||
    b[1] == b[4] && b[1] == b[7] && b[1] == "x" ||
    b[2] == b[5] && b[2] == b[8] && b[2] == "x" ||
    b[0] == b[4] && b[0] == b[8] && b[0] == "x" ||
    b[2] == b[4] && b[2] == b[6] && b[2] == "x") {
    return "x";
  } else if (b[0] == b[1] && b[0] == b[2] && b[0] == "o" ||
    b[3] == b[4] && b[3] == b[5] && b[3] == "o" ||
    b[6] == b[7] && b[6] == b[8] && b[6] == "o" ||
    b[0] == b[3] && b[0] == b[6] && b[0] == "o" ||
    b[1] == b[4] && b[1] == b[7] && b[1] == "o" ||
    b[2] == b[5] && b[2] == b[8] && b[2] == "o" ||
    b[0] == b[4] && b[0] == b[8] && b[0] == "o" ||
    b[2] == b[4] && b[2] == b[6] && b[2] == "o") {
    return "o";
  } else if (!b.includes("")) {
    return "draw";
  } else {
    return false;
  }
}
function humMove() {
  if (game.npc) {
    if ((game.humLett == "x" && game.counter % 2 == 0) || (game.humLett == "o" && game.counter % 2 == 1)) {
      humPlay(game.humLett, this);
    }
  } else {
    game.humLett = game.counter%2==0 ? "x" : "o";
    humPlay(game.humLett, this);
  }
}
function humPlay(letter, elem) {
  elem.innerHTML = letter=="x" ? cross : circle;
  game.board[elem.id] = letter;
  if (gameOver(game.board)) {
    finishGame(game.board);
    return;
  }
  elem.removeEventListener("click", humMove, false);
  game.counter++;
  if (game.npc){
    var delay = game.counter==1 ? 0 : 500;
    setTimeout(game.npc.makeMove, delay);
  }
}
function play(choice) {
  // DECIDE VS HUM OR VS AI, THEN CHOOSE TOKEN
  game.humLett = choice;
  game.npcLett = game.humLett=="x" ? "o" : "x";
  game.tics = getMoves(game.board);

  var makeNPC = function createNPC(letter) {

    var token = letter;

    function makeMove() {
      var tic;

      if (getMoves(game.board).length == 9) {
        tic = Math.floor(Math.random() * 9);
        mark(tic);
      } else if (getMoves(game.board).length == 8) {
        tic = makeMoveTwo(getMoves(game.board));
        setTimeout(function(){
          mark(tic);
        }, 500);
      } else {
        tic = typeof mapStates(game.board) == "object" ? mapStates(game.board).index : mapStates(game.board);
        mark(tic);
      }
      function mark(letter) {
        var t = document.getElementById(tic);
        t.removeEventListener("click", humMove, false);
        t.innerHTML = token=="x" ? cross : circle;
        game.board[tic] = token;
      }
      // if just played winning move
      if (gameOver(game.board)) {
        finishGame(game.board);
        return;
      }
      function makeMoveTwo(arr){
        // prioritize center, then corner, then edge
        if (arr.includes(4)){ return 4; }
        else if (arr.includes(0)) { return 0; }
        else if (arr.includes(2)) { return 2; }
        else if (arr.includes(6)) { return 6; }
        else if (arr.includes(8)) { return 8; }
      }
      game.counter++;
      // FOLLOW EACH GAME STATE TO THE END THEN RETURN OUTCOME
      function mapStates(b) {
        var moves = [];
        var possMoves = getMoves(b);
        if (gameOver(b) || possMoves.length == 0) {
          return scoreGame(gameOver(b)); // 10, 0, or -10
        }
        for (let i = 0; i < possMoves.length; i++) {
          let move = {};
          let state = b.slice();
          state[possMoves[i]] = possMoves.length % 2 == 1 ? "x" : "o";
          move.index = (possMoves[i]);
          move.score = typeof mapStates(state) == "object" ? mapStates(state).score : mapStates(state);
          moves.push(move);
        }
        // CHOOSING THE MOVE MUST DEPEND ON WHOSE TURN IT IS IN THE SIM, IE possMoves.length
        var num = token == "x" ? 0 : 1;
        if (possMoves.length % 2 == num) { // then it is 'x' turn, so they'd pick the lowest score
          let bestScore = moves[0].score;
          let choice = 0;
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
              bestScore = moves[i].score;
              choice = i;
            }
          }
          return moves[choice];
        } else { // then it is 'o' turn, so they'd pick the highest
          let bestScore = moves[0].score;
          let choice = 0;
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
              bestScore = moves[i].score;
              choice = i;
            }
          }
          return moves[choice];
        }
      }
    }
    return {
      makeMove: makeMove
    };
  }

  // GET POSSIBLE MOVES IN FORM OF ARRAY OF EMPTY SPOTS
  function getMoves(b) {
    var a = [];
    b.forEach(function(val, ind) {
      if (val=="") {
        a.push(ind);
      }
    });
    return a;
  }

  function scoreGame(result) {
    switch (result) {
      case "x":
        return game.counter % 2 == 0 ? 10 : -10; // if x would win and global counter is "x", return positive score
      case "o":
        return game.counter % 2 == 0 ? -10 : 10; // if o would win and global counter is "o", return positive score
      default:
        return 0;
    }
  }
  if (game.npc) {
    game.npc = makeNPC(game.npcLett);
  }

  game.tics.forEach(function(val) {
    document.getElementById(val).addEventListener("click", humMove, false);
  });
  if (game.npcLett == "x" && game.counter == 0) {
    setTimeout(game.npc.makeMove, 1000);
  }
}
