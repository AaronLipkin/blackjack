$(() => {
	const cards = []
	const suits = ['Diamonds','Hearts','Spades','Clubs'];
	const faces = ['A',2,3,4,5,6,7,8,9,10,'Jack','Queen','King'];
	let playerHand = []
	let dealerHand = []
	$message = $('.win-lose')
	let bank = 500;
	let pot = 0;
	
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
				this.image = "images/cards/" + this.face.toLowerCase() + "_of_" + this.suit.toLowerCase() + '.png'
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
			$('#dealer-hand').append($('<div>').addClass("card").css('background-image','url("' + dealerHand[0].image + '")'))
			$('#dealer-hand').append($('<div>').addClass("card back").css('background-image','url("' + dealerHand[0].back + '")'))
	}

	const hit = () => {
		newCard = cards.pop()
		playerHand.push(newCard)
		$('#player-hand').append($('<div>').addClass("card").css('background-image','url("' + newCard.image + '")'))
		if (valueHand(playerHand) > 21) {
			$message.text('You lose!')
			roundOver()
		}
	}
	
	const dealerLogic = () => {
		$('#hit').off('click',hit)
		$('#dealer-hand > .back').css('background-image', 'url("' + dealerHand[1].image+ '")').removeClass('back')
		let dealerValue = valueHand(dealerHand)
		while(dealerValue < 17) {
			newCard = cards.pop()
			dealerHand.push(newCard)
			$('#dealer-hand').append($('<div>').addClass("card").css('background-image','url("' + newCard.image + '")'))
			dealerValue += newCard.value
		}
		if (valueHand(dealerHand) > 21 || valueHand(dealerHand) < valueHand(playerHand)) {
			$message.text('You win!')
			roundOver()
		}
		else if (valueHand(dealerHand) === valueHand(playerHand)) {
			$message.text('Its a tie!')
			roundOver()
		}
		else {
			$message.text('You lose!')
			roundOver()
		}
	}
	
	const start = () => {
		$message.text('')
		clearTable()
		shuffleArray(cards)
		deal(cards);
		$('.buttons').css('display','flex')
		$('#hit').on('click',hit)
		$('#stand').one('click',dealerLogic)
		console.log(cards.length)
	}

	const roundOver = () => {
		$('#dealer-hand > .back').css('background-image', 'url("' + dealerHand[1].image+ '")').removeClass('back')
		$('#hit').off('click',hit)
		$('#stand').off('click',dealerLogic)
	}

	const clearTable = () => {
		playerHand = []
		dealerHand = []
		$('#dealer-hand').empty()
		$('#player-hand').empty()
	}

	$('#start').on('click',start)
	

})