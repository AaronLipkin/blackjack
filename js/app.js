$(() => {
	const cards = []
	const suits = ['Diamonds','Hearts','Spades','Clubs'];
	const faces = ['A',2,3,4,5,6,7,8,9,10,'Jack','Queen','King'];

	//Creating a class for cards with their Blackjack value
	class Card {
		constructor(suit,face) {
			this.suit = suit
			this.face = face
		}
		evaluate() {
		if (this.face === 'A'){
			this.value = 11
		}
		else if (this.face === 'Jack' || this.face === 'Queen' || this.face === 'King') {
			this.value = 10
		}
		else {
			this.value = this.face;
		}
	}
	}

	//Creating a deck of cards
	for (suit of suits) {
		for (face of faces) {
			newCard = new Card(suit,face)
			newCard.evaluate()
			cards.push(newCard)
		}
	}
	console.log(cards)
})