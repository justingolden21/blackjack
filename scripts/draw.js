// Card Characters
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

// Advanced Functions
function drawOdds(elm, playerValue, dealerValue, isSoft, isSplit) {
	elm.html('');

	let doubleOdds = getDoubleOdds(playerValue, dealerValue, isSoft);
	elm.append('<br>Double: ' + doubleOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(doubleOdds>0 ? 'green' : 'red') + '" style="width:' +
		Math.abs(doubleOdds*100) + '%;"></div></div>');

	let hitOdds = getHitOdds(playerValue, dealerValue, isSoft);
	elm.append('<br>Hit: ' + hitOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(hitOdds>0 ? 'green' : 'red') + '" style="width:' +
		Math.abs(hitOdds*100) + '%;"></div></div>');

	if(isSplit) {
		let splitOdds = getSplitOdds(playerValue, dealerValue, isSoft);
		elm.append('<br>Split: ' + splitOdds +
			'<div class="odds-bar-container"><div class="odds-bar ' +
			(splitOdds>0 ? 'green' : 'red flip-horizontal') + '" style="width:' +
			Math.abs(splitOdds*100) + '%;"></div></div>');
	}

	let standOdds = getStandOdds(playerValue, dealerValue);
	elm.append('<br>Stand: ' + standOdds +
		'<div class="odds-bar-container"><div class="odds-bar ' +
		(standOdds>0 ? 'green' : 'red flip-horizontal') + '" style="width:' +
		Math.abs(standOdds*100) + '%;"></div></div>');
}

function drawChips() {
	let classList = 'small-chip';
	if(! $('#animateCheckbox').is(':checked') )
		classList += ' animate';

	let chipsHTML = '';
	let idx = numChips;
	for(; idx>=25; idx-=25)
		chipsHTML += '<img src="img/chips/chip-blue.svg" class="' + classList + ' blue"> ';
	for(; idx>=5; idx-=5)
		chipsHTML += '<img src="img/chips/chip-red.svg" class="' + classList + ' red"> ';
	for(; idx>=1; idx-=1)
		chipsHTML += '<img src="img/chips/chip-green.svg" class="' + classList + ' green"> ';

	$('#chipsDiv').html(chipsHTML + '<span id="numChips">' + numChips + '</span>');

	if($('#animateCheckbox').is(':checked') )
		setTimeout( ()=> $('.small-chip').toggleClass('animate'), 100);
}

function drawTable(elm, playerValue, isSoft, isSplit) { // draws relevant slice of the strategy table
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

function drawStreak() {
	$('#statP').html('Streak: ' + numStreak + ' &mdash;&mdash; ' + 'Max streak: ' + maxStreak
		+ ' &mdash;&mdash; ' + numCorrect + ' / ' + (numCorrect+numWrong) );
}