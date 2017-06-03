/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
apiKey: "AIzaSyCTUa5sAk4f-S4HUT9Gr35yYjVb3muoCr4",
authDomain: "train-scheduler-10910.firebaseapp.com",
databaseURL: "https://train-scheduler-10910.firebaseio.com",
projectId: "train-scheduler-10910",
storageBucket: "train-scheduler-10910.appspot.com",
messagingSenderId: "278330903597"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
event.preventDefault();

// Grabs user input
var trainName = $("#train-name-input").val().trim();
var trainDest = $("#dest-input").val().trim();
var trainStart = moment($("#start-input").val().trim(), "hh:mm").subtract(1,"years");
var trainFreq = $("#freq-input").val().trim();

// Calculations
var timeDiff = moment().diff(moment(trainStart), "minutes") % trainFreq;
var timeRem = trainFreq - timeDiff;
var trainNext = moment(moment().add(timeRem,"minutes")).format("hh:mm");
var startTime = trainStart.format("hh:mm");

// Creates local "ttrainorary" object for holding train data
var newTrain = {
  name: trainName,
  dest: trainDest,
  start: startTime,
  freq: trainFreq,
  next: trainNext,
  minAway: timeRem
};

// Uploads train data to the database
database.ref().push(newTrain);

// Logs everything to console
// console.log(newTrain.name);
// console.log(newTrain.dest);
// console.log(newTrain.start);
// console.log(newTrain.freq);

// Alert
alert("Train successfully added");

// Clears all of the text-boxes
$("#train-name-input").val("");
$("#dest-input").val("");
$("#start-input").val("");
$("#freq-input").val("");

// Prevents moving to new page
return false;
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

console.log(childSnapshot.val());

// Store everything into a variable.
var trainName = childSnapshot.val().name;
var trainDest = childSnapshot.val().dest;
var startTime = childSnapshot.val().start;
var trainFreq = childSnapshot.val().freq;
var trainNext = childSnapshot.val().next;
var timeRem = childSnapshot.val().minAway;

// train Info
console.log(trainName);
console.log(trainDest);
console.log(startTime);
console.log(trainFreq);
console.log(trainNext);
console.log(timeRem);


// Add each train's data into the table
$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
trainFreq + "</td><td>" + trainNext + "</td><td>" + timeRem + "</td></tr>");
});
