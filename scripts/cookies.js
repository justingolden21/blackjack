let savingCookies = false;

function loadCookies() {
	console.log('loading cookies');

	let prevNumChips = parseInt(Cookies.get('numChips') );
	if(!isNaN(prevNumChips) )
		numChips += prevNumChips; // add previous to current
	drawChips(); // update display

	let prevNumCorrect = parseInt(Cookies.get('numCorrect') );
	if(!isNaN(prevNumCorrect) )
		numCorrect += prevNumCorrect;
	let prevNumWrong = parseInt(Cookies.get('numWrong') );
	if(!isNaN(prevNumWrong) )
		numWrong += prevNumWrong;
	let prevNumStreak = parseInt(Cookies.get('numStreak') );
	if(!isNaN(prevNumStreak) )
		numStreak = numStreak != 0 && prevNumStreak != 0 ? numStreak+prevNumStreak : 0;
	let prevMaxStreak = parseInt(Cookies.get('maxStreak') );
	if(!isNaN(prevMaxStreak) )
		maxStreak = Math.max(Math.max(maxStreak, prevMaxStreak), numStreak);
	drawStreak(); // update display

	let prevStats = Cookies.getJSON('stats');
	for(item1 in prevStats) {
		for(item2 in prevStats[item1]) {
			for(item3 in prevStats[item1][item2]) {
				stats[item1][item2][item3] += prevStats[item1][item2][item3]; // add stats to current
			}
		}
	}
	updateStatDisplay(); // update display

	let settings = Cookies.getJSON('settings');
	if(settings)
		for(let i=0; i< $('#optionsModal').find('input[type=checkbox]').length; i++)
			$('#optionsModal').find('input[type=checkbox]')[i].checked = settings[i];
	console.log('loading settings:', settings);
	updateFromCheckboxes(); // cause settings to update
	updateCheckboxes(); // cause display of checkboxes to update
}

function setCookies() {
	if(!savingCookies) return;

	console.log('setting cookies');

	Cookies.set('stats', stats);
	Cookies.set('numChips', numChips);

	Cookies.set('numCorrect', numCorrect);
	Cookies.set('numWrong', numWrong);
	Cookies.set('numStreak', numStreak);
	Cookies.set('maxStreak', maxStreak);

	// Settings
	let settings = [];
	for(let i=0; i< $('#optionsModal').find('input[type=checkbox]').length; i++)
		settings[i] = $('#optionsModal').find('input[type=checkbox]')[i].checked;
	settings = JSON.stringify(settings);

	console.log('saving settings:' , settings);
	Cookies.set('settings', settings);

	$('#clearCookieButton').css('display', '');
}

function clearCookies() {
	console.log('clearing cookies');

	Cookies.remove('stats');
	Cookies.remove('numChips');

	Cookies.remove('numCorrect');
	Cookies.remove('numWrong');
	Cookies.remove('numStreak');
	Cookies.remove('maxStreak');

	Cookies.remove('settings');

	$('#clearCookieButton').css('display', 'none');
}
