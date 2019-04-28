require("dotenv").config();
const fs = require("fs");
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
  userInput = userInput + " " + nodeArg[i];
  userInput = userInput.trim();
}

function runCommand(command, userInput) {
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
      console.log(chalk`That is not a recognized command. Please use the following format:\n{white.bold node liri.js} {blue command} {red search item} \n{blue.bold concert-this} {red.bold Band Name} (For finding concerts) \n{blue.bold spotify-this-song} {red.bold Song Name} (For finding song information) \n{blue.bold movie-this} {red.bold Movie Name} (For finding movie information) \n{blue.bold do-what-it-says} {red.bold No Input Needed} (For returning something random)`)
  }
}

runCommand(command, userInput);

function getBandInfo(userInput) {
  if (userInput === "") {
    console.log("\n" + chalk`{cyan If you're looking for a rockin' good time\nbecome a part of the Excitable Crew with 311!}`);
    userInput = "311";
  }
  const bandURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
  axios.get(bandURL).then(function (response) {
    const results = response.data;
    console.log("\n" + chalk`{red.bold Upcoming concerts for }` + userInput);
    for (let i = 0; i < results.length; i++) {
      console.log(chalk`{blue.bold -}`.repeat(50));
      console.log(chalk`{blue.bold Event Venue Name: }` + results[i].venue.name);
      console.log(chalk`{blue.bold Event City: }` + results[i].venue.city + ", " + results[i].venue.region);
      console.log(chalk`{blue.bold Event Date: }` + moment(results[i].datetime).format("MM/DD/YYYY, h:mm a"));
      console.log(chalk`{blue.bold -}`.repeat(50));
    }
  })
    .catch(function (error) {
      console.log("Error Occurred: " + error);
    })
}

function getSongInfo(userInput) {
  if (userInput === "") {
    console.log("\n" + chalk`{cyan If you're looking for a sweet tune, check out\n"The Sign" by Ace of Base!}`);
    userInput = "ace of base the sign";
  }
  spotify.search({ type: "track", query: userInput }, function (err, response) {
    if (err) {
      console.log("Error occurred: " + err);
    }
    const results = response.tracks.items;
    console.log("\n" + chalk`{red.bold Matching Songs for }` + userInput);
    for (let i = 0; i < results.length; i++) {
      console.log(chalk`{green.bold -}`.repeat(50));
      console.log(chalk`{green.bold Artist Name: }` + results[i].artists[0].name);
      console.log(chalk`{green.bold Song Name: }` + results[i].name);
      console.log(chalk`{green.bold Song Preview: }` + results[i].preview_url);
      console.log(chalk`{green.bold Album: }` + results[i].album.name);
      console.log(chalk`{green.bold -}`.repeat(50));
    }
  })
}

function getMovieInfo(userInput) {
  if (userInput === "") {
    console.log("\n" + chalk`{cyan If you haven't watched "Mr. Nobody," then you should!\nhttp://www.imdb.com/title/tt0485947/\nIt's on Netflix!}`);
    userInput = "mr nobody";
  }
  const movieURL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&&apikey=480895f5";
  axios.get(movieURL).then(function (response) {
    console.log("\n" + chalk`{red.bold Best Match for }` + userInput);
    const results = response.data;
    console.log(chalk`{yellow.bold -}`.repeat(50));
    console.log(chalk`{yellow.bold Movie Title: }` + results.Title);
    console.log(chalk`{yellow.bold Release Year: }` + results.Year);
    console.log(chalk`{yellow.bold IMDb Rating: }` + results.Ratings[0].Value);
    console.log(chalk`{yellow.bold Rotten Tomatoes Rating: }` + results.Ratings[1].Value);
    console.log(chalk`{yellow.bold Country: }` + results.Country);
    console.log(chalk`{yellow.bold Language(s): }` + results.Language);
    console.log(chalk`{yellow.bold Plot: }` + results.Plot);
    console.log(chalk`{yellow.bold Actors/Actresses: }` + results.Actors);
    console.log(chalk`{yellow -}`.repeat(50));
  })
    .catch(function (error) {
      console.log("Error Occurred: " + error);
    })
}

function getRandomInfo() {
  fs.readFile("random.txt", "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    const randArr = data.split(",");
    runCommand(randArr[0], randArr[1]);
  })
}