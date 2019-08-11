function drawChips(num) {
	$('#chipsDiv').html('');
	let chipsHTML = '';
	let idx = num;
	for(; idx>=25; idx-=25)
		chipsHTML += '<img src="chips/chip-blue.svg" class="small-chip blue"> ';
	for(; idx>=5; idx-=5)
		chipsHTML += '<img src="chips/chip-red.svg" class="small-chip red"> ';
	for(; idx>=1; idx-=1)
		chipsHTML += '<img src="chips/chip-green.svg" class="small-chip green"> ';		

	$('#chipsDiv').append(chipsHTML + '<span id="numChips">' + num + '</span>');
}