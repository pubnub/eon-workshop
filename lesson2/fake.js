
var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-5a5f3514-32a6-49a0-94d9-ea376729f959",
    subscribe_key : "sub-c-d784e128-da7d-11e5-9511-0619f8945a4f"
});


var temp = 25;
var light = 300;
function publishTempLight() {
    temp += (Math.random() - 0.5)*2;
    light += (Math.random() - 0.5)*20;
    var data = { eon: {
        'temperature': temp,
        'light': light
    }};
    console.log("sending",data);
    pubnub.publish({
        channel   : 'fake-temperature-photoresistor',
        message   : data,
    });
}
setInterval(publishTempLight,3*1000); //every three seconds


var pot = 0;
var diff = 100;
function publishPot() {
    pot += diff;
    if(pot <= 0) diff = 100;
    if(pot >= 1023) diff = -100;
    var data = { eon: { 'potentiometer': pot } };
    console.log("sending",data);
    pubnub.publish({
      channel: 'fake-potentiometer',
      message: data
    });
}
setInterval(publishPot,1*1000); //every second
