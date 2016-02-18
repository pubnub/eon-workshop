exercise 3: build simple map tracking SF airport data. multiple data points at once.


build a simple map

[need notes about leaflet and the keys for maps]

see it going around the square

turn on following
 
now let's follow the ISS using a different stream
 
now let's add a polyline to show where it's been




Now we are going to switch to a realtime stream of planes at SFO. This stream has mutiple planes
at once.

disable following

planes are published to a single stream, though not every plane updates on every tick.  EON handles
this for us. We don't need to worry.

now let's add a custom icon for the planes.  
this part uses Leaflet's API

start with this custom marker class which understands how to rotate itself.
EON will calculate the heading of the marker based on how the marker is moving.

now create the marker function to return a new marker. In an advanced version you could
add a popup to this marker as well.


