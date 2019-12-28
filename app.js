const request = require("request");
const cheerio = require("cheerio");
const async = require("async");
const fs = require("fs");

var arrOfNums = [];
const parallelProcessingLimit = 10;
var dir = "./comics";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

for (var i = 1; i < 2000; i++) arrOfNums.push(i);

async.eachOfLimit(
  arrOfNums,
  parallelProcessingLimit,
  (num, ind, cb) => {
    request(`https://xkcd.com/${num}/`, (err, resp, html) => {
      if (err || resp.statusCode !== 200) {
        console.log(`Error Occured at ${num}`);
        cb();
      } else {
        const $ = cheerio.load(html);
        const imgUrl = $("#comic img").attr("src");
        var title = $("#ctitle").html();
        title = title.replace(/[^\w\s]/gi, "");
        if (imgUrl && title) {
          const uri = "https:" + imgUrl;

          try {

            request(uri)
            .pipe(fs.createWriteStream(`comics/${title}.jpg`))
            .on("close", () => {
              console.log(`Image ${num} : ${title}`);
              cb();
            });

          }catch(e) {
            console.log(`Error Occured at ${num}`);
            cb();
          }


        } else {
          console.log(`Error Occured at ${num}`);
          cb();
        }
      }
    });
  },
  err => {
    if (err) return console.log(err);
    console.log("Done!");
  }
);
