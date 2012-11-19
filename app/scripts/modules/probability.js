/*
 * Modified from Probability.js: Call JavaScript functions by probability.
 *
 * Copyright (c) 2012 Florian Schäfer (florian.schaefer@gmail.com)
 * Released under MIT license.
 *
 * Version: 0.0.1
 *
 */

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.Probability = factory();
    }
})(this, function () {

    var toString = Object.prototype.toString
        ,slice = Array.prototype.slice
        ,abs = Math.abs
        ,rnd = Math.random
        ;

    function defFn(){

        return this;
    }

    function Probability() {

        var i = 0
            ,l = 0
            ,containers = []
            ,probas = []
            ,sum = 0
            ,args = toString.call(arguments[0]) === '[object Array]' ? arguments[0] : slice.call(arguments)
            ,obj
            ,isObj
            ,p
            ,fn
            ;

        for (i = 0, l = args.length; i < l; i++) {

            obj = args[i];
            isObj = typeof obj === 'object';
            p = (isObj) ? abs(args[i].p) : obj;
            fn = isObj && obj.fn || defFn;
            
            sum += p;

            containers.push({

                idx: i,
                fn: fn,
                p: p
            });

            probas.push(sum);
        }

        if (sum > 1.0) {
            throw new TypeError('Probability exceeds "1.0" (=100%) in argument ' + i + ': p="' + p + '" (=' +  p * 100 + '%), sum="' + sum + '" (=' +  sum * 100 + '%).');
        }

        function probabilitilized() {

            var random = rnd()
                ,i
                ,c
                ;

            for (i = 0, l = probas.length - 1; i < l && random >= probas[i]; i++) {
                /* intentionally left empty */
            }

            c = containers[i];

            return c.fn.apply(c, arguments);
        }

        return probabilitilized;
    }

    return Probability;

});