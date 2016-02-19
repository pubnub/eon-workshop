exercise 3: build simple map tracking SF airport data. multiple data points at once.

In today's third lesson instead of more charts we are going to be a map. yes, a real geographical
map.  Using EON's map module is very easy.

Start with basic HTML page with a PubNub connection like this:

```
    &lt&!DOCTYPE html&gt;
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Exercise 1</title>
        <script type="text/javascript" src="//pubnub.github.io/eon/v/eon/0.0.9/eon.js"></script>
        <link type="text/css" rel="stylesheet" href="//pubnub.github.io/eon/v/eon/0.0.9/eon.css" />
        <style type="text/css">
            html, body { margin: 0; }
            #map {
                position: absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
            }
    
        </style>
    </head>
    <body>
    <div id="map"></div>
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

Now let's create our own stream containing a set of four geographical points in latitude longitude pairs.


```
    var points = [
        {"latlng":[31,-99]},
        {"latlng":[31,-100]},
        {"latlng":[32,-100]},
        {"latlng":[32,-99]}
    ];
    var count = -1;
    setInterval(function(){
        count = count + 1;
        if(count >= points.length) count = 0;
        console.log("publishing", points[count])
        PUBNUB.publish({
            channel:  'eon-map',
            message: [ points[count] ]
        });
    }, 3000);
```

The code above will publish a message once every three seconds to a channel called 'eon-map'. Notice
that the message is just a list of points. It doesn't have the 'eon' sub-property like we did with charts.

Now we can build a map. Instead of calling `eon.chart` like before, we will call `eon.map`.

```
    var map = eon.map({
        id: 'map',
        mb_token: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
        mb_id: 'ianjennings.l896mh2e',
        channel: 'eon-map',
        pubnub: pubnub,
        rotate: true,
    }
```


That's it.  Now your webpage should look like this:

[screenshot: step1.png]

Note that we added two special fields to the config: `mb_token` and `mb_id`. These are not PubNub tokens, but 
rather MapBox. For this workshop you can use our tokens, but for your own project you'll need to get your own
here [link to mapbox signup page. is it free?]

[need notes about leaflet and the keys for maps]

see it going around the square

# following a marker


This page shows the marker moving around in a square in texas. If you zoom in you'll see it more clearly. 
notice how the marker doesn't just jump from one point to another, but animates smoothly between the current
and new datapoint. However, the map doesn't actually move itself when the marker moves. In a proper application
we'd want the map to pan in case the new datapoint is offscreen. This is very easy to do:
 
We can add a `message` callback when we create the map. Every time a data point comes in this
fucntion will be called. To recenter the map we can just call `map.setView` with the new
data point and a zoom level. For this prototype 8 is a reasonable zoom level.

```
    var map = eon.map({
        id: 'map',
        mb_token: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
        mb_id: 'ianjennings.l896mh2e',
        channel: 'eon-map',
        pubnub: pubnub,
        rotate: true,
        message: function (data) {
            map.setView(data[0].latlng, 8); //8 is the zoom level
        },
```

Now the map will automaticllay follow the marker around when new datapoints come in.

# a real data stream

So far we have been using fake data produced by our own webpage. Now let's switch to
a real datastream.  Anmol [lastname] just wrote a very cool blog on how to get
the current location of the International Space Station (ISS).  He set up a stream
that we can subscribe to with a different key.  To see this change the PubNub key
and the channel to 


      	subscribe_key : 'sub-c-cc7e207a-d418-11e5-bcee-0619f8945a4f',


      	channel : "iss-pubnub",



also remove the publish_key since we won't be using it anymore.

now let's follow the ISS using a different stream

*note: anmol's stream isn't in EON format. how to fix this?


# drawing lines

While it's cool to see the current position of the international space
station we can't really get a sense of it's orbit without seeing the path
it takes. Let's add a line ontop of the map to show this page.

First we need to create a polyline object before the map is created
(since we will reference it later).


```
    var polyline = L.polyline([], {color:'red', fillColor:'red'});
    var map = eon.map({
        id: 'map',
    ...
```

After the map is created we need to add the polline to it


```
    ... create the map
    });
    polyline.addTo(map);
```

This code will add the line to the map but it current doesn't
have any points in it so we can't see it.  Every time a new point comes
in we need to call polyline.addLatLng(). We can do this in the message callback.

```
    message: function (data) {
        map.setView(data[0].latlng, 8); //9 is the zoom level
        polyline.addLatLng(data[0].latlng); // add the new lat/long
    },
```

Now the map will update the line every time a new point comes in.

[screenshot]



# multiple markers


Now we are going to switch to a realtime stream of planes at SFO. This stream has multiple planes
at once.

First lets' turn off following since we don't want to follow multiple markers at once. Let's also
turn off polyline as well

 ```
    message: function (data) {
        //map.setView(data[0].latlng, 8); //9 is the zoom level
        //polyline.addLatLng(data[0].latlng);
    },
```


planes are published to a single stream, though not every plane updates on every tick.  EON handles
this for us. We don't need to worry.

now let's add a custom icon for the planes.
this part uses Leaflet's API


First we'll create a custom marker type.  MapBox has a standard marker
which we can make look different, but it doesn't know how to rotate
to follow the path of the plane.  Fortunately we can esasily extend
the standard marker like this:

```
    L.RotatedMarker = L.Marker.extend({
        options: { angle: 0 },
        _setPos: function(pos) {
            L.Marker.prototype._setPos.call(this, pos);
            this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
        }
    });
```

The definition above creates a new marker type `L.RotatedMarker` which
knows how to rotate the underlying icon when `setPos()` is called.

Now we need to create a new marker for every data point. Eon will call
a `marker` callback to do this, so let's add our own callback which
creates a new marker with an airplane icon.

```
        rotate: true,
        marker: function (latlng, data) {
            var marker = new L.RotatedMarker(latlng, {
                icon: L.icon({
                    iconUrl: 'https://www.mapbox.com/maki/renders/airport-24@2x.png',
                    iconSize: [24, 24]
                })
            });
            return marker;
        }
```

Also note that the code above sets the rotate flag to true. This tells
EON to calculate the bearing (direction) of each plane and
the setPos() function on the marker whenever the bearing changes. 

Now that we have the proper markers let's switch to some real flight data.
Using data from *url*.  We are only using flights going in and out of
the San Francisco International Airport (SFO), but *company* has
flight data available for lots of airports.

to use the flight data switch the subscribe key and stream name to

subscribe key

stream name

and let EON take care of the rest. Even though there are 
multiple underlying data points which come in at different
frequencies, EON will automatically track everything and update
our markers efficiently.




# conclusion

That's all there is to building complex mapping visualizations
of realtime data.  While we used flight data here, you could also
overlay hundreds of other data points for things like temperature
sensors, wind speed, or any other sensor outputs.



