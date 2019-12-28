const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');


var arrOfNums = [];
const parallelProcessingLimit = 10;


var dir = './comics';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}



for(var i = 1 ; i < 2000 ; i++) arrOfNums.push(i);


async.eachOfLimit(arrOfNums  , parallelProcessingLimit , (num , ind , cb) => {

    request(`https://xkcd.com/${num}/` , (err , resp , html) => {

    if(err || resp.statusCode !== 200) {
        return console.log('An Error Occured');
    }

    const $ = cheerio.load(html);
    const imgUrl = $('#comic img').attr('src');
    var title = $('#ctitle').html() ;
    title =  title.replace(/[^\w\s]/gi, '');
    console.log(title);
    console.log( 'https:' + imgUrl);
    const uri = 'https:' + imgUrl;
    request(uri).pipe(fs.createWriteStream(`comics/${title}.jpg`)).on('close', cb);

})


} , (err ) => {
    console.log(err);
} );


