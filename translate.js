//import Tesseract from 'tesseract.js'
var Tesseract = require('tesseract.js');
// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');	
//save the file!
var fs = require('fs');

//set up translation
// Your Google Cloud Platform project ID
const projectId = 'projectID';
 
// Instantiates a client
const translate = new Translate({
  projectId: projectId,
  keyFilename: 'file'

});


 var data = [];

// //get the text from the image
 var index = 2;  
 var totalSlides = 56;

for (let index = 1; index <= totalSlides; index++) {

    createTranslation(index)
}


function createTranslation(index) {
    var filename = 'band_ensemble_1/crop/'+index+'.jpg';

    Tesseract.recognize(filename,{
            lang: 'jpn',
    })
    .then(function (result) {
        //translate to english
        var japanese = result.text;
        //console.log(result.text);
        //lets clean up newlines
        japanese = japanese.replace(/(\r\n\t|\n|\r\t)/gm,'');
        //clean up random star half turning into a 〔
        japanese = japanese.replace('〔','');

        //translate the result text
        const text = japanese;
        const target = 'en';
        translate
        .translate(text, target)
        .then(results => {
            const translation = results[0];
            var object = {};
            object.japanese = japanese;
            object.id = index;
            object.english = translation;
            data.push(object);
            

            if (index == totalSlides) {
                var json = JSON.stringify(data);
                var file = 'band-esemble-1-ver2.json'
                //create the file and write
                fs.openSync(file,'w');
                fs.appendFileSync(file, json);
            }
        });
    });
}