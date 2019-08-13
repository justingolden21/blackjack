// Data Utility Functions
// Return the players expected value if they take that action given those hands

/* Example: 
double with hard 4 against dealer 2
doubleData['hard 4']['2']
*/

function getDoubleOdds(playerValue, dealerValue, isSoft) {
	return doubleData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];
}
function getHitOdds(playerValue, dealerValue, isSoft) {
	return hitData[(isSoft?'soft ':'hard ') + playerValue][dealerValue.toString()];	
}
function getSplitOdds(playerValue, dealerValue, isSoft) {
	if(isSoft)
		return splitData['pair ace'][dealerValue.toString()];
	return splitData['pair ' + playerValue/2][dealerValue.toString()];
}
function getStandOdds(playerValue, dealerValue) {
	return standData[playerValue.toString()][dealerValue.toString()];
}

function getCorrectOption(playerValue, dealerValue, isSoft, isSplit) {
	let doubleOdds = getDoubleOdds(playerValue, dealerValue, isSoft);
	let hitOdds = getHitOdds(playerValue, dealerValue, isSoft);
	let splitOdds = -2; // default so we never pick split as best option if hand isn't split
	if(isSplit)
		splitOdds = getSplitOdds(playerValue, dealerValue, isSoft);
	let standOdds = getStandOdds(playerValue, dealerValue);

	let bestOdds = Math.max(doubleOdds, hitOdds, splitOdds, standOdds);
	if(bestOdds==doubleOdds) { return 'Double'; }
	if(bestOdds==hitOdds) { return 'Hit'; }
	if(bestOdds==standOdds) { return 'Stand'; }
	if(bestOdds==splitOdds) { return 'Split'; }
}