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
				this.image = 'images/cards/ace_of_' + this.suit.toLowerCase() + '.png'
			}
			else if (this.face === 'Jack' || this.face === 'Queen' || this.face === 'King') {
				this.value = 10
				this.image = "images/cards/" + this.face + "_of_" + this.suit.toLowerCase() + '.png'
			}
			else {
				this.value = this.face;
				this.image = "images/cards/" + this.face + "_of_" + this.suit.toLowerCase() + '.png'
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
	for(card of cards) {
		$('#table').append($('<div>').addClass("card").css('background-image','url("' + card.image + '")'))
	}
	$('#table').append($('<div>').addClass('card back'))
})