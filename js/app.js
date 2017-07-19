$(() => {
	const cards = []
	const suits = ['Diamonds','Hearts','Spades','Clubs'];
	const faces = ['A',2,3,4,5,6,7,8,9,10,'Jack','Queen','King'];
	let playerHand = []
	let dealerHand = []
	$message = $('.win-lose')
	
		/**
	 * Randomize array element order in-place.
	 * Using Durstenfeld shuffle algorithm.
	 */
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}

	function valueHand(hand) {
		let value = 0;
		for(element of hand) {
			value += element.value
		}
		return value
	}

	//Creating a class for cards with their Blackjack value
	class Card {
		constructor(suit,face) {
			this.suit = suit
			this.face = face
			this.back = 'images/cards/GAback.png'
			this.isAce = false
		}
		evaluate() {
			if (this.face === 'A'){
				this.value = 11
				this.isAce = true
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
	//Creating 6 decks of cards
	for(i=0;i<6;i++) {
		for (suit of suits) {
			for (face of faces) {
				newCard = new Card(suit,face)
				newCard.evaluate()
				cards.push(newCard)
			}
		}
	}

	const deal = (deck) => {
		playerHand.push(deck.pop())
		playerHand.push(deck.pop())
		dealerHand.push(deck.pop())
		dealerHand.push(deck.pop())

		for(card of playerHand) {
			$('#player-hand').append($('<div>').addClass("card").css('background-image','url("' + card.image + '")'))
		}
		for(card of dealerHand) {
			$('#dealer-hand').append($('<div>').addClass("card").css('background-image','url("' + card.image + '")'))
		}
	}

	const hit = () => {
		newCard = cards.pop()
		playerHand.push(newCard)
		$('#player-hand').append($('<div>').addClass("card").css('background-image','url("' + newCard.image + '")'))
		if (valueHand(playerHand) > 21) {
			$message.text('You lose!')
		}
	}
	
	const dealerLogic = () => {
		$('#hit').off('click',hit)
		let dealerValue = valueHand(dealerHand)
		while(dealerValue < 17) {
			newCard = cards.pop()
			dealerHand.push(newCard)
			$('#dealer-hand').append($('<div>').addClass("card").css('background-image','url("' + newCard.image + '")'))
			dealerValue += newCard.value
		}
		if (valueHand(dealerHand) > 21) {
			$message.text('You win!')
		}
	}
	
	const start = () => {
		shuffleArray(cards)
		deal(cards);
		
	}

	$('#start').on('click',start)
	$('#hit').on('click',hit)
	$('#stand').one('click',dealerLogic)

})