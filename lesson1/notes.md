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

* customize the line style with CSS
* turn on splines
* format the x axis labels to say something like last min, last 5 min instead of timestamps
* change the size of the chart to fill the screen
* add an optional Y value gridline to for ‘normal ranges’ with nice colors
* change the number of points we see at once to 100
* hide the points




now switch to area chart (not that useful for this data, but it’s easy to do)
??swap the x/y axes











