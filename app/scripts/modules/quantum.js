define(
    [
        'modules/probability'
    ],
    function(
        Probability
    ){
        'use strict';
        
        /*
        State vector (or ray if you like)
         */
        function State(amps){
            
            this.amps = amps;
            this.normalize();
        }

        State.prototype = {

            normalize: function(){
                
                var amps = this.amps
                    ,sum = 0
                    ,l = amps.length
                    ,i
                    ;

                for (i = 0; i < l; i++) {

                    sum += this.getProbabilityByIndex(i)
                }

                if (sum === 1) return;

                for (i = 0; i < l; i++) {
                    
                    amps[i] /= Math.sqrt(sum);
                }
            },

            getProbabilityByIndex: function(idx){

                var val = this.amps[idx];

                return val * val;
            },

            getProbabilityArray: function(){

                var probs = [];

                for ( var i = 0, l = this.amps.length; i < l; ++i ){
                    
                    probs.push(this.getProbabilityByIndex(i));
                }

                return probs;
            },

            collapseTo: function(idx){

                var amps = []
                    ,len = this.amps.length
                    ;

                // collapse
                for (var i = 0; i < len; i++) amps[i] = 0;
                
                amps[idx] = 1;
                this.amps = amps;

                return this;
            },

            measure: function(){

                var chooser = Probability(this.getProbabilityArray())
                    ,idx = chooser().idx
                    ;
                
                this.collapseTo(idx);
                
                return idx;
            }
        };

        /*
        Operators
         */
        function Operator(vals){

            var sqrt = Math.sqrt(vals.length);

            // if not an integer
            if (sqrt != ~~sqrt){

                throw "Not a square matrix!";
            }

            this.matrix = vals;
        }

        return {

            state: function(amps){

                return new State(amps);
            }
        }
    }
);