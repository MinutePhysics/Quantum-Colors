define(
    [
    ],
    function(
    ){
        'use strict';
        
        function getRandomIndex(amps){
            
            var rand = Math.random()
                ,size = 0
                ,len = amps.length
                ,ampsqr = []
                ,val
                ;
            
            // iterate through state amplitudes and sum the squares
            // and cache the square value for the next iteration
            while (len--) size += (val = amps[len]) * (ampsqr[len] = val);

            rand *= size;
            val = 0;
            
            // chose an index based on square amplitudes
            do {
                
                rand -= ampsqr[val++];

            } while (rand > 0);
            
            return val - 1;
        }

        function State(amps){
                
            this.amps = amps;
            this.normalize();
        }

        State.prototype = {

            normalize: function(){
                
                var amps = this.amps
                    ,sum = 0
                    ,val
                    ,l = amps.length
                    ,i
                    ;

                for (i = 0; i < l; i++) {

                    sum += (val = amps[i]) * val;
                }

                if (sum === 1) return;

                for (i = 0; i < l; i++) {
                    
                    amps[i] /= sum;
                }
            },

            measure: function(){

                var idx = getRandomIndex(this.amps)
                    ,len = this.amps.length
                    ,amps = []
                    ;
                
                // collapse
                for (var i = 0; i < len; i++) amps[i] = 0;
                
                amps[idx] = 1;
                this.amps = amps;
                return idx;
            }
        };

        return {

            state: function(amps){

                return new State(amps);
            }
        }
    }
);