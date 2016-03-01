# eon-workshop
Hands on Exercises for the EON workshop


This workshop contains three hands on lessons. You can find the client source in each directory.
The source for a optional NodeJS server apps that create sample data streams, is also included.

Note that the code in the example html files includes the support libraries with
a url without the protocol. ex:  `//` instead of `http://`. This is the preferred
way to reference external resources in production because the browser will automatically
choose `http` or `https` as appropriate.  However, this trick won't work if you are
loading your files directly from the filesytem (`file://`) instead of through a webserver.

When doing this workshop you should either use a local webserver or else change
the urls to specify `http://` directly.
