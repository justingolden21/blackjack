function playHand(selectedOption) {
	console.log('Playing hand. Selected option was', selectedOption);

	// play through selected option
	let newCards = [];
	if(selectedOption=='Hit' || selectedOption=='Double') {
		newCards.push(getRandomCard(deck) );
		drawCardImage(newCards[newCards.length-1], true);

		// code for fade in animation...
		// figured out how to do it and then decided against it...
		// let cardHTML = drawCardImage(newCards[newCards.length-1], true, true);
		// let cardElm = $(cardHTML);
		// cardElm.insertAfter($('#playerHandDiv .pokercard:last-child')[0]);
		// cardElm.fadeOut(0).fadeIn(500);
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

	// TODO: show if they win
	// and display total values below hands

	$('#newHandDiv').css('display', '');
	$('#newHandButton').focus();
}

