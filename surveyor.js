const usonic = require('mmm-usonic');
const statistics = require('math-statistics');

const init = function (config) {
    const sensor = usonic.createSensor(config.echoPin, config.triggerPin, config.timeout);
    let distances;
    console.log('Config: ' + JSON.stringify(config));
    console.log('sensor: ' + JSON.stringify(sensor));
    (function measure() {
        if (!distances || distances.length === config.rate) {
            if (distances) {
                print(distances);
            }

            distances = [];
        }

        setTimeout(function() {
            distances.push(sensor());

            measure();
        }, config.delay);
    }());
};

const print = function (distances) {
    const distance = statistics.median(distances);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    if (distance < 0) {
        process.stdout.write('Error: Measurement timeout.\n');
    } else {
        console.log('Distance: ' + distance.toFixed(2) + ' cm');
        process.stdout.write('Distance: ' + distance.toFixed(2) + ' cm');
    }

};

init({
   echoPin: 18,
   triggerPin: 17,
   timeout: 1000,
   delay: 60,
   rate: 5
});