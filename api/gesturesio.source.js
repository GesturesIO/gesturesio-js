/*
 Gestures.IO
 @license MIT License
*/
(function(m) {
    function g(a, c, d, e, b) {
        this._listener = c;
        this._isOnce = d;
        this.context = e;
        this._signal = a;
        this._priority = b || 0
    }

    function l(a, c) {
        if ("function" !== typeof a) throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", c));
    }

    function k() {
        this._bindings = [];
        this._prevParams = null;
        var a = this;
        this.dispatch = function() {
            k.prototype.dispatch.apply(a, arguments)
        }
    }
    g.prototype = {
        active: !0,
        params: null,
        execute: function(a) {
            var c;
            this.active && this._listener && (a = this.params ? this.params.concat(a) :
                a, c = this._listener.apply(this.context, a), this._isOnce && this.detach());
            return c
        },
        detach: function() {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null
        },
        isBound: function() {
            return !!this._signal && !!this._listener
        },
        isOnce: function() {
            return this._isOnce
        },
        getListener: function() {
            return this._listener
        },
        getSignal: function() {
            return this._signal
        },
        _destroy: function() {
            delete this._signal;
            delete this._listener;
            delete this.context
        },
        toString: function() {
            return "[SignalBinding isOnce:" + this._isOnce +
                ", isBound:" + this.isBound() + ", active:" + this.active + "]"
        }
    };
    k.prototype = {
        VERSION: "1.0.0",
        memorize: !1,
        _shouldPropagate: !0,
        active: !0,
        _registerListener: function(a, c, d, e) {
            var b = this._indexOfListener(a, d);
            if (-1 !== b) {
                if (a = this._bindings[b], a.isOnce() !== c) throw Error("You cannot add" + (c ? "" : "Once") + "() then add" + (c ? "Once" : "") + "() the same listener without removing the relationship first.");
            } else a = new g(this, a, c, d, e), this._addBinding(a);
            this.memorize && this._prevParams && a.execute(this._prevParams);
            return a
        },
        _addBinding: function(a) {
            var c = this._bindings.length;
            do --c; while (this._bindings[c] && a._priority <= this._bindings[c]._priority);
            this._bindings.splice(c + 1, 0, a)
        },
        _indexOfListener: function(a, c) {
            for (var d = this._bindings.length, e; d--;)
                if (e = this._bindings[d], e._listener === a && e.context === c) return d;
            return -1
        },
        has: function(a, c) {
            return -1 !== this._indexOfListener(a, c)
        },
        add: function(a, c, d) {
            l(a, "add");
            return this._registerListener(a, !1, c, d)
        },
        addOnce: function(a, c, d) {
            l(a, "addOnce");
            return this._registerListener(a, !0,
                c, d)
        },
        remove: function(a, c) {
            l(a, "remove");
            var d = this._indexOfListener(a, c); - 1 !== d && (this._bindings[d]._destroy(), this._bindings.splice(d, 1));
            return a
        },
        removeAll: function() {
            for (var a = this._bindings.length; a--;) this._bindings[a]._destroy();
            this._bindings.length = 0
        },
        getNumListeners: function() {
            return this._bindings.length
        },
        halt: function() {
            this._shouldPropagate = !1
        },
        dispatch: function(a) {
            if (this.active) {
                var c = Array.prototype.slice.call(arguments),
                    d = this._bindings.length,
                    e;
                this.memorize && (this._prevParams =
                    c);
                if (d) {
                    e = this._bindings.slice();
                    this._shouldPropagate = !0;
                    do d--; while (e[d] && this._shouldPropagate && !1 !== e[d].execute(c))
                }
            }
        },
        forget: function() {
            this._prevParams = null
        },
        dispose: function() {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams
        },
        toString: function() {
            return "[Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]"
        }
    };
    k.Signal = k;
    "function" === typeof define && define.amd ? define(function() {
            return k
        }) : "undefined" !== typeof module && module.exports ? module.exports = k : m.signals =
        k
})(this);
var G = function() {
    function m() {
        function l(a, b, c, d, h) {
            this.command = a;
            this.senderId = t;
            this.data = {
                joint: b,
                coordinate: c,
                direction: h,
                user: d || 0
            }
        }

        function k(a) {
            this.command = "SERVICE_MESSAGE";
            this.senderId = t;
            this.data = a
        }

        function a() {
            try {
                n = new WebSocket("ws://" + g + ":" + m), n.onopen = c, n.onmessage = d, n.onclose = e, n.onerror = function(a) {
                    b.debug("WebSocket Error: " + a)
                }
            } catch (a) {
                b.debug("socketConnect() Error: " + a)
            }
            return !1
        }

        function c() {
            try {
                n.send(JSON.stringify("<policy-file-request/>" + String.fromCharCode(0)))
            } catch (a) {
                b.debug("socketOpenHandler() Error: " + a)
            }
            return !1
        }

        function d(a) {
            try {
                if (0 < p.length) {
                    var c = p.pop(),
                        d = JSON.stringify(c);
                    n.send(d)
                }
                var f = JSON.parse(a.data.replace(/[\u0000\u00ff]/g, ""));
                a = q;
                switch (f.command) {
                    case "SKELETON_UPDATE":
                        if (0 < f.data.length) {
                            q = 1;
                            var h, e;
                            for (h = 0; h < f.data.length; h++)
                                for (e = 0; e < f.data[h].joints.length; e++) f.data[h].joints[e].x = Math.round(100 * f.data[h].joints[e].x * r) / 100, f.data[h].joints[e].y = Math.round(100 * f.data[h].joints[e].y * s) / 100, f.data[h].joints[e].z = 2 - f.data[h].joints[e].z
                        } else q = 0;
                        b.users = f.data;
                        break;
                    case "GESTURE":
                        b.signalsManager.gestureDetected.dispatch(f.command,
                            f.data);
                        break;
                    case "serviceMessage":
                        b.signalsManager.serviceMessageReceived.dispatch(f.data)
                }
                a != q && b.signalsManager.statusChanged.dispatch(q, b.whichUser)
            } catch (g) {
                b.debug("socketMessageHandler() Error: " + g)
            }
            return !1
        }

        function e() {
            try {
                b.connect()
            } catch (a) {
                b.debug("socketCloseHandler() Error: " + a)
            }
            return !1
        }
        var b = {},
            g = "localhost",
            m = 3311,
            r = 800,
            s = 600,
            q = 2;
        b.debugLog = !0;
        var n, t = (new Date).getTime().toString() + Math.round(1E9 * Math.random()).toString(),
            p = [];
        b.signalsManager = {
            statusChanged: new signals.Signal,
            gestureDetected: new signals.Signal,
            serviceMessageReceived: new signals.Signal
        };
        b.signalsManager.statusChanged.add(function(a, c) {
            b.debug("New status: " + a);
            b.debug("Data: " + c)
        });
        b.signalsManager.gestureDetected.add(function(a, c) {
            b.debug(a + c.whichGesture)
        });
        b.signalsManager.serviceMessageReceived.add(function(a, c) {
            b.debug(a)
        });
        b.users = [];
        b.whichUser = 0;
        b.init = function(a, b, c, d) {
            g = c || g;
            m = d || m;
            r = a || r;
            s = b || s
        };
        b.rescale = function(a, b) {
            r = a;
            s = b
        };
        b.status = function() {
            return q
        };
        b.connect = function() {
            try {
                a()
            } catch (c) {
                b.debug("connect() Error: " +
                    c)
            }
            return !1
        };
        b.addGesture = function(a, b, c, d, e) {
            p.push(new l(a, b, c, e, d))
        };
        b.removeGesture = function(a, b, c, d, e) {
            p.push(new l("stop_" + a, b, c, e, d))
        };
        b.addFilter = function(a, b, c) {
            p.push(new l("addFilter", a, b, c))
        };
        b.removeFilter = function(a, b, c) {
            p.push(new l("removeFilter", a, b, c))
        };
        b.sendServiceMessage = function(a) {
            p.push(new k(a))
        };
        b.debug = function(a) {
            b.debugLog && void 0 !== a && console.log(a)
        };
        return b
    }
    var g;
    return {
        IO: function() {
            g || (g = m());
            return g
        }
    }
}();
