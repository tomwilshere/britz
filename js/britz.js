// Construct a britz object
function britz(wpm) {
	// Default speed 250 words per minute
	this.wpm = wpm || 250;
	this.delay = this.calculateDelay(this.wpm);
}

// Read a bunch of text!
britz.prototype.read = function(text) {
	var words = this.preprocess(text);
	for (var i = 0; i < words.length; i++) {
		this.readWord(words[i]);
	}
}

// Read a word by setting a timeout for the word's delay
// and displaying it afterwards
britz.prototype.readWord = function(word) {
	var that = this;
	setTimeout(function() {
		that.display(word.word);
	}, word.delay);
}

// Give back a data structure containing each word and
// it's calculated delay
britz.prototype.preprocess = function(text) {
	var words = text.split(" ");
	var data = [];
	for (var i = 0; i < words.length; i++) {
		data.push({
			word: words[i],
			delay: this.delay*i
		});
	}
	return data;
}

// Display a word to the screen
britz.prototype.display = function(word) {
	console.log(word);
}

// Convert words per minute to a delay time
britz.prototype.calculateDelay = function(wpm) {
	return 60000 / wpm;
}