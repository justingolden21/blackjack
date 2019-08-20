let deck, currentCards;
let doubleData, hitData, splitData, standData;
let numCorrect = numWrong = numStreak = maxStreak = 0;
let numChips = 0;

// Setup/Listeners
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

	$('#fullscreenButton').click(toggleFullscreen);

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

	//  cookies
	$('#noCookieButton').click( ()=> {
		$('#cookieAlert').fadeOut(300);
		savingCookies = false;
		$('#cookieCheckbox').prop('checked', false);
	});
	$('#yesCookieButton').click( ()=> {
		$('#cookieAlert').fadeOut(300);
		savingCookies = true;
		$('#cookieCheckbox').prop('checked', true);
		loadCookies();
	});
	$('#clearCookieButton').click(clearCookies);
	$('#loadCookieButton').click(loadCookies);
	$('#cookieCheckbox').change( ()=> {
		savingCookies = $('#cookieCheckbox').is(':checked');
	});

	// drag and drop
	$('#clearDragButton').click( ()=> {
		$('#dealerHandDrag').html('<p>Dealer\'s Hand</p><br>');
		$('#playerHandDrag').html('<p>Player\'s Hand</p><br>');
		$('#calculateInfoP').html('');
		$('#calcOddsDiv').html('');
	});
	$('#clearHistoryButton').click( ()=> {
		$('#history').html('');
		$('#noHistory').css('display', '');
		$('#clearHistoryDiv').css('display', 'none');
	});
	$('.clickable-card').click(handleCardClick);
	$('.drag-area').click(handleDragAreaClick);

	$('.modal').on('shown.bs.modal', ()=> {
		// $(this).children('.modal-dialog').children('.modal-content').children('.modal-header').children('.close').trigger('focus');
		// $(this).trigger('focus');

		// console.log($(this).closest('.modal-dialog') );
		// console.log($(this).find('.modal-dialog') );
		// console.log($(this).find('.modal-dialog').first() );
		// console.log($(this).children('.modal-dialog') );

		// $(this).children('.modal-dialog').first().children('.modal-content').first().children('.modal-header').first().children('.close').first().focus();
		// $(this).find('.modal-dialog').first().find('.modal-content').first().find('.modal-header').first().find('.close').first().focus();
		$(this).find('.modal-dialog .modal-content .modal-header .close').first().focus();

		console.log($(this) );

		console.log($(this).find('.modal-dialog .modal-content .modal-header .close') );
		// console.log($(this).children('.modal-dialog').children('.modal-content').children('.modal-header').children('.close') );
		// $(this).children('.modal-dialog').children('.modal-content').children('.modal-header').children('.close').focus();
		// $(this).children('.close').focus();
		// $('#myInput').trigger('focus')
	});

	// $('.modal').click( ()=> {
	// 	console.log($(this).children('.close') );
	// 	$(this).children('.close').focus();
	// });

	$('#newHandButton').click(newHand).click();
	setTimeout(()=> $('.chip').removeClass('move'), 500);
});

window.onkeyup = function(e) {
	// focus button to the left or right with arrow keys for easy navigation
	let key = e.keyCode ? e.keyCode : e.which;
	if(key == 37) { //left
		if($(':focus').is('.btn') )
			$(':focus').prev('.btn').focus();
	} else if(key == 39) { //right
		if($(':focus').is('.btn') )
			$(':focus').next('.btn').focus();
	}
}

// The Big Functions
function newHand() {
	if($('#animateCheckbox').is(':checked') ) {
		$('.chip').css('box-shadow', 'none');
		$('.chip').toggleClass('spin');
		setTimeout( ()=> {$('.chip').css('box-shadow', '5px 5px 0px hsl(0, 0%, 20%)');}, 2000);

		$('.cardHandDiv').css('transform', 'translateX(-200%)');
		$('.cardHandDiv').fadeOut(0).fadeIn(0, ()=>{$('.cardHandDiv').css('transform', 'translateX(0%)');});
	}

	$('#newHandDiv').css('display', 'none');
	$('#optionButtons').css('display', '');
	$('#hitButton').focus();

	$('#resultAlert').addClass('alert-info').removeClass('alert-success').removeClass('alert-danger');
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

	while(!validCards) {
		buildDeck();
		currentCards = [getRandomCard(deck), getRandomCard(deck), getRandomCard(deck)];

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
		$('#resultAlert').removeClass('alert-info').removeClass('alert-danger').addClass('alert-success');
		numCorrect++;
		numStreak++;
		if(numStreak>maxStreak)
			maxStreak = numStreak;
	} else {
		numChips = Math.max(numChips-1, 0);
		let infoStr = '<i class="fas fa-times"></i> Wrong! <u>' + correctOption + '</u> was correct on hand with ' + playerHandName + ' against dealer ' + currentCards[2].type + '. Not <u>' + selectedOption + '</u>';
		$('#history').html('<br><span class="history wrong-history">' + infoStr + '</span><br>' + $('#history').html() );
		$('#resultAlert').html(infoStr);
		$('#resultAlert').removeClass('alert-info').removeClass('alert-success').addClass('alert-danger');
		numWrong++;
		numStreak = 0;
	}

	if($('#playCheckbox').is(':checked') ) {
		playHand(selectedOption);
	} else {
		$('#newHandDiv').css('display', '');
		$('#newHandButton').focus();
	}

	drawChips();
	updateStats(selectedOption, correctOption, playerValue, dealerValue, handIsSoft, handIsSplit);
	setCookies();
	drawStreak();
}