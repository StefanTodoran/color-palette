'use strict';
(function () {

    window.addEventListener('load', init);

    function init() {
        setCardColors();
        setCardListeners();
    }

    function setCardColors() {
        let cards = document.querySelectorAll('.color-card');
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            card.classList.remove('place-holder-fill');
            let color = card.querySelector('span');
            card.style.backgroundColor = color.textContent;
        }
    }

    function setCardListeners() {
        let cards = document.querySelectorAll('.color-card');
        // learned the argument stuff used in this method from a stackoverflow on
        // 'how to pass arguments to addEventListener'
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            let remove = card.querySelector('.remove-button');
            remove.addEventListener('click', removeCard);
            remove.card = card;

            let left = card.querySelector('.move-left-button');
            left.addEventListener('click', moveCardLeft);
            left.card = card;

            let right = card.querySelector('.move-right-button');
            right.addEventListener('click', moveCardRight);
            right.card = card;
        }
    }

    function removeCard(evt) {
        let container = document.querySelector('#colors-container');
        container.removeChild(evt.currentTarget.card);
    }

    function moveCardLeft(evt) {
        let cards = document.querySelectorAll('.color-card');
        let len = cards.length;
        let pos;
        for (let i = 0; i < len; i++) {
            if (cards[i] === evt.currentTarget.card) {
                pos = i;
            }
        }
        if (pos === 0) {
            return
        }
        // learned the line below from:
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        cards[pos].parentNode.insertBefore(cards[pos],cards[pos-1]);
    }

    function moveCardRight(evt) {
        let cards = document.querySelectorAll('.color-card');
        let len = cards.length;
        let pos;
        for (let i = 0; i < len; i++) {
            if (cards[i] === evt.currentTarget.card) {
                pos = i;
            }
        }
        if (pos === len) {
            return
        }
        // learned the line below from:
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        cards[pos].parentNode.insertBefore(cards[pos],cards[pos+2]);
    }

})();
