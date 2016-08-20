/******************************************************************************
@license 
requirex.js

The MIT License (MIT)

Copyright (c) 2014 Bennert contact@xhub.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
******************************************************************************/
(function() {
    var _libQueue = [];
    var _libData = {};
    var _callbackTimeout = 100;
    
    /*
     * _requirex(libUrl, libCallback, options)
     * 
     * libUrl: Either a string or list of strings representing the
     *         library to be loaded
     * 
     * libCallback: Function to call when load of libUrl is complete.
     *              Can be null if no function to call.
     * 
     */
    var _requirex = function(libUrl, libCallback, options) {
        var i=0;
        if (typeof(libCallback) == "undefined") {
            libCallback = null;
        }
        if (typeof(options) == "undefined") {
            options = {};
        }
        if (typeof(libUrl) == "string") {
            // push single url into queue
            _libQueue.push({url:libUrl,callback:libCallback,options:options});
        }
        else {
            for(i=0; i < libUrl.length; i++) {
                if (i+1 == libUrl.length) {
                    // push last url into queue with callback
                    _libQueue.push({url:libUrl[i],callback:libCallback,options:options});
                }
                else {
                    // push url into queue, no callback until end.
                    _libQueue.push({url:libUrl[i],callback:null,options:options});
                }
            }
        }
        _loadLibs();
    };
    
    /*
     * _loadLibs(): Load any libs in queue until empty
     */
    var _loadLibs = function() {
        while(_libQueue.length) {
            var nextLib = _libQueue.shift();
            _loadLib(nextLib);
        }
    };
    
    /*
     * _runCallbacks(libUrl): Run any callbacks for libUrl
     */
    var _runCallbacks = function(libUrl) {
        while (_libData[libUrl].callbacks.length) {
            var libCallback = _libData[libUrl].callbacks.shift();
            var callbackOptions = _libData[libUrl].options.shift();
            if (libCallback != null) {
                if (callbackOptions['jquery_docready'] === true) {
                    setTimeout(function() {
                        function jQueryCheck() {
                            if (typeof(window['jQuery']) != 'undefined') {
                                window['jQuery'](document).ready(libCallback);
                            }
                            else {
                                setTimeout(jQueryCheck, _callbackTimeout);
                            }
                        }
                        jQueryCheck();
                    }, _callbackTimeout);
                }
                else {
                    setTimeout(libCallback, _callbackTimeout);
                }
            }
        }
    }
    
    /*
     * _loadLib(libUrl, libCallback):
     */
    var _loadLib = function(newLib) {
        var script = null;
        if (typeof(_libData[newLib.url]) == 'undefined') {
            // Does not exist in known libraries. Create.
            _libData[newLib.url] = { callbacks:[newLib.callback], loaded:false, options:[newLib.options] };
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = newLib.url;
            script.onload = script.onreadystatechange = function() {
                // Library loaded. Flag and run callbacks.
                _libData[this.src].loaded = true;
                _runCallbacks(this.src);
            };
            document.body.appendChild(script);
        }
        else {
            if (_libData[newLib.url].loaded) {
                // Library loaded, run callbacks
                _runCallbacks(newLib.url);
                return;
            }
            else {
                // Library not loaded, add to callbacks
                _libData[newLib.url].callbacks.push(newLib.callback);
                _libData[newLib.url].options.push(newLib.options);
                return;
            }
        }
    };
    
    // Define in global namespace only if does not exist
    if (!window['requirex']) {
        window['requirex'] = _requirex;
    }
})();
/*****************************************************************************/
