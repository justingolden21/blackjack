let stats = {
	'hard': {
		'hit':    {'correct': 0, 'wrong':0},
		'stand':  {'correct': 0, 'wrong':0},
		'double': {'correct': 0, 'wrong':0},
		'split':  {'correct': 0, 'wrong':0}
	},
	'soft': {
		'hit':    {'correct': 0, 'wrong':0},
		'stand':  {'correct': 0, 'wrong':0},
		'double': {'correct': 0, 'wrong':0},
		'split':  {'correct': 0, 'wrong':0}
	},
	'pair': {
		'hit':    {'correct': 0, 'wrong':0},
		'stand':  {'correct': 0, 'wrong':0},
		'double': {'correct': 0, 'wrong':0},
		'split':  {'correct': 0, 'wrong':0}
	}
};

// typeName: hard, soft, or pair
function getTypeAccuracy(typeName) {
	let correct = wrong = 0;
	for(optionName in stats[typeName]) { // hit, stand, double, split
		correct += stats[typeName][optionName]['correct'];
		wrong += stats[typeName][optionName]['wrong'];
	}
	return [correct, wrong];
}

// optionName: hit, stand, double, split
function getOptionAccuracy(optionName) {
	let correct = wrong = 0;
	for(typeName in stats) { // hard, soft, pair
		correct += stats[typeName][optionName]['correct'];
		wrong += stats[typeName][optionName]['wrong'];
	}
	return [correct, wrong];
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function getPercentStr(numCorrect, numWrong) {
	if(numCorrect==0 && numWrong==0)
		return '0%';
	return Math.round(numCorrect/(numCorrect+numWrong)*10000)/100 + '%'; 
}

let typeNames = 'hard soft pair'.split(' ');
let optionNames = 'hit stand double split'.split(' ');

function updateStats(selectedOption, correctOption, playerValue, dealerValue, handIsSoft, handIsSplit) {
	let correctWrong = selectedOption==correctOption ? 'correct' : 'wrong';
	let typeName = '';
	if(handIsSplit)
		typeName = 'pair';
	else if(handIsSoft)
		typeName = 'soft';
	else
		typeName = 'hard';

	stats[typeName][correctOption.toLowerCase()][correctWrong]++;

	updateStatDisplay();
}
function updateStatDisplay() {
	let statHTML = '';

	for(let i=0; i<typeNames.length; i++) {
		let typeAccuracy = getTypeAccuracy(typeNames[i]);
		statHTML += capitalize(typeNames[i]) + ': ' + typeAccuracy[0] + ' / ' + (typeAccuracy[0]+typeAccuracy[1]) +
			' &mdash;&mdash; ' + getPercentStr(typeAccuracy[0], typeAccuracy[1]) + '<br>';
	}

	statHTML += '<hr>';

	for(let i=0; i<optionNames.length; i++) {
		let optionAccuracy = getOptionAccuracy(optionNames[i]);
		statHTML += capitalize(optionNames[i]) + ': ' + optionAccuracy[0] + ' / ' + (optionAccuracy[0]+optionAccuracy[1]) +
			' &mdash;&mdash; ' + getPercentStr(optionAccuracy[0], optionAccuracy[1]) + '<br>';
	}

	statHTML += '<hr><details><summary>More Stats</summary><span>';

	for(let i=0; i<typeNames.length; i++) {
		for(let j=0; j<optionNames.length; j++) {
			let correctNum = stats[typeNames[i]][optionNames[j]]['correct'];
			let wrongNum = stats[typeNames[i]][optionNames[j]]['wrong'];
			statHTML += capitalize(typeNames[i]) + ' &mdash; ' + capitalize(optionNames[j]) + ': ' + correctNum + ' / ' + (correctNum+wrongNum) +
				' &mdash;&mdash; ' + getPercentStr(correctNum,wrongNum) + '<br>';
		}
	}

	statHTML += '</span></details>';

	$('#statModalDiv').html(statHTML);
}