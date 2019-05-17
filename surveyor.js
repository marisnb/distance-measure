const usonic = require('mmm-usonic');
const statistics = require('math-statistics');

var init = function (config) {
    const sensor = usonic.createSensor(config.echoPin, config.triggerPin, config.timeout);
    let distances;
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
    } else if(distance > 400) {
        process.stdout.write('Out of range');
    } else {
        process.stdout.write('Distance: ' + distance.toFixed(2) + ' cm');
    }

};

usonic.init(function (error) {
    if (error) {
        process.stdout.write('Error:' + error + '\n');
    } else {
        init({echoPin: 18,triggerPin: 17,timeout: 1000,delay: 60,rate: 5});
    }
});