function calcHand() {
	// Part 1: Weed out invalid hands and get hand values
	let dealerHandCards = document.getElementById('dealerHandDrag').children;
	if(dealerHandCards[1] == undefined) {
		$('#calculateInfoP').html('Please enter dealer hand.');
		$('#calcOddsDiv').html('');
		return;
	}
	let dealerValue = parseInt(dealerHandCards[1].id.replace('card', '') );

	let playerHandCards = document.getElementById('playerHandDrag').children;

	if(playerHandCards[1] == undefined) {
		$('#calculateInfoP').html('Please enter player hand.');
		$('#calcOddsDiv').html('');
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

	if(dealerValue==1)
		dealerValue = 'ace';

	if(playerValue < 4) // for get odds
		playerValue = 4;

	if(playerValue > 21) {
		$('#calculateInfoP').html('Hand over 21. Bust.');
		$('#calcOddsDiv').html('');
		return;
	}

	if(isNaN(playerValue) || (isNaN(dealerValue) && dealerValue != 'ace') ) {
		$('#calculateInfoP').html('Missing player or dealer hand value.');
		$('#calcOddsDiv').html('');
		return;	
	}

	// if one card and it's an ace
	// this couldn't happen normally, but can be entered in the calculator
	// so we'll handle it as a hard 11 not a soft 11 which is an impossible hand
	if(playerVals.length==1 && playerVals[0]==1)
		isSoft = false;

	// Part 2: Display the odds of each option and highlight the best option
	$('#calculateInfoP').html('');
	drawOdds($('#calcOddsDiv'), playerValue, dealerValue, isSoft, isSplit);
}

// Handle Drag and Drop
function allowDrop(ev) {
	ev.preventDefault();
}
function drag(ev) {
	ev.dataTransfer.setData('text', ev.target.id);
}
function drop(ev) {
	ev.preventDefault();
	let data = ev.dataTransfer.getData('text');

	let dragTarget = ev.target;

	if(dragTarget.parentNode.className.indexOf('drag-area') != -1) { // if dragged onto child of drag area (another card)
		dragTarget = ev.target.parentNode;
	}
	else if(dragTarget.className.indexOf('drag-area') == -1 ) { // if dragging to invalid location
		dragTarget.remove(); // delete it
		calcHand();
		return;
	}

	// using > 6 and 1 because there is already 1 child div that's not a card (doesn't count)
	if(dragTarget.children.length > 6) // max 6 cards per div
		return;
	if(dragTarget.id=='dealerHandDrag' && dragTarget.children.length > 1) // max 1 card in dealer drag div
		return;

	let clone = document.getElementById(data).cloneNode(true);
	dragTarget.appendChild(clone);

	calcHand();
}

// Handle Clicking
function handleCardClick() {
	if($(this).hasClass('active') ) {
		$(this).removeClass('active');
	} else {
		// remove from other cards first
		$('.clickable-card').removeClass('active');
		$(this).toggleClass('active');
	}
}
function handleDragAreaClick() {
	if($('.clickable-card.active').length == 0)
		return;
	if($(this).children().length > 6)
		return;
	if(this.id=='dealerHandDrag' && $(this).children().length > 1)
		return;

	$('.clickable-card.active').clone().click(removeCard).appendTo($(this) );
	$('.clickable-card').removeClass('active');

	calcHand();
}
function removeCard() {
	// not an arrow function because in that scope/context, "this" refers to another element
	$(this).remove();
	calcHand();
}