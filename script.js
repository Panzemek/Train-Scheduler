var config = {
    apiKey: "AIzaSyAKTHfujsJNq7tdcJtF-Zcaf0opqcsl_7o",
    authDomain: "classtest-29506.firebaseapp.com",
    databaseURL: "https://classtest-29506.firebaseio.com",
    projectId: "classtest-29506",
    storageBucket: "classtest-29506.appspot.com",
    messagingSenderId: "878691640453"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit-button").on("click", function (event) {
    event.preventDefault();

    if (!($("#train-name").val() === null ||
        $("#train-name").val() === "" ||
        $("#destination").val() === null ||
        $("#destination").val() === "" ||
        $("#first-time").val() === null ||
        $("#first-time").val() === "" ||
        $("#frequency").val() === null ||
        $("#frequency").val() === "")) {
        var newName = $("#train-name").val().trim();
        var newDestination = $("#destination").val().trim();
        var newFrequency = parseInt($("#frequency").val());
        var newFirstTime = $("#first-time").val().trim();

        let newTrain = {
            name: newName,
            destination: newDestination,
            frequency: newFrequency,
            firstTime: newFirstTime
        }
        database.ref().push(newTrain);

        $(".train-form-group").closest('form').find("input[type=text], textarea").val("");
        createRow(newTrain);
    }
});

database.ref().on("child_added", function (snapshot) {
    //Retrieve existing train schedule and call the table row construction
    if (snapshot.child("name").exists()) {
        createRow(snapshot);

    }
}, function (errorObject) { console.log(errorObject.code) });

function createRow(data) {
    let name = data.val().name;
    let destination = data.val().destination;
    let frequency = data.val().frequency;
    let firstTime = data.val().firstTime;

    let nameTD = $("<td>").text(name);
    let destinationTD = $("<td>").text(destination);
    let frequencyTD = $("<td>").text(frequency);

    // Calculations for Next Arrival and Minutes Away columns
    let firstTimeYearMinus = moment(firstTime, "HH:mm").subtract(1, "years");
    let minutesAway = frequency - (moment().diff(moment(firstTimeYearMinus), "minutes") % frequency);
    let minutesAwayTD = $("<td>").text(minutesAway);

    let nextArrival = moment().add(minutesAway, "minutes");
    let nextArrivalTD = $("<td>").text(moment(nextArrival).format("hh:mm"));


    var row = $("<tr>").append(
        nameTD,
        destinationTD,
        frequencyTD,
        nextArrivalTD,
        minutesAwayTD
    );
    $("#table-body").append(row);
}