$(() => {
	let cards = []
	const suits = ['Diamonds','Hearts','Spades','Clubs'];
	const faces = ['A',2,3,4,5,6,7,8,9,10,'Jack','Queen','King'];
	let playerHand = []
	let dealerHand = []
	$message = $('.win-lose')
	let bank = 250;
	let pot = 0;
	let playing = false;
	
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

	const win = () => {
		$message.text('You win!')
		bank += 2*pot
		roundOver()
	}

	const lose = () => {
		$message.text('You lose!')
		roundOver()
	}

	const tie = () => {
		$message.text('You tie!')
		bank += pot
		roundOver()
	}

	const natural = () => {
		if(valueHand(playerHand) === 21 && valueHand(dealerHand) === 21) {
			tie()
		}
		else if (valueHand(playerHand) === 21) {
			bank += pot
			win()
		}
		else if (valueHand(dealerHand) === 21) {
			lose()
		}
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
	const makeDeck = () => {
		cards = [];
		for(i=0;i<6;i++) {
			for (suit of suits) {
				for (face of faces) {
					newCard = new Card(suit,face)
					newCard.evaluate()
					cards.push(newCard)
				}
			}
		}
	}

	const deal = (deck) => {
		playerHand.push(deck.pop())
		dealerHand.push(deck.pop())
		playerHand.push(deck.pop())
		dealerHand.push(deck.pop())

		for(card of playerHand) {
			$('#player-hand').append($('<div>').addClass("card").css('background-image','url("' + card.image + '")'))
		}
			$('#dealer-hand').append($('<div>').addClass("card").css('background-image','url("' + dealerHand[0].image + '")'))
			$('#dealer-hand').append($('<div>').addClass("card back").css('background-image','url("' + dealerHand[0].back + '")'))
	}

	$('.chip').on('click', (e) => {
		if(playing == false) {
			let wager = parseInt($(e.currentTarget).attr('value'))
			if(bank >= wager) {
				pot += wager
				bank -= wager
				console.log(pot)
				$('#pot').text('pot: ' + pot)
				$('#bank').text('bank: ' + bank)
				let newChip = $(e.currentTarget).clone().addClass('inpot')
				newChip.off('click')
				newChip.on('click', (e) => {
					console.log('working')
					if(playing == false) {
						pot -= parseInt($(e.currentTarget).attr('value'))
						bank += parseInt($(e.currentTarget).attr('value'))
						$(e.currentTarget).remove()
						$('#pot').text('pot: ' + pot)
						$('#bank').text('bank: ' + bank)
					}
				})
				$('#chippot').append(newChip)
			}
		}
	})

	const hit = () => {
		newCard = cards.pop()
		playerHand.push(newCard)
		$('#player-hand').append($('<div>').addClass("card").css('background-image','url("' + newCard.image + '")'))
		if (valueHand(playerHand) > 21) {
			for(card of playerHand) {
				console.log(card)
				if (card.isAce) {
					card.value = 1
				}
			}
		}

		$('#player-score').text(valueHand(playerHand))
		if (valueHand(playerHand) > 21) {
			$('#player-score').text('Bust! (' + valueHand(playerHand) + ')')
			lose()
		}
	}

	const doubleDown = () => {
		if (valueHand(playerHand) >= 9 && valueHand(playerHand) <= 11) {
			$('#double-down').removeAttr('disabled').css("cursor", "auto")
			$('#double-down').one('click', () => {
					bank -= pot
					pot = 2*pot
					hit()
					dealerLogic()
					pot = pot/2
			})
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
			$('#dealer-score').text(valueHand(dealerHand))
		}
		if (valueHand(dealerHand) > 21) {
			for(card of dealerHand) {
				if (card.value === 11) {
					card.value = 1
				}
			}
		}
		dealerValue = valueHand(dealerHand)
		while(dealerValue < 17) {
			newCard = cards.pop()
			dealerHand.push(newCard)
			$('#dealer-hand').append($('<div>').addClass("card").css('background-image','url("' + newCard.image + '")'))
			dealerValue += newCard.value
			$('#dealer-score').text(valueHand(dealerHand))
		}
		if (valueHand(dealerHand) > 21) {
			for(card of dealerHand) {
				if (card.value === 11) {
					card.value = 1
				}
			}
		}
		$('#dealer-score').text(valueHand(dealerHand))
		if (valueHand(dealerHand) > 21 || valueHand(dealerHand) < valueHand(playerHand)) {
			win()
		}
		else if (valueHand(dealerHand) === valueHand(playerHand)) {
			tie()
		}
		else {
			lose()
		}
	}
	
	const start = () => {
		$('#bank').text('bank: ' + bank)
		clearTable()
	}

	const newHand = () => {
		if(pot >0) {
			if(cards.length < 75) {
				makeDeck()
				$('.deck').text('Shuffling')
				let timeout = setTimeout(function () {$('.deck').text('')}, 1000)
			}
			$message.text('')
			playing = true;
			clearTable()
			shuffleArray(cards)
			$('#bank').text('bank: ' + bank)
			console.log(pot)
			deal(cards);
			$('#player-score').text('')
			$('#dealer-score').text('')
			$('#player-score').text(valueHand(playerHand))
			$('.buttons').css('display','flex')
			$('#hit').off('click',hit)
			$('#hit').on('click',hit)
			$('#stand').one('click',dealerLogic)
			console.log(cards.length)
			natural()
			if (valueHand(playerHand) > 21) {
				for(card of playerHand) {
					console.log(card)
					if (card.isAce) {
						card.value = 1
					}
				}
			}
			doubleDown()
			$('#pot').text('pot: ' + pot)
			$('#bank').text('bank: ' + bank)
		}
	}

	const roundOver = () => {
		bank -= pot;
		$('#dealer-hand > .back').css('background-image', 'url("' + dealerHand[1].image+ '")').removeClass('back')
		$('#hit').off('click',hit)
		$('#stand').off('click',dealerLogic)
		$('#pot').text('pot: ' + pot)
		$('#bank').text('bank: ' + bank)
		playing = false;
		if(bank + pot === 0) {
			$('#end').css('display','block')
			setTimeout(function () {$('#bankrupt').css('display','block')}, 1000)
			setTimeout(function () {$('.play-again').css('display','block')}, 2000)
		}
	}

	const clearTable = () => {
		playerHand = []
		dealerHand = []
		$('#dealer-hand').empty()
		$('#player-hand').empty()
		$('#double-down').attr('disabled','disabled').css("cursor", "not-allowed");
	}

	makeDeck()
	start()
	

	$('#play').on('click', () => {
		$('#menu').css('display','none')
		$('#game').css('display','block')
	})
	$('.deck').text('Shuffling')
	let timeout = setTimeout(function () {$('.deck').text('')}, 1000)
	$('#start').on('click',newHand)
	$('#rules').on('click',()=> {
		$('#rules-box').css('display','block')
	})
	$('.x-out').on('click',()=> {
		$('#rules-box').css('display','none')
	})
	
	$('#shutup').prop('volume',0.1);

	$('#vol').on('click',()=> {
		if ($('#vol').hasClass('playing')) {
			$('#vol').attr('src','images/mute.png')
			$('#vol').removeClass('playing')
			$('#shutup').prop('muted',true)
		}
		else {
			$('#vol').attr('src','images/vol.png')
			$('#vol').addClass('playing')
			$('#shutup').prop('muted',false)
		}
	})


})