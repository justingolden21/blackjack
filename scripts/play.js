function playHand(selectedOption) {
	console.log('Playing hand. Selected option was', selectedOption);

	// play through selected option
	let newCards = [];
	if(selectedOption=='Hit' || selectedOption=='Double') {
		newCards.push(getRandomCard(deck) );
		drawCardImage(newCards[newCards.length-1], true);
	}

	if(selectedOption=='Split') {
		$('#playerHandDiv .pokercard').addClass('splitcard');

		// hit on each hand
		newCards.push(getRandomCard(deck) );
		let cardHTML = drawCardImage(newCards[newCards.length-1], true, true);
		$(cardHTML).insertAfter($('#playerHandDiv .splitcard')[0]);

		newCards.push(getRandomCard(deck) );
		cardHTML = drawCardImage(newCards[newCards.length-1], true, true);
		$(cardHTML).insertAfter($('#playerHandDiv .splitcard')[1]);

		$('<br class="small-only">').insertAfter($('#playerHandDiv .splitcard + .pokercard')[0]);
	}

	// reveal dealer card
	let dealerCard = getRandomCard(deck);
	$('.cardback').remove();
	drawCardImage(dealerCard, false);

	$('#newHandDiv').css('display', '');
	$('#newHandButton').focus();
}

