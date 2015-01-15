jQuery(document).ready(function($) {
	initialiseAverage();	
	updateAveragesHTML();
});

// $('#container').on('tap', function() {
// 	// Small Tap, stop the timer if started. Else: do nothing
// 	timerStarted = 0;
// });

// $('#container').on('taphold', function() {
// 	// Long press. Reset the counter and start the timer on release
// 	timerStarted = 1;

// 	$('#timerCounter').addClass('red');
// });

// $('#container').on('tapend', function() {
// 	if (timerStarted) {
// 		console.log("Timer started!");

// 		$('#timerCounter').removeClass('red');
// 	}
// });

function initialiseAverage() {
	var totalTime = 0, trials = 0;
	for (var i = 0; i < 5; i++) {
		if (averages[i] != -1) {
			trials++;
			totalTime += averages[i];
		}
	}
	if (totalTime == 0) {
		average = 0;
	} else {
		average = average = Math.round(totalTime / trials * 100) / 100;
	}
}

var longPress = 0;
var timerStarted = 0;
if (localStorage.getItem('averages') == null) {
	var averages = [-1,-1,-1,-1,-1];
	localStorage.setItem('averages', JSON.stringify(averages));
	console.log('Averages not stored in LS, creating new table');
	console.log(averages);
} else {
	var averages = JSON.parse(localStorage.getItem('averages'));
	console.log('Averages stored in LS, reading the table');
	console.log(averages);
}

function updateAverages(newTime) {
	for (var i = 0; i < 4; i++) {
		averages[i] = averages[i+1];
	}
	averages[4] = newTime;

	localStorage.setItem('averages', JSON.stringify(averages));

	updateAveragesHTML();
}

function updateAveragesHTML() {
	var totalTime = 0, trials = 0;
	for (var i = 0; i < 5; i++) {
		if (averages[i] != -1) {
			trials++;
			totalTime += averages[i];
		}
	}
	average = Math.round(totalTime / trials * 100) / 100;
	$('#timeAVG').html(average ? average : '---');
}


$('#timerCounter').runner({
	
}).on('runnerStop', function(eventObject, info) {
	diff = Math.round(((Math.round(info.time / 10) / 100) - average) * 100) / 100;
	diff = diff ? diff : 0;

	if (diff >= 0) {
		$('#response').html('<span class="red">' + diff + ' seconds more</span> than your current average');
	} else {
		diff *= -1;
		$('#response').html('<span class="green">' + diff + ' seconds less</span> than your current average');
	}

	updateAverages(info.time / 1000);
});

$('#container').taphold(function() {
	console.log('Long Tap Started');
	longPress = 1;

	$('#timerCounter').addClass('red');
	$('#timerCounter').runner('reset', true);
});

$('#container').tap(function() {
	longPress = 0;
});

$('#container').tapend(function() {
	if (longPress) {
		// Remove the 'red' class and Start the timer
		$('#timerCounter').removeClass('red');

		$('#timerCounter').runner('start');
		timerStarted = 1;
	} else {
		// It was a single tap, stop the timer if it's running, else do nothing

		$('#timerCounter').runner('stop');
		timerStarted = 0;
	}

	// Update the averages
});