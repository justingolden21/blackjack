function drawChips(num) {
	let classList = 'small-chip';
	if(! $('#animateCheckbox').is(':checked') )
		classList += ' animate';

	let chipsHTML = '';
	let idx = num;
	for(; idx>=25; idx-=25)
		chipsHTML += '<img src="chips/chip-blue.svg" class="' + classList + ' blue"> ';
	for(; idx>=5; idx-=5)
		chipsHTML += '<img src="chips/chip-red.svg" class="' + classList + ' red"> ';
	for(; idx>=1; idx-=1)
		chipsHTML += '<img src="chips/chip-green.svg" class="' + classList + ' green"> ';

	$('#chipsDiv').html(chipsHTML + '<span id="numChips">' + num + '</span>');

	if($('#animateCheckbox').is(':checked') )
		setTimeout( ()=> $('.small-chip').toggleClass('animate'), 100);
}