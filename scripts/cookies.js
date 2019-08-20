let savingCookies = false;

// save options too, and update their display

// TODO: combine current streak and max streak if both non 0 (so add them)

function loadCookies() {
	// todo: combine prev cookies with current stuff like stats
	console.log('loading cookies');

	//  overrides current with previous
	// numChips = parseInt(Cookies.get('numChips') || numChips);

	// add previous chips to current, doesn't override
	let prevNumChips = parseInt(Cookies.get('numChips') );
	if(!isNaN(prevNumChips) )
		numChips += prevNumChips;

	// update display
	drawChips();


	let prevNumCorrect = parseInt(Cookies.get('numCorrect') );
	if(!isNaN(prevNumCorrect) )
		numCorrect += prevNumCorrect;
	let prevNumWrong = parseInt(Cookies.get('numWrong') );
	if(!isNaN(prevNumWrong) )
		numWrong += prevNumWrong;
	let prevNumStreak = parseInt(Cookies.get('numStreak') );
	if(!isNaN(prevNumStreak) )
		numStreak = Math.max(numStreak, prevNumStreak);
	let prevMaxStreak = parseInt(Cookies.get('maxStreak') );
	if(!isNaN(prevMaxStreak) )
		maxStreak = Math.max(maxStreak, prevMaxStreak);
	drawStreak();

	// overrides current stats with previous:
	// stats = Cookies.getJSON('stats') || stats;

	// add previous stats to current, doesn't override
	let prevStats = Cookies.getJSON('stats');
	for(item1 in prevStats) {
		for(item2 in prevStats[item1]) {
			for(item3 in prevStats[item1][item2]) {
				stats[item1][item2][item3] += prevStats[item1][item2][item3];
			}
		}
	}

	// update display
	updateStatDisplay();
}

function setCookies() {
	console.log(savingCookies);
	if(!savingCookies) return;

	console.log('setting cookies');

	Cookies.set('stats', stats);
	Cookies.set('numChips', numChips);

	Cookies.set('numCorrect', numCorrect);
	Cookies.set('numWrong', numWrong);
	Cookies.set('numStreak', numStreak);
	Cookies.set('maxStreak', maxStreak);

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

	$('#clearCookieButton').css('display', 'none');
}
