class Card {
	constructor(val, char) {
		this.char = char;
		this.isRed = val[0] == 'b' || val[0] == 'c'; // heart or diamond
		this.value = parseInt(val[1]); //a through e is 10
		if(isNaN(this.value) )
			this.value = 10;
		this.type = (this.value==1 ? 'Ace' : val[1]=='b' ? 'Jack' : val[1]=='d' ? 'Queen' : val[1]=='e' ? 'King' : this.value);
	}
}

function buildDeck() { // creates 52 card deck
	deck = [];
	let vals = '123456789abde'.split('');
	let suits = 'abcd'.split('');
	for(let i=0; i<vals.length; i++) {
		for(let j=0; j<suits.length; j++) {
			deck.push(new Card(suits[j]+vals[i],'&#x1f0' + suits[j] + vals[i] + ';') );
		}
	}
}

function isSoft(cards) {
	return cards[0].value==1 || cards[1].value==1;
}
function isSplit(cards) {
	if($('#pair10Checkbox').is(':checked') )
		return cards[0].value == cards[1].value;
	return cards[0].type == cards[1].type;
}
function getRandomCard(deck) { // remove card and return it
	let idx = Math.floor(Math.random()*deck.length);
	let randCard = deck[idx];
	deck.splice(idx, 1); // remove card
	return randCard;
}