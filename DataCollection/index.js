const fetch = require('node-fetch');
const fs = require('fs');


const _properties = ["Wind Speed", "Wind Direction", "Humidity", "Precipitation", "Pressure", "Temperature"];
const _locations = ["Caroni", "Piarco", "Brasso", "Chatham", "El Reposo", "Penal", "Guayaguayare", "Centeno", "Crown Point"];

let OldCache = {
    data: []
};

let weatherData = {
    data: []
};
getData();


async function getData() {
    let len = _locations.length;
    for (let i = 0; i < len; i++) {
        let response = await fetch(`https://metproducts.gov.tt/api/aws/search?name=${_locations[i]}`);
        let data = await response.json();
        console.log(`${_locations[i]} - ${(data.items != undefined)?data.items.length:0}`);
        processData(data.items);
    }
    // weatherData.data.sort((a, b) => a.id - b.id);

    fs.readFile('./WeatherData.json', 'utf8', function (err, contents) {
        if (contents != undefined && contents.length > 0) {
            OldCache = JSON.parse(contents);
            OldCache.data = OldCache.data.sort((a, b) => `${a.location}-${a.date}`.localeCompare(`${b.location}-${b.date}`));
        }

        let lenData = weatherData.data.length;
        let OldCacheLen = OldCache.data.length;


        //updating old data
        // for (let i = 0; i < OldCacheLen; i++) {
        //     //console.log(OldCache.data[i]);
        //     let d = new Date(OldCache.data[i].date).getHours();

        //     OldCache.data[i].timeOfDay = calTimeOfDay(d.toString());
        //     OldCache.data[i].timeH = (d < 10) ? `0${d}:00:00` : `${d}:00:00`;
        // }

        for (let i = 0; i < lenData; i++) {
            const _temp = weatherData.data[i];
            let isPresent = recursiveFunction(OldCache.data, `${_temp.location}-${_temp.date}`, 0, OldCacheLen - 1);
            if (isPresent == false) {
                console.log(`+++added ${weatherData.data[i].id}`);
                OldCache.data.push(weatherData.data[i]);
            } else {
                //console.log(`!!!exist ${weatherData.data[i].id}`);
            }
        }

        OldCache.data = OldCache.data.sort((a, b) => new Date(a.date) - new Date(b.date));

        for (let i = 0; i < _locations.length; i++) {
            fs.writeFile(`LocationData/${_locations[i]}.json`, JSON.stringify(OldCache.data.filter(oc => oc.location == _locations[i])), err => {
                if (err) {
                    console.log(err);
                }
            })
        }

        fs.writeFile("WeatherData.json", JSON.stringify(OldCache), err => {
            if (err) {
                console.log(err);
            } else {
                setTimeout(() => {
                    const tData = require('./getTrainingData');
                    tData.getTrainingData();
                }, 1000);
            }
        });


    });





    //console.log(weatherData.data);

    // fs.writeFile("WeatherData.json", JSON.stringify(weatherData), err => {
    //     if (err) {
    //         console.log(err);
    //     }
    // })


    //console.log(weatherData);
}


function recursiveFunction(arr, x, start, end) {
    // Base Condtion 
    if (start > end) return false;

    // Find the middle index 
    let mid = Math.floor((start + end) / 2);


    // Compare mid with given key x 
    if (`${arr[mid].location}-${arr[mid].date}`.localeCompare(x) === 0) return true;

    // If element at mid is greater than x, 
    // search in the left half of mid 
    if (`${arr[mid].location}-${arr[mid].date}`.localeCompare(x) === 1)
        return recursiveFunction(arr, x, start, mid - 1);
    else

        // If element at mid is smaller than x, 
        // search in the right half of mid 
        return recursiveFunction(arr, x, mid + 1, end);
}


function processData(data) {
    const WindSpeed = filterByProp(data, 0);
    const WindDirection = filterByProp(data, 1);
    const Humidity = filterByProp(data, 2);
    const Precipitation = filterByProp(data, 3);
    const Pressure = filterByProp(data, 4);
    const Temperature = filterByProp(data, 5);

    let len = WindSpeed.length;
    for (let i = 0; i < len; i++) {



        let obj = {
            id: WindSpeed[i].id,
            date: `${WindSpeed[i].aws_date} ${WindSpeed[i].aws_time}`,
            timeOfDay: calTimeOfDay(WindSpeed[i].aws_time),
            timeH: WindSpeed[i].aws_time,
            location: WindSpeed[i].location,
            temperature: getVal(Temperature[i]),
            pressure: getVal(Pressure[i]),
            wind_speed: getVal(WindSpeed[i]),
            wind_direction: (WindDirection[0].value != undefined) ? WindDirection[0].value : '',
            humidity: getVal(Humidity[i]),
            precipitation: getVal(Precipitation[i]),
            condition: forcast(Precipitation[i])
        }


        // if (i == 0) {
        //     //console.log("test Data");
        //     fs.writeFile('testData.json', JSON.stringify(obj), err => {
        //         if (err) {
        //             console.log(err);
        //         }
        //     });
        // }


        if (obj.temperature == 0 || obj.pressure == 0 || obj.humidity == 0) {
            // if zero value found do not insert
        } else {
            weatherData.data.push(obj);
        }
    }
}


function calTimeOfDay(timeStr) {
    let hour = parseFloat(timeStr);
    if (hour != null || hour != undefined) {
        if (hour > 6 && hour < 19) return "day";
        return "night";
    }
}

function forcast(precipitation) {
    let p = getVal(precipitation);
    if (p == 0) {
        return "Clear";
    } else if (p <= 0.5) {
        return "Slight";
    } else if (p <= 1.5) {
        return "Moderate";
    } else {
        return "Heavy";
    }
}

function getVal(val) {
    if (val == undefined) return 0;
    let v = parseFloat(val.value);
    if (isNaN(v)) {
        return 0;
    }
    return v;
}


function filterByProp(_data, _propLoc) {
    if (_data == undefined) return [];
    return arrayDateSort(_data.filter(d => d.item == _properties[_propLoc]));
}

function arrayDateSort(arr) {
    return arr.sort((a, b) => new Date(`${a.aws_date} ${a.aws_time}`) - new Date(`${b.aws_date} ${b.aws_time}`));
}