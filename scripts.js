
let deck, currentCards;

// let valDict = {'1':'Ace', '2':'2', '3':'3', '4':'4', '5':'5', '6':'6', '7':'7', '8':'8', '9':'9', 'a':'10', 'b': 'Jack', 'd':'Queen', 'e':'King'};
// let suitDict = {'a':'Spades', 'b': 'Hearts', 'c': 'Diamonds', 'd':'Clubs'};

let numCorrect = numWrong = numStreak = maxStreak = 0;

let doubleData, hitData, splitData, standData;

// example:
// double with hard 4 against dealer 2
// doubleData['hard 4']['2'];

class Card {
	constructor(val, char) {
		this.char = char;
		// this.name = valDict[val[1] ] + ' of ' + suitDict[val[0] ] ;
		this.isRed = val[0] == 'b' || val[0] == 'c'; // heart or diamond
		this.value = parseInt(val[1]); //a through e is 10
		if(isNaN(this.value) )
			this.value = 10;
		this.type = this.value == 1 ? 'Ace' : this.value;
	}
}


$(function() {
	// Setup Checkboxes and Data
	setupCheckboxes();

	$.getJSON('data/double.json', (data) => doubleData = data);
	$.getJSON('data/hit.json', (data) => hitData = data);
	$.getJSON('data/split.json', (data) => splitData = data);
	$.getJSON('data/stand.json', (data) => standData = data);

	// Listeners
	$('#hitButton').click( ()=> handleInput('Hit') );
	$('#standButton').click( ()=> handleInput('Stand') );
	$('#doubleButton').click( ()=> handleInput('Double') );
	$('#splitButton').click( ()=> handleInput('Split') );

	$('#oddsInfo').css('display', 'none');
	$('#drawOddsCheckbox').change(function() {
		$('#oddsInfo').css('display', $(this).is(':checked') ? '' : 'none');
	});

	$('#newHandButton').click(newHand).click();

	// drag and drop
	$('#clearDragButton').click(function() {
		$('#dealerHandDrag').html('Dealer\'s Hand<br>');
		$('#playerHandDrag').html('Player\'s Hand<br>');
		$('#calculateInfoP').html('');
	});

	$('#calculateHandButton').click(calcHand);

	$('.clickable-card').click(handleCardClick);
	$('.drag-area').click(handleDragClick);
});

// focus button to the left or right with arrow keys for easy navigation
window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if(key == 37) { //left
		if($(':focus').is('.btn') )
			$(':focus').prev('.btn').focus();
	} else if(key == 39) { //right
		if($(':focus').is('.btn') )
			$(':focus').next('.btn').focus();
	}
}

function buildDeck() { // creates deck of 52
	deck = [];
	let vals = '123456789abde'.split('');
	let suits = 'abcd'.split('');
	for(let i=0; i<vals.length; i++) {
		for(let j=0; j<suits.length; j++) {
			deck.push(new Card(suits[j]+vals[i],'&#x1f0' + suits[j] + vals[i] + ';') );
		}
	}
}

// graphics
function drawCardImage(card, isPlayer) {
	// let isRed = card.name.indexOf('Hearts') != -1 || card.name.indexOf('Diamonds') != -1;
	let isRed = card.isRed;
	if(isPlayer)
		$('#playerHandDiv').html($('#playerHandDiv').html() + '<span' + (isRed?' class="redcard"':'') +  '>' + card.char + '</span>');
	else
		$('#dealerHandDiv').html($('#dealerHandDiv').html() + '<span' + (isRed?' class="redcard"':'') +  '>' + card.char + '</span>');
}
function drawCardbackImage() {
	$('#dealerHandDiv').html($('#dealerHandDiv').html() + '<span class="redcard">&#x1f0a0;</span>');
}
function clearCards() {
	$('#playerHandDiv').html('');
	$('#dealerHandDiv').html('');
}

function newHand() {

	// fade animations took way too much effort...
	$('#playerHandDiv').css('opacity', '0');
	$('#playerHandDiv').fadeOut(0).fadeIn(400, ()=>{$('#playerHandDiv').css('opacity', '1');});
	$('#dealerHandDiv').css('opacity', '0');
	$('#dealerHandDiv').fadeOut(0).fadeIn(400, ()=>{$('#dealerHandDiv').css('opacity', '1');});


	$('#newHandDiv').css('display', 'none');

	$('#optionButtons').css('display', '');
	$('#hitButton').focus();

	$('#resultAlert').addClass('alert-info');
	$('#resultAlert').removeClass('alert-success');
	$('#resultAlert').removeClass('alert-danger');
	$('#resultAlert').html('Click a button to test your knowledge');

	clearCards();
	buildDeck();	

	// draw 3 unique cards
	currentCards = [getRandomCard(deck), getRandomCard(deck), getRandomCard(deck)]; 

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

function getRandomCard(deck) { // remove card and return it
	let idx = Math.floor(Math.random()*deck.length);
	let randCard = deck[idx];
	deck.splice(idx, 1); // remove card
	return randCard;
}

function handleInput(selectedOption) {
	let playerValue = currentCards[0].value+currentCards[1].value;
	let dealerValue = currentCards[2].value;
	let handIsSoft = isSoft(currentCards);
	let handIsSplit = isSplit(currentCards);
	if(handIsSoft)
		playerValue += 10;
	if(dealerValue == 1)
		dealerValue = 'ace';
	if(playerValue < 4) //for get odds
		playerValue = 4;

	drawOdds(playerValue, dealerValue, handIsSoft, handIsSplit);
	let correctOption = getCorrectOption(playerValue, dealerValue, handIsSoft, handIsSplit);

	$('#optionButtons').css('display', 'none');

	let playerHandName = isSplit(currentCards) ? 'Pair of ' + currentCards[0].type + 's' : (isSoft(currentCards) ? 'Soft ' + (currentCards[0].value+currentCards[1].value+10) : 'Hard ' + (currentCards[0].value+currentCards[1].value) );
	if(playerHandName == 'Soft 21')
		playerHandName = 'Blackjack';

	$('#noHistory').css('display', 'none');
	if(correctOption == selectedOption) {
		let infoStr = 'Correct! <strong>' + correctOption + '</strong> was correct on hand with ' + playerHandName + ' against dealer ' + currentCards[2].type;
		$('#history').html('<br><span class="correct-history">' + infoStr + '</span><br>' + $('#history').html() );
		$('#resultAlert').html(infoStr);
		$('#resultAlert').removeClass('alert-info');
		$('#resultAlert').removeClass('alert-danger');
		$('#resultAlert').addClass('alert-success');
		numCorrect++;
		numStreak++;
		if(numStreak>maxStreak)
			maxStreak = numStreak;
	} else {
		let infoStr = 'Wrong! <strong>' + correctOption + '</strong> was correct on hand with ' + playerHandName + ' against dealer ' + currentCards[2].type + '. Not <strong>' + selectedOption + '</strong>';
		$('#history').html('<br><span class="wrong-history">' + infoStr + '</span><br>' + $('#history').html() );
		$('#resultAlert').html(infoStr);
		$('#resultAlert').removeClass('alert-info');
		$('#resultAlert').removeClass('alert-success');
		$('#resultAlert').addClass('alert-danger');
		numWrong++;
		numStreak = 0;
		// if(playerHandName=='Blackjack')
		// 	window.alert('Seriously... You didn\'t stand on blackjack...');
	}

	$('#newHandDiv').css('display', '');
	$('#newHandButton').focus();
	$('#statP').html('Streak: ' + numStreak + ' &mdash;&mdash; ' + 'Max streak: ' + maxStreak
		+ ' &mdash;&mdash; ' + numCorrect + ' / ' + (numCorrect+numWrong) );
}

function drawOdds(playerValue, dealerValue, isSoft, isSplit) {
	$('#oddsInfo').html('');

	// $('#oddsInfo').append('<br>Double: ' + getDoubleOdds(playerValue, dealerValue, isSoft) );
	let doubleOdds = getDoubleOdds(playerValue, dealerValue, isSoft);
	$('#oddsInfo').append('<br>Double: ' + doubleOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(doubleOdds>0 ? 'green' : 'red') + '" style="width:' +
		Math.abs(doubleOdds*100) + '%;"></div></div>');

	// $('#oddsInfo').append('<br>Hit: ' + getHitOdds(playerValue, dealerValue, isSoft) );
	let hitOdds = getHitOdds(playerValue, dealerValue, isSoft);
	$('#oddsInfo').append('<br>Hit: ' + hitOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(hitOdds>0 ? 'green' : 'red') + '" style="width:' +
		Math.abs(hitOdds*100) + '%;"></div></div>');

	if(isSplit) {
		// $('#oddsInfo').append('<br>Split: ' + getSplitOdds(playerValue, dealerValue) );
		let splitOdds = getSplitOdds(playerValue, dealerValue);
		$('#oddsInfo').append('<br>Split: ' + splitOdds +
			'<div class="odds-bar-container"><div class="odds-bar ' +
			(splitOdds>0 ? 'green' : 'red flip-horizontal') + '" style="width:' +
			Math.abs(splitOdds*100) + '%;"></div></div>');
	}

	// $('#oddsInfo').append('<br>Stand: ' + getStandOdds(playerValue, dealerValue) );
	let standOdds = getStandOdds(playerValue, dealerValue);
	$('#oddsInfo').append('<br>Stand: ' + standOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(standOdds>0 ? 'green' : 'red flip-horizontal') + '" style="width:' +
		Math.abs(standOdds*100) + '%;"></div></div>');
}

// return the players expecte value if they take that action given those hands
function getDoubleOdds(playerValue, dealerValue, isSoft) {
	return doubleData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];
}
function getHitOdds(playerValue, dealerValue, isSoft) {
	return hitData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];	
}
function getSplitOdds(playerValue, dealerValue) {
	if(playerValue==12) //aces
		return splitData['pair ace'][dealerValue.toString()];

	return splitData['pair ' + playerValue/2][dealerValue.toString()];
}
function getStandOdds(playerValue, dealerValue) {
	return standData[playerValue.toString()][dealerValue.toString()];
}

function getCorrectOption(playerValue, dealerValue, isSoft, isSplit) {
	let doubleOdds = getDoubleOdds(playerValue, dealerValue, isSoft);
	let hitOdds = getHitOdds(playerValue, dealerValue, isSoft);
	let splitOdds = -2; // default so we never pick split as best option if hand isn't split
	if(isSplit)
		splitOdds = getSplitOdds(playerValue, dealerValue);
	let standOdds = getStandOdds(playerValue,dealerValue);

	let bestOdds = Math.max(doubleOdds, hitOdds, splitOdds, standOdds);
	if(bestOdds==doubleOdds) { return 'Double'; }
	if(bestOdds==hitOdds) { return 'Hit'; }
	if(bestOdds==standOdds) { return 'Stand'; }
	if(bestOdds==splitOdds) { return 'Split'; }
}
