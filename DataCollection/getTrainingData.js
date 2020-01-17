const fs = require('fs');
const _und = require('underscore');

var weatherData = require('./WeatherData.json');

function sample(a, n) {
    return _und.take(_und.shuffle(a), n);
}

exports.getTrainingData = function () {
    let amtOfEach = [];

    let DATA = {
        data: []
    };

    let DAY = weatherData.data.filter(f => f.timeOfDay.localeCompare("day") == 0)
    let NIGHT = weatherData.data.filter(f => f.timeOfDay.localeCompare("night") == 0)

    console.log("\n");
    console.log(`>>>>>>>>> DAY <<<<<<<<<`);
    let DAY_Clear = DAY.filter(f => f.condition.localeCompare("Clear") == 0)
    console.log(`Clear : ${DAY_Clear.length}`);
    amtOfEach.push(DAY_Clear.length);

    let DAY_Slight = DAY.filter(f => f.condition.localeCompare("Slight") == 0)
    console.log(`Slight : ${DAY_Slight.length}`);
    amtOfEach.push(DAY_Slight.length);

    let DAY_Moderate = DAY.filter(f => f.condition.localeCompare("Moderate") == 0)
    console.log(`Moderate : ${DAY_Moderate.length}`);
    amtOfEach.push(DAY_Moderate.length);

    let DAY_Heavy = DAY.filter(f => f.condition.localeCompare("Heavy") == 0)
    console.log(`Heavy : ${DAY_Heavy.length}`);
    amtOfEach.push(DAY_Heavy.length);

    console.log(`\n`);
    console.log(`>>>>>>>>>>>> NIGHT <<<<<<<<<<<`);

    let NIGHT_Clear = NIGHT.filter(f => f.condition.localeCompare("Clear") == 0)
    console.log(`Clear : ${NIGHT_Clear.length}`);
    amtOfEach.push(NIGHT_Clear.length);

    let NIGHT_Slight = NIGHT.filter(f => f.condition.localeCompare("Slight") == 0)
    console.log(`Slight : ${NIGHT_Slight.length}`);
    amtOfEach.push(NIGHT_Slight.length);

    let NIGHT_Moderate = NIGHT.filter(f => f.condition.localeCompare("Moderate") == 0)
    console.log(`Moderate : ${NIGHT_Moderate.length}`);
    amtOfEach.push(NIGHT_Moderate.length);

    let NIGHT_Heavy = NIGHT.filter(f => f.condition.localeCompare("Heavy") == 0)
    console.log(`Heavy : ${NIGHT_Heavy.length}`);
    amtOfEach.push(NIGHT_Heavy.length);


    console.log(`\n`);
    amtOfEach.sort((a, b) => a - b);
    //console.log(amtOfEach.toString());


    const sum = amtOfEach.reduce((a, b) => a + b, 0);
    const avg = (sum / amtOfEach.length) || 0;
    let sLen = amtOfEach[0];
    //sLen = ~~(amtOfEach[amtOfEach.length-1] - amtOfEach[0]) / amtOfEach.length;
    console.log(`Shortest Data Length: ${sLen}`);

    //  Day Data

    sample(DAY_Clear, sLen).forEach(el => {
        DATA.data.push(el)
    });
    sample(DAY_Slight, sLen).forEach(el => {
        DATA.data.push(el)
    });
    sample(DAY_Moderate, sLen).forEach(el => {
        DATA.data.push(el)
    });
    sample(DAY_Heavy, sLen).forEach(el => {
        DATA.data.push(el)
    });


    // Night data
    sample(NIGHT_Clear, sLen).forEach(el => {
        DATA.data.push(el)
    });
    sample(NIGHT_Slight, sLen).forEach(el => {
        DATA.data.push(el)
    });
    sample(NIGHT_Moderate, sLen).forEach(el => {
        DATA.data.push(el)
    });
    sample(NIGHT_Heavy, sLen).forEach(el => {
        DATA.data.push(el)
    });

    fs.writeFile("trainingData.json", JSON.stringify(DATA), err => {
        if (err) {
            console.log(err);
        }
    });
}