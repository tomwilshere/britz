// Construct a britz object
function britz(containerId) {
	// Default container is britz-output
	this.container = containerId || 'britz-output';

	this.maxFocalIndex = 4;
	this.output = "britz-word-output";
	this.punctuation = {
		short: ",:;-",
		long: ".!?"
	};

	var html = "<div class=\"britz-word\"><div id=\"britz-top\">" + this.makeSpaces(this.maxFocalIndex) + "|" + "</div>";
	html += "<div id=\"" + this.output + "\">" + this.makeSpaces(1) + "</div>";
	html += "<div id=\"britz-bottom\">" + this.makeSpaces(this.maxFocalIndex) + "|" + "</div></div>";
	$('#' + this.container).html(html);
}

// Read a bunch of text!
britz.prototype.read = function(text, wpm) {
	// Default speed 250 words per minute
	wpm = wpm || 250;
	var delay = this.calculateDelay(wpm);

	var words = this.preprocess(text, delay);

	var currentDelay = 0;
	for (var i = 0; i < words.length; i++) {
		this.readWord(words[i].word, currentDelay);
		currentDelay += words[i].delay;
	}
}

// Read a word by setting a timeout for the word's delay
// and displaying it afterwards
britz.prototype.readWord = function(word, delay) {
	var that = this;
	setTimeout(function() {
		that.display(word);
	}, delay);
}

// Give back a data structure containing each word and
// it's calculated delay
britz.prototype.preprocess = function(text, delay) {
	var words = text.split(" ");
	var data = [];
	for (var i = 0; i < words.length; i++) {
		if(words[i].length > 0) {
			var lastLetter = words[i].charAt(words[i].length - 1);
			var augmentedDelay = delay;

			if(this.punctuation.short.indexOf(lastLetter) >= 0) {
				augmentedDelay += delay;
			} else if(this.punctuation.long.indexOf(lastLetter) >= 0) {
				augmentedDelay += 2 * delay;
			}

			data.push({
				word: words[i],
				delay: augmentedDelay
			});
		}
	}

	// Clear the display to finish
	data.push({
		word: " ",
		delay: delay
	});

	return data;
}

// Display a word to the screen
britz.prototype.display = function(word) {
	var focalIndex = this.focalLetterIndex(word);
	var start = word.substring(0, focalIndex);
	var focalLetter = word.charAt(focalIndex);
	var end = word.substring(focalIndex+1, word.length);
	
	var numSpaces = this.maxFocalIndex - focalIndex;

	var spaces = this.makeSpaces(numSpaces);

	var britzword = spaces + start + "<span class=\"focal-letter\">" + focalLetter + "</span>" + end;
	var html = "<span class=\"britz-word\">" + britzword + "</span>";

	$('#' + this.output).html(html);
}

// Convert words per minute to a delay time
britz.prototype.calculateDelay = function(wpm) {
	return 60000 / wpm;
}

// Return the index of the letter to highlight/centre around
britz.prototype.focalLetterIndex = function(word) {
	var focalLetter = 1;

	switch (word.length) {
	case 1:
		focalLetter = 0;
		break;
	case 2:
	case 3:
	case 4:
	case 5:
		focalLetter = 1;
		break;
	case 6:
	case 7:
	case 8:
	case 9:
		focalLetter = 2;
		break;
	case 10:
	case 11:
	case 12:
	case 13:
		focalLetter = 3;
		break;
	default:
		focalLetter = 4;
	};

	return focalLetter;
}

britz.prototype.makeSpaces = function(numSpaces) {
	var spaces = "";
	for(var i = 0; i < numSpaces; i++) {
		spaces += "&nbsp";
	}
	return spaces;
}