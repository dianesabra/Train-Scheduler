// Initialize Firebase
var config = {
  apiKey: "AIzaSyB-DBIEzxyCGXxI6J5feQhGJNngcLGNiZI",
  authDomain: "train-schedule-62b77.firebaseapp.com",
  databaseURL: "https://train-schedule-62b77.firebaseio.com",
  projectId: "train-schedule-62b77",
  storageBucket: "",
  messagingSenderId: "795250013600"
};
firebase.initializeApp(config);

var database = firebase.database();
var trainArray = [];
var trainObj = {};
var trainName = "";
var destination = "";
var startTime = "12:00:00";
var frequency = 0;

$("#run-submit").on("click", function(event) {
  //event.preventDefault();
  trainName = $("#trainName-input")
    .val()
    .trim();
  destination = $("#destination-input")
    .val()
    .trim();
  startTime = $("#startTime-input")
    .val()
    .trim();
  frequency = $("#freq-input")
    .val()
    .trim();
  if (
    trainName !== "" &&
    destination !== "" &&
    startTime !== "" &&
    frequency !== ""
  ) {
    database.ref().push({
      trainName: trainName,
      destination: destination,
      startTime: startTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }
});

// At the initial load, get a snapshot of the current data.

database.ref().on(
  "child_added",
  function(childSnapshot) {
    var fbStartTime = moment(childSnapshot.val().startTime, "HH:mm");

    var currentTime = moment();

    var diffTime = moment(currentTime, "minutes");

    var remainder = diffTime % childSnapshot.val().frequency;

    var fbMinAway = childSnapshot.val().frequency - remainder;

    var nextArrivalTime = moment()
      .add(fbMinAway, "minutes")
      .format("hh:mm");

    $("#trainSchedule").append(
      "<tr><td>" +
        childSnapshot.val().trainName +
        "</td>" +
        "<td>" +
        childSnapshot.val().destination +
        "</td>" +
        "<td>" +
        childSnapshot.val().frequency +
        "</td>" +
        "<td>" +
        nextArrivalTime +
        "</td><td>" +
        fbMinAway +
        "<td>" +
        // "<p><button class='glyphicon glyphicon-remove btn btn-danger delete-btn'></button></p>" +
        "</tr>;"
    );
  },
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);
