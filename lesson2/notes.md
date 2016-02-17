add multiple charts to a page

we have three sensors, a real temp sensor, a light sensor, and a potentiometer. in this excercise
we will build a new webpage that can graph all three.  I have created a stream which
will give you fake sensor data. After the excercise we will hook it up to a real device.

Start with the same boiler plate as before but with a few additons.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>lesson 2</title>
    <script type="text/javascript" src="//pubnub.github.io/eon/v/eon/0.0.9/eon.js"></script>
    <link type="text/css" rel="stylesheet" href="//pubnub.github.io/eon/v/eon/0.0.9/eon.css" />
    <style type="text/css">
        html, body { margin: 0; padding:0 }
        #chart {
            position: absolute;
            top:25%;
            bottom:25%;
            height: 50%;
            left:0;
            right:0;
            display: flex;
        }
        #temp, #light, #pot {
            flex: 1;
            margin: 20px;
            border: 1px solid blue;
        }
    </style>
</head>
<body>

<div id="chart">
    <div id="light"></div>
    <div id="temp"></div>
    <div id="pot"></div>
</div>
<script type="text/javascript">
    var pubnub = PUBNUB.init({
        ssl           : true,  // <- enable TLS Tunneling over TCP
        publish_key   : "demo",
        subscribe_key : "demo"
    });
</script>
</body>
</html>
```

This page gives us three charts center aligned in a row. It uses flex-box, a newer CSS standard,
to give them equal space. I put a blue border around them so you can see where the boxes are, even
though they don't ahve charts yet.

Now do add the first chart for the light sensor. This will be a simple line chart
like we did in the previous exercise:

```
    eon.chart({
        channel: "fake_device",
        generate: {
            bindto: '#light',
        },
        pubnub: pubnub,
        limit: 30,
    });
```

It should look like this:
[screenshot]

This code will work but something is wrong.  All three data points are in the chart. That's
a problem. we only want the light data. To fix this we need to modify
the points as they come in.  We can do that with a 'transform' function. The following
function creates a new data point containing just hte part we want.

```
        transform: function(m) {
            return { 
                eon: {
                    light: m.eon.light
                }
            }
        }
```


Now it looks right.

[screenshot]



# temp sensor.

For the temp sensor we want the same thing, a line chart showing the values over time. It looks like this:

```
    eon.chart({
        channel: "fake_device",
        generate: {
            bindto: '#temp',
        },
        //history:true,
        pubnub: pubnub,
        limit: 30,
        transform: function(m) {
            return { eon: {
                temp: m.eon.temperature
            }}
        }
    });
```

Unfortunately we have another problem.  The values are in farenheit but we want them in Celsius. We can
modify the transform function to do it for us. Create an FtoC function somewhere above:

```
    function FtoC(f) {
        return (f-32)* (5/9);
    }
```

then call it from the transform

```
        transform: function(m) {
            return { eon: {
                temp: FtoC(m.eon.temperature)
            }}
        }
```


# Potentiometer chart

The potentiometer is different than the other sesnors. We don't care about it's
value over time. We only want the current value. A Gauge chart is a better way to
show the current value.  Create another chart, but this time set the data type 
to `gauge`. Also notice the transform function is again used to grab just the
single potentiometer value.

```
    eon.chart({
        channel: "fake_device",
        generate: {
            bindto: '#pot',
            data: {
                type:'gauge'
            },
        },
        pubnub: pubnub,
        transform: function(m) {
            return { eon: {
                pot: m.eon.potentiometer
            }}
        }
    });
```

This will work but we have another problem. The gauge assumes that all of the values are between 0 and 100.
However, our sensor data is from -10 to 10. We could use another conversion function like we did for the
temperature, but an easier way is to set the max and min of the gauge like htis, then the gauge
control will handle the conversion for us.

```
        generate: {
            bindto: '#pot',
            data: {
                type:'gauge'
            },
            gauge: {
                min: -10,
                max: 10,
            }
        },
```


That's it. Now all of our charts work.  Using what you learned in the previoius lesson you can 
set the Y labels to show the units and the X labels to show nicer names.  Try doing it yourself
before you look at the answer below.  See if you can make it look like this.
And remember to take out the blue border from the CSS.

[screenshot]

# answer

    eon.chart({
        channel: "fake_device",
        generate: {
            bindto: '#light',
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%m:%S'
                    },
                    label: {
                        text: "Light over time"
                    }
                },
                y: {
                    label: {
                        text: "Lumens",
                        position: 'outer-middle'
                    }
                }
            }
        },
        //history:true,
        pubnub: pubnub,
        limit: 30,
        transform: function(m) {
            return { eon: {
                light: m.eon.light
            }}
        }
    });
    function FtoC(f) {
        return (f-32)* (5/9);
    }
    eon.chart({
        channel: "fake_device",
        generate: {
            bindto: '#temp',
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%m:%S'
                    },
                    label: {
                        text: "Temperature over time",
                    }
                },
                y: {
                    label: {
                        text: "Celsius",
                        position: 'outer-middle'
                    }
                }
            }
        },
        //history:true,
        pubnub: pubnub,
        limit: 30,
        transform: function(m) {
            return { eon: {
                temp: FtoC(m.eon.temperature)
            }}
        }
    });

    eon.chart({
        channel: "fake_device",
        generate: {
            bindto: '#pot',
            data: {
                type:'gauge'
            },
            gauge: {
                min: -10,
                max: 10,
                units: 'position'
            }
        },
        pubnub: pubnub,
        transform: function(m) {
            return { eon: {
                pot: m.eon.potentiometer
            }}
        }
    });




Now, you can try using real data by switching to the PubNub stream `real_device`.  Then come up
to the front of the class and try moving the real sensors to see the values change on your computer.


[screenshot of sensor board]

That's the end of lesson 2.




* build the light sensor
* position on the left
* build the temp sensor
* position in the middle
* it's in farenheit but we want this in celsius, so let's implement a transform function
* build the gague
* we don't care about the history, just the current value. let's use a gauge.
* set gague colors

