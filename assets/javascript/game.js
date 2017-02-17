$(document).ready(function() {
    // Only characters allowed to use as valid inputs.
    var regletters = /^[A-Za-z]+$/;

    var wrongAudio = document.createElement("AUDIO");  // audio for wrong guess
    wrongAudio.setAttribute("src", "assets/audio/multimedia_retro_game_gun_shot.mp3");

    var rightAudio = document.createElement("AUDIO");  // audio for correct guess
    rightAudio.setAttribute("src", "assets/audio/bell_small_001.mp3");

    var loseAudio = document.createElement("AUDIO");  // audio when game is lost
    loseAudio.setAttribute("src", "assets/audio/zapsplat_multimedia_game_lose_negative_003.mp3");

    var winAudio = document.createElement("AUDIO");   // audio when game is won
    winAudio.setAttribute("src", "assets/audio/zapsplat_multimedia_game_one_up_extra_life_005.mp3");

    // letters to create buttons
    var letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];


    var pokerTerms = {
        wins:  0,
        losses:  0,
        livesRemaining: 0,
        displayArray: [],
        lettersUsed: [],
        targetWord: "",
        targetWordArray: [],
        isCorrect: false,
        gameEnded: false,
        termsList: ['straight', 'flush', 'ace in the hole', 'dealer', 'blinds', 'bad beat', 'big blind', 'small blind', 'donkey', 'heads up',
        'pocket rockets', 'raise', 'the nuts', 'royal flush', 'kicker', 'gutshot', 'under the gun', 'short stack', 'side pot', 'straddle',
        'bluff', 'backdoor', 'check raise', 'counterfeit', 'family pot', 'free roll', 'hole cards', 'inside straight draw',
        'jackpot', 'overpair', 'pocket pair', 'pot odds', 'pot limit', 'runner runner', 'short stack', 'smooth call', 'string bet',
        'suited', 'full house'],
        stickImages: ['assets/images/hangman10.png',
                      'assets/images/hangman8.png',
                      'assets/images/hangman7.png',
                      'assets/images/hangman6.png',
                      'assets/images/hangman5.png',
                      'assets/images/hangman4.png',
                      'assets/images/hangman3.png',
                      'assets/images/hangman2.png',
                      'assets/images/hangman1.png',
                      'assets/images/hangman0.png'],


        //$("#picture").attr("src", "assets/images/eighty.png");
        //<img class="img-responsive center-block" src="assets/images/eighty.png" id="picture">

        //picks term from the list
        selectTerm: function() {
            this.targetWordArray = [];
            this.targetWord = this.selectRandomWord();  // select random word
            this.targetWordArray = this.targetWord.split("");
            console.log(this.targetWordArray);

            // reset all the fields
            this.displayArray = [];
            this.lettersUsed = [];
            this.livesRemaining = 10;
            this.gameEnded = false; // reset
            //update the blanks on display word
            this.displayArray = this.updateDisplayArray("_");

            // set initial values
            $("#wins").html(this.wins);
            $("#losses").html(this.losses);
            $("#livesRemaining").html(this.livesRemaining);
            $("#guess-word").html(this.displayArray.join(" ").replace(/\^/gi, "&nbsp" ));
            $("#letters-used").html(this.lettersUsed.join(" "));
            $("#start-message").show()
                               .text("Press a letter key to start");
            $("#message").hide();
            $("#hangman_images").attr("src", "");
            //this.createLetterBtns();
        },

        selectRandomWord: function(){
            return this.termsList[Math.floor(Math.random() * this.termsList.length)].toUpperCase();
        },

        updateDisplayArray: function(letter){
            var displayArray = this.displayArray;
            // if underscore is passed, initialize display word with underscores
            if(letter === "_"){
                $.each(this.targetWordArray, function(index, value) {
                    if (value !== " ") {
                        displayArray.push("_");
                    }  else {
                        displayArray.push("^");
                    }
                });
            }
            else {
                $.each(this.targetWordArray, function(index, value){
                    if (value === letter){
                        displayArray[index] = letter;
                    }
                });
            }
            return displayArray;

        },

        createLetterBtns: function(){
            $.each(letters, function (index, letter){
                $("<button>")
                    .addClass('letter-button letter letter-button-color')
                    .data('letter', letter)
                    .text(letter)
                    .appendTo("#buttons");
                console.log('letters', index, letter);
            });
        },



        validateInput: function(userInput){
            // check if need to start a new game
            if(this.gameEnded === true){
                this.selectTerm();
            }
            else{
                // check if it's a valid letter
                if(regletters.test(userInput)){
                    // check if letter was already selected
                    userInput = userInput.toUpperCase();
                    if (this.lettersUsed.indexOf(userInput) == -1 ) {
                        // letter was not used. add to list of used letters
                        this.lettersUsed.push(userInput);

                        if (this.targetWord.indexOf(userInput) != -1) {
                            // console.log("Correct");
                            this.displayArray = this.updateDisplayArray(userInput);
                            rightAudio.play();
                            this.isCorrect = true;
                        }
                        else {
                            // console.log("Wrong");
                            this.livesRemaining -= 1;
                            wrongAudio.play();
                            this.isCorrect = false;
                        }

                        this.refreshRound(this.isCorrect);
                    }
                }
            }
        },

        refreshRound: function(isCorrect){
            if (isCorrect) {
                $("#guess-word").html(this.displayArray.join(" ").replace(/\^/gi, "&nbsp" ));
            }
            else {
                $("#livesRemaining").html(this.livesRemaining);
                $("#hangman_images").attr("src", this.stickImages[this.livesRemaining]);
            }

            $("#letters-used").html(this.lettersUsed.join(" "));

            // check if the word was guessed
            var a = this.displayArray.indexOf("_");
            if (a < 0){
                    this.endRound(true);
            }
            else if (this.livesRemaining == 0) {
                    this.endRound(false);
            }
        },


        endRound: function(winlose){
            if(winlose){
                this.wins += 1;
                winAudio.play();
                $("#message").show()
                             .html("YOU WIN!");
            }
            else{
                this.losses += 1;
                loseAudio.play();
                $("#message").show()
                             .html("YOU LOSE!");
                alert("Correct word is " + this.targetWord);
            }
            this.gameEnded = true;
            $("#start-message").show()
                               .text("Press any key to start");
            $("#WINS").html(this.wins);
            $("#losses").html(this.losses);
        }

    };

    // get new word and start game
    pokerTerms.selectTerm();

    pokerTerms.createLetterBtns();

    //pushing a button or pressing a letter activates validateInput
    $(".letter-button").on('click', function() {
        $("#start-message").hide();
        //console.log($(this).data('letter'));
        pokerTerms.validateInput($(this).data('letter'));
    });

    document.onkeyup = function (event) {
        console.log(event.key);
        if(event.keyCode >= 65 && event.keyCode <= 90){
            $("#start-message").hide();
            pokerTerms.validateInput(event.key);
        };
    };
});