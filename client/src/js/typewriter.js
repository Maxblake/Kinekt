class TypeWriter {
  constructor(txtElement, words, wait) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = "";
    this.wordIndex = 0;
    this.wait = wait;
    this.isDeleting = false;
    this.isOn = false;
  }

  start() {
    if (!this.isOn) {
      this.isOn = true;
      this.type();
    }
  }

  stop() {
    this.isOn = false;
  }

  type() {
    if (!this.isOn) this.isDeleting = true;

    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span>${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 120;

    if (this.isDeleting) {
      typeSpeed = 80;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    if (this.isOn || this.isDeleting) {
      this.activeThreadExists = true;
      setTimeout(() => this.type(), typeSpeed);
    }
  }
}

export default TypeWriter;
