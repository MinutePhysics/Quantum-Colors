(function(context, undefined) {

'use strict';

/*
Localize global props for better performance
 */
var Object = context.Object
	,PI = Math.PI
	,cos = Math.cos
	,sin = Math.sin
	,sqrt = Math.sqrt
	,pow = Math.pow
	,log = Math.log
	,exp = Math.exp
	,abs = Math.abs
	,atan2 = Math.atan2
	;

/*
Utility functions
 */
function sinh(x){
	return (exp(x) - exp(-x)) / 2;
}

function cosh(x){
	return (exp(x) + exp(-x)) / 2;
}

/*
Object definition
 */

function Complex(real, im){
	// allow instantiation by simply: Complex(args);
	if (!(this instanceof Complex)) return new Complex(real, im);
	
	this.fromRect(real, im);
}

var prototype = Complex.prototype = {

	fromRect: function(re, im){
		this.real = re || 0;
		this.im = im || 0;
		return this;
	},

	fromPolar: function(r, phi){
		if (typeof r == 'string'){
			var parts = r.split(' ');
			r = parts[0];
			phi = parts[1];
		}
		return this.fromRect(
			r * cos(phi),
			r * sin(phi)
		);
	},

	toPrecision: function(k){
		return this.fromRect(
			this.real.toPrecision(k),
			this.im.toPrecision(k)
		);
	},

	toFixed: function(k){
		return this.fromRect(
			this.real.toFixed(k),
			this.im.toFixed(k)
		);
	},

	finalize: function(){
		this.fromRect = function(re, im){
			return new Complex(re, im);
		};
		if (Object.defineProperty){
			Object.defineProperty(this, 'real', {writable: false, value: this.real});
			Object.defineProperty(this, 'im', {writable: false, value: this.im});
		}
		return this;
	},

	magnitude: function(){
		return sqrt(this.magsqr());
	},

	magsqr: function(){
		var re = this.real
			,im = this.im
			;
		return re * re + im * im;
	},

	angle: function(){
		return atan2(this.im, this.real);
	},

	conjugate: function(){
		return this.fromRect(this.real, -this.im);
	},

	negate: function(){
		return this.fromRect(-this.real, -this.im);
	},

	multiply: function(z){
		z = Complex.from(z);
		var re = this.real
			,im = this.im
			;
		return this.fromRect(
			z.real * re - z.im * im,
			im * z.real + z.im * re
		);
	},

	divide: function(z){
		z = Complex.from(z);
		var zre = z.real
			,zim = z.im
			,re = this.real
			,im = this.im
			,divident = (zre * zre + zim * zim)
			;
		return this.fromRect(
			(re * zre + im * zim) / divident,
			(im * zre - re * zim) / divident
		);
	},

	add: function(z){
		z = Complex.from(z);
		return this.fromRect(this.real + z.real, this.im + z.im);
	},

	subtract: function(z){
		z = Complex.from(z);
		return this.fromRect(this.real - z.real, this.im - z.im);
	},

	pow: function(z){
		z = Complex.from(z);
		var result = z.multiply(this.clone().log()).exp(); // z^w = e^(w*log(z))
		return this.fromRect(result.real, result.im);
	},

	sqrt: function(){
		var abs = this.magnitude()
			,sgn = this.im < 0 ? -1 : 1
			;
		return this.fromRect(
			sqrt((abs + this.real) / 2),
			sgn * sqrt((abs - this.real) / 2)
		);
	},

	log: function(k){
		if (!k) k = 0;
		return this.fromRect(
			log(this.magnitude()),
			this.angle() + k * 2 * PI
		);
	},

	exp: function(){
		return this.fromPolar(
			exp(this.real),
			this.im
		);
	},

	sin: function(){
		var re = this.real
			,im = this.im
			;
		return this.fromRect(
			sin(re) * cosh(im),
			cos(re) * sinh(im)
		);
	},

	cos: function(){
		var re = this.real
			,im = this.im
			;
		return this.fromRect(
			cos(re) * cosh(im),
			sin(re) * sinh(im) * -1
		);
	},

	tan: function(){
		var re = this.real
			,im = this.im
			,divident = cos(2 * re) + cosh(2 * im)
			;
		return this.fromRect(
			sin(2 * re) / divident,
			sinh(2 * im) / divident
		);
	},

	sinh: function(){
		var re = this.real
			,im = this.im
			;
		return this.fromRect(
			sinh(re) * cos(im),
			cosh(re) * sin(im)
		);
	},

	cosh: function(){
		var re = this.real
			,im = this.im
			;
		return this.fromRect(
			cosh(re) * cos(im),
			sinh(re) * sin(im)
		);
	},

	tanh: function(){
		var re = this.real
			,im = this.im
			,divident = cosh(2 * re) + cos(2 * im)
			;
		return this.fromRect(
			sinh(2 * re) / divident,
			sin(2 * im) / divident
		);
	},

	clone: function(){
		return new Complex(this.real, this.im);
	},

	toString: function(polar){
		if (polar) return this.magnitude() + ' ' + this.angle();

		var ret = ''
			,re = this.real
			,im = this.im
			;
		if (re) ret += re;
		if (re && im || im < 0) ret += im < 0 ? '-' : '+';
		if (im){
			var absIm = abs(im);
			if (absIm !== 1) ret += absIm;
			ret += 'i';
		}
		return ret || '0';
	},

	equals: function(z){
		z = Complex.from(z);
		return (z.real === this.real && z.im === this.im);
	}

};

// Disable aliases for now...
// var alias = {
// 	abs: 'magnitude',
// 	arg: 'angle',
// 	phase: 'angle',
// 	conj: 'conjugate',
// 	mult: 'multiply',
// 	dev: 'divide',
// 	sub: 'subtract'
// };

// for (var a in alias) prototype[a] = prototype[alias[a]];

var extend = {

	from: function(real, im){
		if (real instanceof Complex) return new Complex(real.real, real.im);
		var type = typeof real;
		if (type === 'string'){
			if (real === 'i') real = '0+1i';
			var match = real.match(/(\d+)?([\+\-]\d*)[ij]/);
			if (match){
				real = match[1];
				im = (match[2] === '+' || match[2] === '-') ? match[2] + '1' : match[2];
			}
		}
		real = +real;
		im = +im;
		return new Complex(isNaN(real) ? 0 : real, isNaN(im) ? 0 : im);
	},

	fromPolar: function(r, phi){
		return new Complex(1, 1).fromPolar(r, phi);
	},

	i: new Complex(0, 1).finalize(),

	one: new Complex(1, 0).finalize()

};

for (var e in extend) Complex[e] = extend[e];

// This library can be used as an AMD module, a Node.js module, or an
// old fashioned global
if (typeof exports !== 'undefined') {
    // Server
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Complex;
    }
    exports.Complex = Complex;
}
else if (typeof context['define'] === 'function' && context['define']['amd']){
	
	define(function(){
		return Complex;
	});
}
else {
	
	context['Complex'] = Complex;
}

})(this);