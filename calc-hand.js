// funciton set as listener for calculateHandButton in scripts.js
function calcHand() {
	// Part 1: Weed out invalid hands and get hand values
	let dealerHandCards = document.getElementById('dealerHandDrag').children;
	if(dealerHandCards[1] == undefined) {
		$('#calculateInfoP').html('Please enter dealer hand.');
		return;
	}
	let dealerVal = parseInt(dealerHandCards[1].id.replace('card', '') );

	let playerHandCards = document.getElementById('playerHandDrag').children;

	if(playerHandCards[1] == undefined) {
		$('#calculateInfoP').html('Please enter player hand.');
		return;
	}

	let playerVals = [];
	// start at 1 because they have p elements in front
	for(let i=1; i<playerHandCards.length; i++)
		playerVals.push(parseInt(playerHandCards[i].id.replace('card', '') ) );

	let numAces = 0;
	let playerValue = 0;
	let isSplit = playerVals.length == 2 && playerVals[0] == playerVals[1]; // exactly 2 cards and they're the same
	for(let i=0; i<playerVals.length; i++) {
		if(playerVals[i] != 1) {
			playerValue += playerVals[i];
		} else { // aces
			playerValue += 11;
			numAces++;
		}
	}
	for(;numAces>0 && playerValue>21; numAces--)
		playerValue -= 10; // 'use' each ace for 1 not 11 until not bust

	let isSoft = numAces > 0; // if any 'unused' aces

	let dealerValue = dealerVal;
	if(dealerValue==1)
		dealerValue = 'ace';

	if(playerValue < 4) // for get odds
		playerValue = 4;

	if(playerValue > 21) {
		$('#calculateInfoP').html('Hand over 21. Bust.');
		return;
	}

	if(isNaN(playerValue) || isNaN(dealerValue) ) {
		$('#calculateInfoP').html('Missing player or dealer hand value.');
		return;	
	}

	// Part 2: Display the odds of each option and highlight the best option
	let infoStr = '';

	let doubleOdds = getDoubleOdds(playerValue, dealerValue, isSoft);
	let hitOdds = getHitOdds(playerValue, dealerValue, isSoft);
	let splitOdds = -2; // default so we never pick split as best option if hand isn't split
	if(isSplit)
		splitOdds = getSplitOdds(playerValue, dealerValue);
	let standOdds = getStandOdds(playerValue,dealerValue);

	let bestOdds = Math.max(doubleOdds, hitOdds, splitOdds, standOdds);

	infoStr += '<br><span class="odds-option ' + (doubleOdds == bestOdds ? 'best-pick' : '') + '">Double: ' + doubleOdds + '</span><br>';
	infoStr += '<br><span class="odds-option ' + (hitOdds == bestOdds ? 'best-pick' : '') + '">Hit: ' + hitOdds + '</span><br>';
	if(isSplit)
		infoStr += '<br><span class="odds-option ' + (splitOdds == bestOdds ? 'best-pick' : '') + '">Split: ' + splitOdds + '</span><br>';
	infoStr += '<br><span class="odds-option ' + (standOdds == bestOdds ? 'best-pick' : '') + '">Stand: ' + standOdds + '</span><br>';

	$('#calculateInfoP').html(infoStr);
}


// drag and drop, w3schools
function allowDrop(ev) {
	ev.preventDefault();
}
function drag(ev) {
	ev.dataTransfer.setData('text', ev.target.id);
}
function drop(ev) {
	// console.log('droppin ', ev.target);

	ev.preventDefault();
	let data = ev.dataTransfer.getData('text');

	let dragTarget = ev.target;

	if(dragTarget.parentNode.className.indexOf('drag-area') != -1) { // if dragged onto child of drag area (another card)
		// console.log('dragged onto card, moving to parent');
		dragTarget = ev.target.parentNode;
	}
	else if(dragTarget.className.indexOf('drag-area') == -1 ) { // if dragging to invalid location
		// console.log('moved to invalid locaiton, removing');
		dragTarget.remove(); // delete it
		$('#calculateHandButton').click();
		return;
	}

	// using > 8 and 1 because there is already 1 child div that's not a card (doesn't count)
	if(dragTarget.children.length > 8) // max 8 cards per div
		return;
	if(dragTarget.id=='dealerHandDrag' && dragTarget.children.length > 1) // max 1 card in dealer drag div
		return;

	let clone = document.getElementById(data).cloneNode(true);
	dragTarget.appendChild(clone);

	$('#calculateHandButton').click();
}

// For clicking as opposed to dragging
// Listeners set in main file
function handleCardClick() {
	if($(this).hasClass('active') ) {
		$(this).removeClass('active');
	} else {
		// remove from other cards first
		$('.clickable-card').removeClass('active');
		$(this).toggleClass('active');
	}
}
function handleDragClick() {
	if($('.clickable-card.active').length == 0)
		return;

	console.log($(this).children().length);
	if($(this).children().length > 8)
		return
	if(this.id=='dealerHandDrag' && $(this).children().length > 1)
		return

	$('.clickable-card.active').clone().click(removeCard).appendTo($(this) );

	$('.clickable-card').removeClass('active');

	$('#calculateHandButton').click(); // update display
}
function removeCard() {
	// not an arrow function because in that scope/context, "this" refers to another element
	$(this).remove();

	$('#calculateHandButton').click(); // update display
}
