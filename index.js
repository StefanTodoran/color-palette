/*
  Stefan Todoran
  3/29/2022
  Section AF, Lucas & Shriya

  This is the javascript that handles randomization of the color palette,
  removal of color cards, adding of middle color cards, and moving of color cards.
*/

'use strict';
(function () {

    window.addEventListener('load', init);

    /** initialization function for the site */
    function init() {
        setCardColors();
        setCardListeners();
        let random = document.querySelector('#randomize');
        random.addEventListener('click', randomizeColors);
    }

    /** Sets the background color of each color card to its span's hex color. */
    function setCardColors() {
        let cards = document.querySelectorAll('.color-card');
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            card.classList.remove('place-holder-fill');
            let color = card.querySelector('span');
            card.style.backgroundColor = color.textContent;
        }
    }

    /** Creates the event listeners for each of the buttons on each of the cards. */
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

            let colorPicker = card.querySelector('input');
            colorPicker.addEventListener('change', colorChange);
            colorPicker.card = card;

            let addMiddle = card.querySelector('.add-middle-button');
            addMiddle.addEventListener('click', addCard);
            addMiddle.card = card;
        }
    }

    /**
     * Removes the color card whose remove button was clicked.
     * @param {Event} evt event object for the event which triggered the function
     * @return no return value
     */
    function removeCard(evt) {
        let container = document.querySelector('#colors-container');
        container.removeChild(evt.currentTarget.card);
    }

    /**
     * Finds the position of the provided card in the cards section.
     * @param {NodeListOf<Element>} cards list of color cards in cards section
     * @param {Element} card the specific card to find the position of
     * @return {number} the 0-index position of the card
     */
    function findCard(cards, card) {
        let pos;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i] === card) {
                pos = i;
            }
        }
        return pos;
    }

    /**
     * Moves the card whose move left button was clicked to the left, or
     * does nothing if it is the leftmost card.
     * @param {Event} evt event object for the event which triggered the function
     * @return no return value
     */
    function moveCardLeft(evt) {
        let cards = document.querySelectorAll('.color-card');
        let pos = findCard(cards, evt.currentTarget.card);
        if (pos === 0) {
            return
        }
        // learned the line below from:
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        cards[pos].parentNode.insertBefore(cards[pos],cards[pos-1]);
    }

    /**
     * Move the card whose move right button was clicked to the right, or
     * does nothing if it is the rightmost card.
     * @param {Event} evt event object for the event which triggered the function
     * @return no return value
     */
    function moveCardRight(evt) {
        let cards = document.querySelectorAll('.color-card');
        let pos = findCard(cards, evt.currentTarget.card);
        if (pos === cards.length) {
            return
        }
        // learned the line below from:
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        cards[pos].parentNode.insertBefore(cards[pos],cards[pos+2]);
    }

    /**
     * Finds the color value that is the midpoint between the card whose + was clicked
     * and the card to its right. If there is no card to its right, just uses that card's
     * color. Then, creates a new card with the middle color and inserts it after the
     * clicked card.
     * @param {Event} evt event object for the event which triggered the function
     * @return no return value
     */
    function addCard(evt) {
        let cards = document.querySelectorAll('.color-card');
        let pos = findCard(cards, evt.currentTarget.card);

        let colorA, colorB;
        colorA = cards[pos].querySelector('span').textContent;
        if (pos === cards.length) {
            colorB = colorA;
        } else {
            colorB = cards[pos+1].querySelector('span').textContent;
        }
        let rgba = convertToRBG(colorA);
        let rgbb = convertToRBG(colorB);
        let middle = convertToHex((rgba[0]+rgbb[0])/2,(rgba[1]+rgbb[1])/2,(rgba[2]+rgbb[2])/2);

        let newCard = cards[0].cloneNode(true);
        let span = newCard.querySelector('span');
        let input = newCard.querySelector('input');
        newCard.style.backgroundColor = middle;
        span.textContent = middle;
        input.value = middle;

        let container = document.querySelector('#colors-container');
        container.insertBefore(newCard,cards[pos+1]);

        setCardListeners();
    }

    /**
     * Triggers when an input's color value is changed, updates the cards span text and
     * backgroundColor style property.
     * @param {Event} evt event object for the event which triggered the function
     * @return no return value
     */
    function colorChange(evt) {
        const color = evt.target.value;
        let span = evt.currentTarget.card.querySelector('span');
        span.textContent = color;
        evt.currentTarget.card.style.backgroundColor = color;
    }

    /** Sets the span and input of each card to a random color. Then, calls setCardColors
     * to update all card backgroundColor properties. */
    function randomizeColors() {
        let cards = document.querySelectorAll('.color-card');
        for (let i = 0; i < cards.length; i++) {
            let color = getRandomColor();
            let span = cards[i].querySelector('span');
            span.textContent = color;
            let input = cards[i].querySelector('input');
            input.value = color;
        }
        setCardColors();
    }

    /* === HELPER FUNCTIONS === */

    /**
     * Converts a hexadecimal color to its red green blue components.
     * @param {string} hexColor hexadecimal string to be converted
     * @return {number[]} array of length three of the form [red, green, blue]
     */
    function convertToRBG(hexColor) {
        const r = parseInt(hexColor.substr(1,2), 16);
        const g = parseInt(hexColor.substr(3,2), 16);
        const b = parseInt(hexColor.substr(5,2), 16);
        return [r, g, b];
    }

    /**
     * Converts red green blue components to a hexadecimal color string.
     * @param {number} red red component of the color
     * @param {number} green green component of the color
     * @param {number} blue blue component of the color
     * @return {string} hexadecimal color string corresponding to the components
     */
    function convertToHex(red, green, blue) {
        return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
    }

    /**
     * Do not call. Helper function for convertToHex that converts a single color component
     * to a 2 digit hexadecimal string.
     * @param {number} color single rbg component
     * @return {string} 2 digit hexadecimal color string equivalent
     */
    function colorToHex(color) {
        let hex = color.toString(16).substr(0,2);
        return hex.length === 1 ? "0" + hex : hex;
    }

    /** Returns a random, valid, hexadecimal color string. */
    function getRandomColor() {
        let hex = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += hex[Math.floor(Math.random() * 16)];
        }
        return color;
    }

})();
