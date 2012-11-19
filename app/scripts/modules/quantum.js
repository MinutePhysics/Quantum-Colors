define(
    [
        'modules/probability',
        'modules/cxmx'
    ],
    function(
        Probability,
        CMatrix
    ){
        'use strict';
        
        var PRECISION = 6;

        /*
        State vector (or ray if you like)
         */
        function State(amps){
            
            this.amps = CMatrix.create(amps);
            this.normalize();
        }

        State.prototype = {

            normalize: function(){
                
                var amps = this.amps
                    ,sum = 0
                    ,l = amps.rows()
                    ,i
                    ;

                for (i = 1; i <= l; i++) {

                    sum += amps.e(i).magsqr();
                }

                if (sum === 1) return;

                this.amps = amps.multiply(Math.sqrt(1/sum));
            },

            getProbabilityByIndex: function(idx){

                return this.amps.e(idx + 1).magsqr();
            },

            getProbabilityArray: function(){

                var probs = [];

                for ( var i = 0, l = this.amps.rows(); i < l; i++ ){
                    
                    probs.push(this.getProbabilityByIndex(i).toPrecision(PRECISION));
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
                this.amps = CMatrix.create(amps);

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

            setPrecision: function(p){

                PRECISION = p;
                CMatrix.precision = Math.pow(10, -p);
            },

            state: function(amps){

                return new State(amps);
            }
        }
    }
);