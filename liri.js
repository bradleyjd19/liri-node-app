require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const chalk = require("chalk");
const nodeArg = process.argv;
const command = nodeArg[2];
let userInput = "";
for (let i = 3; i < nodeArg.length; i++) {
  if (i > 2 && i < nodeArg.length) {
    userInput = userInput + " " + nodeArg[i];
    userInput = userInput.trim();
  }
  else {
    userInput += nodeArg[i];
  }
}

switch (command) {

  case "concert-this":
    getBandInfo(userInput);
    break;

  case "spotify-this-song":
    getSongInfo(userInput);
    break;

  case "movie-this":
    getMovieInfo(userInput);
    break;

  case "do-what-it-says":
    getRandomInfo();
    break;

  default:
    console.log(chalk`{yellow.bold That is not a recognized command. Please use the following format:\n{white.bold node liri.js} {blue command} {red search item} \n{blue.bold concert-this} {red.bold Band Name} For finding concerts \n{blue.bold spotify-this-song} {red.bold Song Name} For finding song information \n{blue.bold movie-this} {red.bold Movie Name} For finding movie information \n{blue.bold do-what-it-says} {red.bold No Input Needed} For returning something random}`)
}

function getBandInfo(userInput) {
  const bandURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
  axios.get(bandURL).then(function (err, response) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      else {
        const results = response.data;
        for (let i = 0; i < results.length; i++) {
          console.log("-".repeat(50));
          console.log("Event Venue Name: " + results[i].venue.name);
          console.log("Event City: " + results[i].venue.city + ", " + results[i].venue.region);
          console.log("Event Date: " + moment(results[i].datetime).format("MM/DD/YYYY, h:mm a"));
          console.log("-".repeat(50));
        }
      }
    })
}

function getSongInfo(userInput) {
  spotify.search({ type: "track", query: userInput }, function (err, response) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    else {
      const results = response.tracks.items;
      for (let i = 0; i < results.length; i++) {
        console.log("-".repeat(50));
        console.log("Artist Name: " + results[i].artists[0].name);
        console.log("Song Name: " + results[i].name);
        console.log("Song Preview: " + results[i].preview_url);
        console.log("Album: " + results[i].album.name);
        console.log("-".repeat(50));
      }
    }
  })
}

// function getMovieInfo(userInput) {
//   const movieURL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=480895f5";
//   axios.get(movieURL).then(function (err, response) {
//     if (err) {
//       return console.log("Error occurred: " + err);
//     }
//     else {
//       for (let i = 0; i < response.length; i++) {
//         console.log("-".repeat(50));

//       }

//     }
//   })
// }