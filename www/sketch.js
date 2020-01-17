const options = {
  dataUrl: './../DataCollection/trainingData.json',
  // inputs: ['temperature', 'pressure', 'wind_speed', 'wind_direction', 'humidity', 'precipitation'],
  //inputs: ['temperature', 'pressure', 'wind_speed', 'wind_direction', 'humidity', 'timeOfDay','timeH'],
  inputs: ['temperature', 'pressure', 'wind_speed', 'humidity', 'timeOfDay'],
  outputs: ['condition'],
  task: 'classification',
  debug: true
}

let neuralNetwork;

function setup() {
  neuralNetwork = ml5.neuralNetwork(options, modelLoaded);
}


function modelLoaded() {
  neuralNetwork.ready.then(() => {
      neuralNetwork.data.normalize();

      const trainingOptions = {
        batchSize: 34,
        epochs: 15
      };
      neuralNetwork.train(trainingOptions, finishedTraining);
    })
    .catch(e => {
      console.error(e);
    });
}

// when it is done training, run .predict()
function finishedTraining() {

  //neuralNetwork.save();


  // console.log("CLEAR DAY")
  // neuralNetwork.classify({
  //   temperature: 25.56,
  //   pressure: 1010.2,
  //   wind_speed: 0.51,
  //   humidity: 96.78,
  //   timeOfDay: 'day'
  // }, output);

  // console.log("HEAVY DAY")
  // neuralNetwork.classify({
  //   temperature: 23.51,
  //   pressure: 1013.2,
  //   wind_speed: 4.08,
  //   humidity: 78.94,
  //   timeOfDay: 'day'
  // }, output);

  // console.log("CLEAR NIGHT")
  // neuralNetwork.classify({
  //   temperature: 23.93,
  //   pressure: 1008.1,
  //   wind_speed: 0,
  //   humidity: 100,
  //   timeOfDay: 'night'
  // }, output);


  console.log("HEAVY NIGHT")
  neuralNetwork.classify({
    temperature: 22.7,
    pressure: 1013.6,
    wind_speed: 0.51,
    humidity: 100,
    timeOfDay: 'day'
  }, output);

}



let output = (err, results) => {

  if (results != undefined) {
    if (results.tensor != undefined) {
      let len = results.tensor.size;
      let arr = []
      for (let i = 0; i < len; i++) {
        arr.push(results[i]);
      }
      console.table(arr);
    }
  }
}


function draw() {

}