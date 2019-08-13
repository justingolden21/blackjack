let deck, currentCards;

let numCorrect = numWrong = numStreak = maxStreak = 0;

// example:
// double with hard 4 against dealer 2
// doubleData['hard 4']['2'];
let doubleData, hitData, splitData, standData;

let numChips = 0;

class Card {
	constructor(val, char) {
		this.char = char;
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

	$('#oddsInfo').css('display', $('#drawOddsCheckbox').is(':checked') ? '' : 'none');
	$('#drawOddsCheckbox').change( ()=> {
		$('#oddsInfo').css('display', $('#drawOddsCheckbox').is(':checked') ? '' : 'none');
	});

	$('#tableRow').css('display', $('#drawTableRowCheckbox').is(':checked') ? '' : 'none');
	$('#drawTableRowCheckbox').change( ()=> {
		$('#tableRow').css('display', $('#drawTableRowCheckbox').is(':checked') ? '' : 'none');
	});

	$('#chipsDiv').css('display', $('#drawChipsCheckbox').is(':checked') ? '' : 'none');
	$('#drawChipsCheckbox').change( ()=> {
		$('#chipsDiv').css('display', $('#drawChipsCheckbox').is(':checked') ? '' : 'none');
	});

	$('#newHandButton').click(newHand).click();

	// drag and drop
	$('#clearDragButton').click( ()=> {
		$('#dealerHandDrag').html('Dealer\'s Hand<br>');
		$('#playerHandDrag').html('Player\'s Hand<br>');
		$('#calculateInfoP').html('');
	});

	$('#clearHistoryButton').click( ()=> {
		$('#history').html('');
		$('#noHistory').css('display', '');
		$('#clearHistoryDiv').css('display', 'none');
	});

	// $('#calculateHandButton').click(calcHand);

	$('.clickable-card').click(handleCardClick);
	$('.drag-area').click(handleDragClick);

	setTimeout(()=> $('.chip').removeClass('move'), 500);
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
function drawCardImage(card, isPlayer, returnOnly=false) {
	let cardHTML = '<span class=" pokercard ' + (card.isRed ? 'redcard':'') + '">' + card.char + '</span>';
	if(returnOnly)
		return cardHTML;
	if(isPlayer)
		$('#playerHandDiv').html($('#playerHandDiv').html() + cardHTML);
	else
		$('#dealerHandDiv').html($('#dealerHandDiv').html() + cardHTML);
}
function drawCardbackImage() {
	$('#dealerHandDiv').html($('#dealerHandDiv').html() + '<span class="pokercard redcard cardback">&#x1f0a0;</span>');
}
function clearCards() {
	$('.cardHandDiv').html(''); //player and dealer hand divs
}

function newHand() {

	if($('#animateCheckbox').is(':checked') ) {

		$('.chip').css('box-shadow', 'none');
		$('.chip').toggleClass('spin');
		setTimeout( ()=> {$('.chip').css('box-shadow', '5px 5px 0px hsl(0, 0%, 20%)');}, 2000);

		// garbage below, still testing...
		// $('.pokercard').animate({'opacity': '0'}, 100, ()=> { $('.pokercard').css('opacity', 1); } );

		$('.cardHandDiv').css('transform', 'translateX(-200%)');
		$('.cardHandDiv').fadeOut(0).fadeIn(0, ()=>{$('.cardHandDiv').css('transform', 'translateX(0%)');});		
		// setTimeout( ()=>{$('.cardHandDiv').css('transform', 'translateX(0%)');}, 300);

		// $('.cardHandDiv').css('opacity', '0');
		// $('.cardHandDiv').fadeOut(0).fadeIn(400, ()=>{$('.cardHandDiv').css('opacity', '1');});
	}

	$('#newHandDiv').css('display', 'none');

	$('#optionButtons').css('display', '');
	$('#hitButton').focus();

	$('#resultAlert').addClass('alert-info');
	$('#resultAlert').removeClass('alert-success');
	$('#resultAlert').removeClass('alert-danger');
	$('#resultAlert').html('<i class="fas fa-info"></i> Click a button to test your knowledge');

	clearCards();

	// draw 3 unique cards
	let validCards = false;

	let hardValid = $('#hardCheckbox').is(':checked');
	let softValid = $('#softCheckbox').is(':checked');
	let splitValid = $('#splitCheckbox').is(':checked');

	// make sure at least one is checked, otherwise treat all as checked
	if(!hardValid && !softValid && !splitValid)
		hardValid = softValid = splitValid = true;

	// let excludeUnselected = $('#logicCheckbox').is(':checked');

	while(!validCards) {
		buildDeck();
		currentCards = [getRandomCard(deck), getRandomCard(deck), getRandomCard(deck)];

		// if(excludeUnselected) {
		// 	validCards = !( (!isSoft(currentCards) && !hardValid) || 
		// 		(isSoft(currentCards) && !softValid) || 
		// 		(isSplit(currentCards) && !splitValid) );
		// } else {
		// 	validCards = (!isSoft(currentCards) && hardValid) || 
		// 		(isSoft(currentCards) && softValid) || 
		// 		(isSplit(currentCards) && splitValid);
		// }

		// solution: splits are neither soft nor hard
		validCards = (!isSoft(currentCards) && !isSplit(currentCards) && hardValid) || 
			(isSoft(currentCards) && !isSplit(currentCards) && softValid) || 
			(isSplit(currentCards) && splitValid);
	}

	drawCardImage(currentCards[0], true);
	drawCardImage(currentCards[1], true);
	drawCardImage(currentCards[2], false);
	drawCardbackImage();

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

	if($('#animateCheckbox').is(':checked') )
		$('.chip').toggleClass('spin');

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

	drawOdds($('#oddsInfo'), playerValue, dealerValue, handIsSoft, handIsSplit);
	drawTable($('#tableRow'), playerValue, handIsSoft, handIsSplit);

	let correctOption = getCorrectOption(playerValue, dealerValue, handIsSoft, handIsSplit);

	$('#optionButtons').css('display', 'none');

	let playerHandName = isSplit(currentCards) ? 'Pair of ' + currentCards[0].type + 's' : (isSoft(currentCards) ? 'Soft ' + (currentCards[0].value+currentCards[1].value+10) : 'Hard ' + (currentCards[0].value+currentCards[1].value) );
	if(playerHandName == 'Soft 21')
		playerHandName = 'Blackjack';

	$('#noHistory').css('display', 'none');
	$('#clearHistoryDiv').css('display', 'block');

	if(correctOption == selectedOption) {
		numChips++;
		let infoStr = '<i class="fas fa-check"></i> Correct! <u>' + correctOption + '</u> was correct on hand with ' + playerHandName + ' against dealer ' + currentCards[2].type;
		$('#history').html('<br><span class="history correct-history">' + infoStr + '</span><br>' + $('#history').html() );
		$('#resultAlert').html(infoStr);
		$('#resultAlert').removeClass('alert-info');
		$('#resultAlert').removeClass('alert-danger');
		$('#resultAlert').addClass('alert-success');
		numCorrect++;
		numStreak++;
		if(numStreak>maxStreak)
			maxStreak = numStreak;
	} else {
		numChips = Math.max(numChips-1, 0);
		let infoStr = '<i class="fas fa-times"></i> Wrong! <u>' + correctOption + '</u> was correct on hand with ' + playerHandName + ' against dealer ' + currentCards[2].type + '. Not <u>' + selectedOption + '</u>';
		$('#history').html('<br><span class="history wrong-history">' + infoStr + '</span><br>' + $('#history').html() );
		$('#resultAlert').html(infoStr);
		$('#resultAlert').removeClass('alert-info');
		$('#resultAlert').removeClass('alert-success');
		$('#resultAlert').addClass('alert-danger');
		numWrong++;
		numStreak = 0;
	}

	if($('#playCheckbox').is(':checked') ) {
		playHand(selectedOption);
	} else {
		$('#newHandDiv').css('display', '');
		$('#newHandButton').focus();
	}

	drawChips(numChips);

	updateStats(selectedOption, correctOption, playerValue, dealerValue, handIsSoft, handIsSplit);

	$('#statP').html('Streak: ' + numStreak + ' &mdash;&mdash; ' + 'Max streak: ' + maxStreak
		+ ' &mdash;&mdash; ' + numCorrect + ' / ' + (numCorrect+numWrong) );
}

function drawOdds(elm, playerValue, dealerValue, isSoft, isSplit) {
	elm.html('');

	// $('#oddsInfo').append('<br>Double: ' + getDoubleOdds(playerValue, dealerValue, isSoft) );
	let doubleOdds = getDoubleOdds(playerValue, dealerValue, isSoft);
	elm.append('<br>Double: ' + doubleOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(doubleOdds>0 ? 'green' : 'red') + '" style="width:' +
		Math.abs(doubleOdds*100) + '%;"></div></div>');

	// $('#oddsInfo').append('<br>Hit: ' + getHitOdds(playerValue, dealerValue, isSoft) );
	let hitOdds = getHitOdds(playerValue, dealerValue, isSoft);
	elm.append('<br>Hit: ' + hitOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(hitOdds>0 ? 'green' : 'red') + '" style="width:' +
		Math.abs(hitOdds*100) + '%;"></div></div>');

	if(isSplit) {
		// $('#oddsInfo').append('<br>Split: ' + getSplitOdds(playerValue, dealerValue, isSoft) );
		let splitOdds = getSplitOdds(playerValue, dealerValue, isSoft);
		elm.append('<br>Split: ' + splitOdds +
			'<div class="odds-bar-container"><div class="odds-bar ' +
			(splitOdds>0 ? 'green' : 'red flip-horizontal') + '" style="width:' +
			Math.abs(splitOdds*100) + '%;"></div></div>');
	}

	// $('#oddsInfo').append('<br>Stand: ' + getStandOdds(playerValue, dealerValue) );
	let standOdds = getStandOdds(playerValue, dealerValue);
	elm.append('<br>Stand: ' + standOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(standOdds>0 ? 'green' : 'red flip-horizontal') + '" style="width:' +
		Math.abs(standOdds*100) + '%;"></div></div>');
}

function drawTable(elm, playerValue, isSoft, isSplit) {
	elm.html('');
	let row1, row2;

	if(isSplit) {
		row1 = 19;
		if(playerValue==2) {
			row2 = 29;
		} else {
			row2 = playerValue/2 + 18;
		}
	} else if(isSoft) {
		row1 = 11;
		if(playerValue >= 19) {
			row2 = 18;
		} else {
			row2 = playerValue-1;
		}
	} else { // hard
		row1 = 0;
		if(playerValue <=8) {
			row2 = 1;
		} else if(playerValue >=17) {
			row2 = 10;
		} else {
			row2 = playerValue-7;
		}
	}

	$($('#strategyTable tr').get(row1) ).clone().appendTo(elm);
	$($('#strategyTable tr').get(row2) ).clone().appendTo(elm);
}

// return the players expecte value if they take that action given those hands
function getDoubleOdds(playerValue, dealerValue, isSoft) {
	return doubleData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];
}
function getHitOdds(playerValue, dealerValue, isSoft) {
	return hitData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];	
}
function getSplitOdds(playerValue, dealerValue, isSoft) {
	if(playerValue==12 && isSoft) //aces
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
		splitOdds = getSplitOdds(playerValue, dealerValue, isSoft);
	let standOdds = getStandOdds(playerValue, dealerValue);

	let bestOdds = Math.max(doubleOdds, hitOdds, splitOdds, standOdds);
	if(bestOdds==doubleOdds) { return 'Double'; }
	if(bestOdds==hitOdds) { return 'Hit'; }
	if(bestOdds==standOdds) { return 'Stand'; }
	if(bestOdds==splitOdds) { return 'Split'; }
}
