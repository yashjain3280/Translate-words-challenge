const fs = require("fs");
const csv = require("csv-parser");
const begin = new Date().getTime();

let shakes = fs.readFileSync("t8.shakespeare.txt" , "utf8").toString();
let words = fs.readFileSync("find_words.txt" , "utf8").split("\n");
let dictionary = {};

fs.createReadStream("french_dictionary.csv").pipe(csv()).on("data", function(data){
  let word = [];
  for(let key in data){
    if(data.hasOwnProperty(key)){
      word.push(data[key]);
    }
  }
  dictionary[word[0]] = word[1];
}).on("end" , function(){
  replaceWords();
  output();
});

function countOccurences(shakes , word){
  return shakes.split(word).length - 1;
}

function replaceWords(){
  words.forEach(function(word){
    let frequency = "word : " + word  +", count: "  +countOccurences(shakes, word) ;

     console.log(frequency);

    shakes = shakes.replace(new RegExp(word, "g"), dictionary[word]);
    fs.writeFileSync("frequency.csv", frequency);

  });
}

function output(){
  const end = new Date().getTime();
  const time = end - begin;
  const sec = Math.floor((time/1000) % 60);
  let memoryUsed = process.memoryUsage().heapUsed/ 1024 /1024;
  let memory = Math.round(memoryUsed * 100) / 100;
 console.log("Time to process :" , sec + " Seconds");
 console.log("Memory Used :" + memory + "  MB");

fs.writeFileSync("t8.shakespeare.output.txt",shakes);

}
