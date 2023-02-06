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

  /** Sets the background color of each color card to its input's hex color. */
  function setCardColors() {
    let cards = document.querySelectorAll('.color-card');
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      card.classList.remove('place-holder-fill');
      let color = card.querySelector('.color-input');
      card.style.backgroundColor = color.value;
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

      let colorInput = card.querySelector('.color-input');
      colorInput.addEventListener('change', colorChange);
      colorInput.card = card;

      let addMiddle = card.querySelector('.add-middle-button');
      addMiddle.addEventListener('click', addCard);
      addMiddle.card = card;
      if (i !== 0) {
        addMiddle.classList.remove('hidden');
      } else {
        addMiddle.classList.add('hidden');
      }

      let copyButton = card.querySelector('.copy-button');
      copyButton.addEventListener('click', copyColor);
      copyButton.card = card;
    }
  }

  /**
   * Removes the color card whose remove button was clicked.
   * @param {Event} evt event object for the event which triggered the function
   */
  function removeCard(evt) {
    let container = document.querySelector('#colors-container');
    let cards = document.querySelectorAll('.color-card');
    let pos = findCard(cards, evt.currentTarget.card);
    if (pos === 0) {
      let addMiddle = cards[pos + 1].querySelector('.add-middle-button');
      addMiddle.classList.add('hidden');
    }
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

    if (pos === 1) {
      let addMiddleCur = cards[pos].querySelector('.add-middle-button');
      addMiddleCur.classList.add('hidden');
      let addMiddlePrv = cards[pos - 1].querySelector('.add-middle-button');
      addMiddlePrv.classList.remove('hidden');
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

    if (pos === 0) {
      let addMiddleCur = cards[pos].querySelector('.add-middle-button');
      addMiddleCur.classList.remove('hidden');
      let addMiddleNxt = cards[pos + 1].querySelector('.add-middle-button');
      addMiddleNxt.classList.add('hidden');
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
    colorA = cards[pos].querySelector('.color-input').value;
    colorB = cards[pos - 1].querySelector('.color-input').value;

    let rgba = convertToRBG(colorA);
    let rgbb = convertToRBG(colorB);
    let middle = convertToHex(
        (rgba[0] + rgbb[0]) / 2,
        (rgba[1] + rgbb[1]) / 2,
        (rgba[2] + rgbb[2]) / 2
    ).toUpperCase();

    let newCard = cards[0].cloneNode(true);
    // let colorInput = newCard.querySelector('.color-input');
    let colorPicker = newCard.querySelector('input');
    // newCard.style.backgroundColor = middle;
    // colorInput.value = middle;
    colorPicker.value = middle;
    updateCardColor(newCard, middle);

    let container = document.querySelector('#colors-container');
    container.insertBefore(newCard, cards[pos]);

    setCardListeners();
  }

  /**
   * Triggers when an input's color value is changed, updates the cards text input and
   * backgroundColor style property. Has some validation logic, which will only matter
   * if this function is triggered by the text input.
   * @param {Event} evt event object for the event which triggered the function
   */
  function colorChange(evt) {
    let color = evt.target.value.replace(/[^A-Fa-f0-9]/g, "");
    if (color.length >= 7 && !color.includes("#")) {
      // Something is off, we can just chop excess off the string and hope for the best
      color = "#" + color.substring(0, 6);
    }
    if (color.length === 6 && !color.includes("#")) {
      // Looks like a valid hex, but missing the '#'
      color = "#" + color;
    }
    if (color.length < 6) {
      // Not valid, so we should undo the text input value change
      const colorPicker = evt.currentTarget.parentNode.querySelector('input');
      color = colorPicker.value;
    }
    updateCardColor(evt.currentTarget.card, color);
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
    let colorInput = card.querySelector('.color-input');
    colorInput.value = color.toUpperCase();
    if (!isLightColor(color)) {
      let buttons = card.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('light-ui');
      }
      colorInput.classList.add('light-ui');
    } else {
      let buttons = card.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('light-ui');
      }
      colorInput.classList.remove('light-ui');
    }
  }

  /**
   * On click function for the input displaying card color hex. Copies color to clipboard.
   * Also handles the tooltip, changing the text.
   * @param {Event} evt event object for the event which triggered the function
   */
  function copyColor(evt) {
    let color = evt.currentTarget.card.querySelector('.color-input');
    navigator.clipboard.writeText(color.value);
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
