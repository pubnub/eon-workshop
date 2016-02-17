Let's start by building a simple line chart.

I've set up an existing pubnub stream which sends out a randomly
changing number every three seconds.


create a new html file

type add this

<script type="text/javascript" src="//pubnub.github.io/eon/v/eon/0.0.9/eon.js"></script>
<link type="text/css" rel="stylesheet" href="//pubnub.github.io/eon/v/eon/0.0.9/eon.css" />

now create a div for the chart to go in

<div id="chart"></div>

and create a new script section with this.  

<script type="text/javascript">
var pubnub = PUBNUB.init({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo"
});
</script>


Now we can setup a simple chart:

eon.chart({
    channel: "josh_hello_world",
    generate: {
        bindto: '#chart',
    },
    pubnub: pubnub
});


Refresh your browser and wait a couple of seconds. You should start to see points show up in
your chart.  Check the javascript console of your browser if you are having any problems.

[image]


Now notice the first problem.  The data shows up immediately but the chart looks empty. This is because
it doesn't have any data points from before you loaded the page. If you load the page again you'll 
again lose the old data. To fix this lets use history.  Set the history option to true

eon.chart({
    channel: "josh_hello_world_1",
    generate: {
        bindto: '#chart',
    },
    history:true,
    pubnub: pubnub
});

It's that easy. If the stream is set up to support history (which this one is) then eon handles the rest.

Now lets try showing multiple datasets at once.  I've set up a second stream which generates three sets
of test data.  This data is published on the channel: josh_hello_world_5, so just change the channel. 
Eon will automatically adapt to receiving 5 data points instead of 1.


# make it prettier

Now that we have a chart let's make it look a little prettier. An ugly chart is an uninformative chart. Imagine
this is a set of temperature data for airports around the country. It might be viewed by people in an airport
who want to see the temp at other cities they are going to. We need to make the chart look better
before putting it into an airport.

First, let's change the number of points we see at once. By default, an EON chart only shows the last 10 items. 
Depending on your data that might be fine, but that is a poor fit for this dataset. We get one data point every three
seconds. At that rate we can only see the last half a minute.  Let's increase it to 100 so that we get the last
five minutes. Then we can start seeing trends.  

Changing the item count is easy. Set the 'limit' property to a higher number. 

```
    limit: 100,
    history:true,
    pubnub: pubnub,    
    limit: 100,
```

Now let's come to the xaxis. Notice that the chart already has ticks even though we didn't configure it. 
By default EON will use the timestamp of each message for the labels.  We could change this if the
data wasn't in a time series, but for this case it's fine. However, we *do* want to reformat
the timestamps. We don't need to know the full date, just the current time we can reformat these labels by
defining a custom x axis.  We also want a label for the Y axis saying that this is temperature.  We can make 
both of these changes by define an axis parameter:



define the x axis to be a timeseries with a custom format for the ticks.

```
eon.chart({
    channel: "josh_hello_world_5",
    generate: {
        bindto: '#chart',
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%H:%m:%S'
                }
            },
            y: {
                label: {
                    text: 'Temperature',
                    position: 'outer-middle'
                }
            },
        }
    },
    history:true,
    pubnub: pubnub,
    limit: 30,
});
```


There are many options for customizing the labels. Labels are rendered by the C3 library so you can find
that in the official C3 docs

http://c3js.org/gettingstarted.html#customize

Now let's make the chart fill the screen and change the colors and fonts.  The entire chart is rendered into a 
DIV, so we can make the DIV fill the screen with standard CSS:

Put this at the top of your page inside the HEAD element:

```
    <style type="text/css">
        html, body { margin: 0; }
        #chart {
            position: absolute;
            top:0;
            bottom:0;
            left:0;
            right:0;
        }
```

Since this chart might be seen from far away on a TV, let's make the lines thicker. Any style
which is shared by multiple items can be set with CSS.  To make the lines thick and give
them nice round endcaps, do:

```
        .c3 svg {
            font: bold 20px sans-serif;
        }
        .c3-chart-line path {
            stroke-width: 10px;
            stroke-linecap: round;
        }
    </style>
```

Now we need to change the colors of each line itself. While we are at it, let's give
the values names other than value0, value1, etc.  

```
        data: {
            type:'spline',
            colors: {
                value0:'#ffaaaa',
                value1:'#cc8888',
                value2:'#aa4444',
                value3:'#882222',
                value4:'#660000'
            },
            names: {
                value0: "SFO",
                value1: "DFW",
                value2: "ATL",
                value3: "BOS",
                value4: "LAX"
            }
        },
```

The colors are hex values. The names are simply strings.  I also set the type to 'spline' to make
the lines look smoother.

And finally lets hide the points

```
//inside the 'generate' object
        point: {
            show: false
        },
```



look at these for more information on customizing hte chart

http://c3js.org/examples.html



Now your final chart should look like this:

[screenshot]

That's it for lesson 1.















