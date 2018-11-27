//todo

//todo: move script and css to different files
//todo: checkbox not ugly, like songsearcher using fontawesome
//todo: bargraph for odds?
//todo: display only difficult cases

//later: basic rules of blackjack explained modal. like wiki
//later: cheatcard modal. highlight your hand in cheatcard. like bottom of this: https://wizardofodds.com/games/blackjack/appendix/1/
//later: odds on each hand modal. highlight hand in table. like this: https://wizardofodds.com/games/blackjack/appendix/1/
//later: enter your hand and dealer's and show odds modal. like this: https://wizardofodds.com/games/blackjack/hand-calculator/

//import and export stats to .txt


//maybe edit house rule settings, show stats on percentage corrct and streak
//maybe: share that i stood on hard 13 against dealer 6 and got it right and only 23.7% of people did. check out blackjack sim HERE



//https://en.wikipedia.org/wiki/Playing_cards_in_Unicode
//https://wizardofodds.com/games/blackjack/
//https://wizardofodds.com/games/blackjack/appendix/1/
//https://www.lolblackjack.com/blackjack/probability-odds/
//https://github.com/RochesterinNYC/BlackjackStrategyTester

let deck, currentCards;

let valDict = {'1':'Ace', '2':'2', '3':'3', '4':'4', '5':'5', '6':'6', '7':'7', '8':'8', '9':'9', 'a':'10', 'b': 'Jack', 'd':'Queen', 'e':'King'};
let suitDict = {'a':'Spades', 'b': 'Hearts', 'c': 'Diamonds', 'd':'Clubs'};

let numCorrect = 0;
let numWrong = 0;
let numStreak = 0;

let doubleData, hitData, splitData, standData;

//double with hard 4 against dealer 2
//doubleData['hard 4']['2'];

class Card {
	constructor(val, char) {
		this.char = char;
		this.name = valDict[val[1] ] + ' of ' + suitDict[val[0] ] ;
		this.value = parseInt(val[1]); //a through e is 10
		if(isNaN(this.value) ) {
			this.value = 10;
		}
		this.type = this.value == 1 ? 'Ace' : this.value;
	}
}


window.onload = function() {

	$.getJSON('data/double.json', function(data) {
		doubleData = data;
	});
	$.getJSON('data/hit.json', function(data) {
		hitData = data;
	});
	$.getJSON('data/split.json', function(data) {
		splitData = data;
	});
	$.getJSON('data/stand.json', function(data) {
		standData = data;
	});


	$('#hitButton').on('click', function() {handleInput('Hit') } );
	$('#standButton').on('click', function() {handleInput('Stand') } );
	$('#doubleButton').on('click', function() {handleInput('Double') } );
	$('#splitButton').on('click', function() {handleInput('Split') } );

	$('#drawOddsCheckbox').on('change', function() {
		if(! $(this).is(':checked') ) {
			//clear oddsInfo, otherwise if it used to be checked previous odds will still display
			$('#oddsInfo').html('');
		}
	});

	$('#newHandButton').on('click', function() {
		$('#newHandDiv').css('display', 'none');
		newHand();
	});

	$('#newHandButton').click();
}

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if(key == 37) { //left
		if($(':focus').is('.btn') ) {
			$(':focus').prev('.btn').focus();
		}
	} else if(key == 39) { //right
		if($(':focus').is('.btn') ) {
			$(':focus').next('.btn').focus();
		}
	}
}

function buildDeck() { //create deck
	deck = [];
	let vals = '123456789abde'.split('');
	let suits = 'abcd'.split('');
	for(let i=0;i<vals.length;i++) {
		for(let j=0;j<suits.length;j++) {
			deck.push(new Card(suits[j]+vals[i],'&#x1f0' + suits[j] + vals[i] + ';') );
		}
	}
}

// graphics
function drawCardImage(card, isPlayer) {
	let isRed = card.name.indexOf('Hearts') != -1 || card.name.indexOf('Diamonds') != -1;
	if(isPlayer) {
		$('#playerHandDiv').html($('#playerHandDiv').html() + '<span' + (isRed?' class="redcard"':'') +  '>' + card.char + '</span>');
	} else {
		$('#dealerHandDiv').html($('#dealerHandDiv').html() + '<span' + (isRed?' class="redcard"':'') +  '>' + card.char + '</span>');
	}

}
function drawCardbackImage() {
	$('#dealerHandDiv').html($('#dealerHandDiv').html() + '<span class="redcard">&#x1f0a0;</span>');
}
function clearCards() {
	$('#playerHandDiv').html('');
	$('#dealerHandDiv').html('');
}

function newHand() {
	$('#optionButtons').css('display', '');
	$('#hitButton').focus();

	$('#resultAlert').addClass('alert-info');
	$('#resultAlert').removeClass('alert-success');
	$('#resultAlert').removeClass('alert-danger');
	$('#resultAlert').html('Click a button to test your knowledge');

	clearCards();
	buildDeck();	
	currentCards = [getRandomCard(deck), getRandomCard(deck), getRandomCard(deck)]; //draw 3 unique cards

	drawCardImage(currentCards[0], true);
	drawCardImage(currentCards[1], true);
	drawCardImage(currentCards[2], false);
	drawCardbackImage();

	//todo: if checkbox, have dropdown for odds when hand dealt, not just after
	//drawOdds(currentCards[0].value+currentCards[1].value, currentCards[2].value, isSoft(currentCards), isSplit(currentCards) );

	$('#splitButton').prop('disabled', !isSplit(currentCards) );

}

function isSoft(cards) {
	return cards[0].value==1 || cards[1].value==1;
}
function isSplit(cards) {
	return cards[0].value == cards[1].value;
}

function getRandomCard(deck) { //remove card and return it
	let idx = Math.floor(Math.random()*deck.length);
	let randCard = deck[idx];
	deck.splice(idx, 1); //remove card
	return randCard;
}

function handleInput(selectedOption) {

	let playerValue = currentCards[0].value+currentCards[1].value;
	let dealerValue = currentCards[2].value;
	let handIsSoft = isSoft(currentCards);
	let handIsSplit = isSplit(currentCards);
	if(handIsSoft) {
		playerValue += 10;
	}
	if(dealerValue == 1) {
		dealerValue = 'ace';
	}

	if($('#drawOddsCheckbox').is(':checked') ) {
		drawOdds(playerValue, dealerValue, handIsSoft, handIsSplit);
	}
	let correctOption = getCorrectOption(playerValue, dealerValue, handIsSoft, handIsSplit);

	$('#optionButtons').css('display', 'none');

	let playerHandName = isSplit(currentCards) ? 'Pair of ' + currentCards[0].type + 's' : (isSoft(currentCards) ? 'Soft ' + (currentCards[0].value+currentCards[1].value+10) : 'Hard ' + (currentCards[0].value+currentCards[1].value) );
	if(playerHandName == 'Soft 21') {
		playerHandName = 'Blackjack';
	}

	$('#noHistory').css('display','none');
	if(correctOption == selectedOption) {
		let infoStr = 'Correct! <strong>' + correctOption + '</strong> was correct on hand with ' + playerHandName + ' against dealer ' + currentCards[2].type;
		$('#history').html('<br><span class="correct-history">' + infoStr + '</span><br>' + $('#history').html() );
		$('#resultAlert').html(infoStr);
		$('#resultAlert').removeClass('alert-info');
		$('#resultAlert').removeClass('alert-danger');
		$('#resultAlert').addClass('alert-success');
		numCorrect++;
		numStreak++;
	} else {
		let infoStr = 'Wrong! <strong>' + correctOption + '</strong> was correct on hand with ' + playerHandName + ' against dealer ' + currentCards[2].type + '. Not <strong>' + selectedOption + '</strong>';
		$('#history').html('<br><span class="wrong-history">' + infoStr + '</span><br>' + $('#history').html() );
		$('#resultAlert').html(infoStr);
		$('#resultAlert').removeClass('alert-info');
		$('#resultAlert').removeClass('alert-success');
		$('#resultAlert').addClass('alert-danger');
		numWrong++;
		numStreak = 0;
		if(playerHandName=='Blackjack') {
			window.alert('Seriously... You didn\'t stand on blackjack...');
		}
	}

	$('#newHandDiv').css('display', '');
	$('#newHandButton').focus();
	$('#statP').html('streak: ' + numStreak + '<br>' + numCorrect + ' / ' + (numCorrect+numWrong) );
}

function drawOdds(playerValue, dealerValue, isSoft, isSplit) {

	$('#oddsInfo').html('');
	$('#oddsInfo').append('<br>Double: ' + getDoubleOdds(playerValue, dealerValue, isSoft) );
	$('#oddsInfo').append('<br>Hit: ' + getHitOdds(playerValue, dealerValue, isSoft) );
	if(isSplit) {
		$('#oddsInfo').append('<br>Split: ' + getSplitOdds(playerValue, dealerValue) );
	}
	$('#oddsInfo').append('<br>Stand: ' + getStandOdds(playerValue, dealerValue) );
}

// return the players expecte value if they take that action given those hands
function getDoubleOdds(playerValue, dealerValue, isSoft) {
	return doubleData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];
}
function getHitOdds(playerValue, dealerValue, isSoft) {
	return hitData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];	
}
function getSplitOdds(playerValue, dealerValue) {
	return splitData['pair ' + playerValue/2][dealerValue.toString()];	
}
function getStandOdds(playerValue, dealerValue) {
	return standData[playerValue.toString()][dealerValue.toString()];
}

//todo: test
function getCorrectOption(playerValue, dealerValue, isSoft, isSplit) {
	let doubleOdds = getDoubleOdds(playerValue, dealerValue, isSoft);
	let hitOdds = getHitOdds(playerValue, dealerValue, isSoft);
	let splitOdds = -2; //default so we never pick split as best option if hand isn't split
	if(isSplit) {
		splitOdds= getSplitOdds(playerValue, dealerValue);		
	}
	let standOdds = getStandOdds(playerValue,dealerValue);

	let bestOdds = Math.max(doubleOdds, hitOdds, splitOdds, standOdds);
	if(bestOdds==doubleOdds) {
		return 'Double';
	}
	if(bestOdds==hitOdds) {
		return 'Hit';
	}
	if(bestOdds==standOdds) {
		return 'Stand';
	}
	if(bestOdds==splitOdds) {
		return 'Split';
	}
}

function oldGetCorrectOption(playerValue, dealerValue, isSoft, isSplit) {

	if(!isSoft && !isSplit) { //normal
		if(playerValue<=8 || (playerValue==9 && (dealerValue<=2 || dealerValue>=7) ) || (playerValue==10 && (dealerValue==1 || dealerValue==10) ) || (playerValue==11 && dealerValue==1) || (playerValue==12 && (dealerValue<=3 || dealerValue>=7) ) || (playerValue>=13 && playerValue<=16 && (dealerValue>= 7 || dealerValue==1) ) ) {
			return 'Hit';
		}
		if( (playerValue==9 && dealerValue>=3 && dealerValue<=6) || (playerValue==10 && dealerValue!=10 && dealerValue!=1) || (playerValue==11 && dealerValue!=1) ) {
			return 'Double';
		}
		else {
			return 'Stand';
		}

	}
	else if(isSplit) { //split, includes pair of aces
		if( ( (playerValue==4 || playerValue==6 || playerValue==14) && dealerValue>=2 && dealerValue<=7 ) || (playerValue==8 && (dealerValue==5 || dealerValue==6) ) || (playerValue==12 && (dealerValue>=2 && dealerValue<=6) ) || playerValue==16 || playerValue==2 || (playerValue==18 && dealerValue!=7 && dealerValue!=10 && dealerValue!=1) ) {
			return 'Split';			
		}
		if(playerValue==10 && dealerValue!=10 && dealerValue!=1) {
			return 'Double';
		}
		if(playerValue==20 || (playerValue==18 && (dealerValue==7 || dealerValue==10 || dealerValue==1) ) ) {
			return 'Stand';
		}
		else {
			return 'Hit';
		}

	}
	else { //soft, doesn't include pair of aces
		//aces handled as 11
		if(playerValue==21 || playerValue==19 || playerValue==20 || (playerValue==18 && (dealerValue==2 || dealerValue==7 || dealerValue==8) ) ) {
			return 'Stand';
		}
		if(dealerValue==5 || dealerValue==6 || (dealerValue==4 && playerValue>=15) || (dealerValue==3 && playerValue>=17) ) {
			return 'Double';
		}
		return 'Hit';
	}
}