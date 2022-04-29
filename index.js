'use strict';
(function() {

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

    /*
     * learned the argument stuff used in this method from a stackoverflow on
     * 'how to pass arguments to addEventListener'
     */
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

      let colorLabel = card.querySelector('.color-value');
      colorLabel.addEventListener('click', copyColor);
      colorLabel.card = card;
    }
  }

  /**
   * Removes the color card whose remove button was clicked.
   * @param {Event} evt event object for the event which triggered the function
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
   */
  function moveCardLeft(evt) {
    let cards = document.querySelectorAll('.color-card');
    let pos = findCard(cards, evt.currentTarget.card);
    if (pos === 0) {
      return;
    }

    /*
     * learned the line below from:
     * https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
     */
    cards[pos].parentNode.insertBefore(cards[pos], cards[pos - 1]);
  }

  /**
   * Move the card whose move right button was clicked to the right, or
   * does nothing if it is the rightmost card.
   * @param {Event} evt event object for the event which triggered the function
   */
  function moveCardRight(evt) {
    let cards = document.querySelectorAll('.color-card');
    let pos = findCard(cards, evt.currentTarget.card);
    if (pos === cards.length) {
      return;
    }

    /*
     * learned the line below from:
     * https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
     */
    cards[pos].parentNode.insertBefore(cards[pos], cards[pos + 2]);
  }

  /**
   * Finds the color value that is the midpoint between the card whose + was clicked
   * and the card to its right. If there is no card to its right, just uses that card's
   * color. Then, creates a new card with the middle color and inserts it after the
   * clicked card.
   * @param {Event} evt event object for the event which triggered the function
   */
  function addCard(evt) {
    let cards = document.querySelectorAll('.color-card');
    let pos = findCard(cards, evt.currentTarget.card);

    let colorA, colorB;
    colorA = cards[pos].querySelector('span').textContent;
    if (pos === cards.length) {
      colorB = colorA;
    } else {
      colorB = cards[pos + 1].querySelector('span').textContent;
    }
    let rgba = convertToRBG(colorA);
    let rgbb = convertToRBG(colorB);
    let middle = convertToHex(
        (rgba[0] + rgbb[0]) / 2,
        (rgba[1] + rgbb[1]) / 2,
        (rgba[2] + rgbb[2]) / 2
    );

    let newCard = cards[0].cloneNode(true);
    let span = newCard.querySelector('span');
    let input = newCard.querySelector('input');
    newCard.style.backgroundColor = middle;
    span.textContent = middle;
    input.value = middle;

    let container = document.querySelector('#colors-container');
    container.insertBefore(newCard, cards[pos + 1]);

    setCardListeners();
  }

  /**
   * Triggers when an input's color value is changed, updates the cards span text and
   * backgroundColor style property.
   * @param {Event} evt event object for the event which triggered the function
   */
  function colorChange(evt) {
    updateCardColor(evt.currentTarget.card, evt.target.value);
  }

  /**
   * Updates a card's background and label to the provided color. Also updates the card
   * ui to either be light or dark based on that color's brightness automatically.
   * @param {Element} card the card the change
   * @param {string} color the hex string of the updated color
   */
  function updateCardColor(card, color) {
    card.style.backgroundColor = color;
    card.querySelector('input').value = color;
    let span = card.querySelector('span');
    span.textContent = color;
    if (!isLightColor(color)) {
      span.classList.add('light-ui');
      let buttons = card.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('light-ui');
      }
    } else {
      span.classList.remove('light-ui');
      let buttons = card.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('light-ui');
      }
    }
  }

  /**
   * On click function for the span displaying card color hex. Copies color to clipboard.
   * Also handles the tooltip, changing the text.
   * @param {Event} evt event object for the event which triggered the function
   */
  function copyColor(evt) {
    let span = evt.currentTarget.card.querySelector('span');
    navigator.clipboard.writeText(span.textContent);
    let tooltip = evt.currentTarget.card.querySelector('.tooltip');
    tooltip.textContent = "Copied!";

    setTimeout(function() {
      tooltip.textContent = "Copy to Clipboard";
    }, 2500);
  }

  /**
   * Changes each card to use a random color.
   * to update all card backgroundColor properties.
   */
  function randomizeColors() {
    let cards = document.querySelectorAll('.color-card');
    for (let i = 0; i < cards.length; i++) {
      let color = getRandomColor();
      updateCardColor(cards[i], color);
    }
  }

  /* === HELPER FUNCTIONS === */

  /**
   * Converts a hexadecimal color to its red green blue components.
   * @param {string} hexColor hexadecimal string to be converted
   * @return {number[]} array of length three of the form [red, green, blue]
   */
  function convertToRBG(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
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
    let hex = color.toString(16).substr(0, 2);
    return hex.length === 1 ? "0" + hex : hex;
  }

  /**
   * Returns a random, valid, hexadecimal color string.
   * @return {string} a hex color
   */
  function getRandomColor() {
    let hex = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hex[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Determines whether a color is light or dark. This function is here courtesy of
   * Andreas Wik, see https://awik.io/determine-color-bright-dark-using-javascript/
   * @param color a hex or rgb color string
   * @return {boolean} true if the color is light, false otherwise
   */
  function isLightColor(color) {
    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    }
    else {
      // If hex --> Convert it to RGB: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    return hsp > 127.5;
  }

})();
