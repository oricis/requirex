requirex
========

Method to require JS libraries before calling other script functions

I needed a simple way to pull in additional libraries before calling a primary JS function.
As awesome as the require.js library is, I was looking for something a little different.

Example Usage
=============

    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>requirex.js test page</title>
        <script type="text/javascript" src="http://cdn.requirex.org/v0.1.0/requirex.min.js"></script>
    </head>
    <body>
    <script type="text/javascript">
    function run() {
        console.log('Hello World');
        $('body').append('<h1>Hello World</h1>');
    }
    
    window.onload = (function() {
        var libs = ['http://code.jquery.com/jquery-1.11.1.min.js'];
        requirex(libs, run, {jquery_docready:true});
    });
    </script>
    </body>
    </html>
