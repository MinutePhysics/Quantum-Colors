/*
 * Adapted from Sylvester.Matrix
 * Copyright (c) 2007-2012 James Coglan
 */
define(
  [
      './complex'
  ],
  function(
    C
  ){

    function CMatrix(elements) {

      if (!(this instanceof CMatrix)){
          return new CMatrix(elements);
      }

      return this.setElements(elements);
    }

    CMatrix.precision = 1e-6;

    CMatrix.create = function(elements) {
      return new CMatrix(elements);
    };

    CMatrix.I = function(n) {
      var els = [], i = n, j;
      while (i--) { j = n;
        els[i] = [];
        while (j--) {
          els[i][j] = (i === j) ? 1 : 0;
        }
      }
      return CMatrix.create(els);
    };

    CMatrix.Diagonal = function(elements) {
      var i = elements.length;
      var M = CMatrix.I(i);
      while (i--) {
        M.elements[i][i] = C.from(elements[i]);
      }
      return M;
    };

    // CMatrix.Rotation = function(theta, a) {
    //   if (!a) {
    //     return CMatrix.create([
    //       [Math.cos(theta),  -Math.sin(theta)],
    //       [Math.sin(theta),   Math.cos(theta)]
    //     ]);
    //   }
    //   var axis = a.dup();
    //   if (axis.elements.length !== 3) { return null; }
    //   var mod = axis.modulus();
    //   var x = axis.elements[0]/mod, y = axis.elements[1]/mod, z = axis.elements[2]/mod;
    //   var s = Math.sin(theta), c = Math.cos(theta), t = 1 - c;
    //   // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
    //   // That proof rotates the co-ordinate system so theta becomes -theta and sin
    //   // becomes -sin here.
    //   return CMatrix.create([
    //     [ t*x*x + c, t*x*y - s*z, t*x*z + s*y ],
    //     [ t*x*y + s*z, t*y*y + c, t*y*z - s*x ],
    //     [ t*x*z - s*y, t*y*z + s*x, t*z*z + c ]
    //   ]);
    // };

    // CMatrix.RotationX = function(t) {
    //   var c = Math.cos(t), s = Math.sin(t);
    //   return CMatrix.create([
    //     [  1,  0,  0 ],
    //     [  0,  c, -s ],
    //     [  0,  s,  c ]
    //   ]);
    // };
    // CMatrix.RotationY = function(t) {
    //   var c = Math.cos(t), s = Math.sin(t);
    //   return CMatrix.create([
    //     [  c,  0,  s ],
    //     [  0,  1,  0 ],
    //     [ -s,  0,  c ]
    //   ]);
    // };
    // CMatrix.RotationZ = function(t) {
    //   var c = Math.cos(t), s = Math.sin(t);
    //   return CMatrix.create([
    //     [  c, -s,  0 ],
    //     [  s,  c,  0 ],
    //     [  0,  0,  1 ]
    //   ]);
    // };

    CMatrix.Random = function(n, m) {
      return CMatrix.Zero(n, m).map(
        function() { return Math.random(); }
      );
    };

    CMatrix.Zero = function(n, m) {
      var els = [], i = n, j;
      while (i--) { j = m;
        els[i] = [];
        while (j--) {
          els[i][j] = 0;
        }
      }
      return CMatrix.create(els);
    };

    CMatrix.prototype = {
      e: function(i,j) {
        j = j || 1;
        if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length) { return null; }
        return this.elements[i-1][j-1];
      },

      row: function(i) {
        if (i > this.elements.length) { return null; }
        return Matrix.create(this.elements[i-1]);
      },

      col: function(j) {
        if (this.elements.length === 0) { return null; }
        if (j > this.elements[0].length) { return null; }
        var col = [], n = this.elements.length;
        for (var i = 0; i < n; i++) { col.push(this.elements[i][j-1]); }
        return Matrix.create(col);
      },

      dimensions: function() {
        return {rows: this.rows(), cols: this.cols()};
      },

      rows: function() {
        return this.elements.length;
      },

      cols: function() {
        if (this.elements.length === 0) { return 0; }
        return this.elements[0].length;
      },

      eql: function(Cmatrix) {
        var M = Cmatrix.elements || Cmatrix;
        if (!M[0] || typeof(M[0][0]) === 'undefined') { M = CMatrix.create(M).elements; }
        if (this.elements.length === 0 || M.length === 0) {
          return this.elements.length === M.length;
        }
        if (this.elements.length !== M.length) { return false; }
        if (this.elements[0].length !== M[0].length) { return false; }
        var i = this.elements.length, nj = this.elements[0].length, j;
        while (i--) { j = nj;
          while (j--) {
            if (this.elements[i][j].subtract(M[i][j]).toPrecision(CMatrix.precision).magnitude() !== 0) { return false; }
          }
        }
        return true;
      },

      dup: function() {
        return CMatrix.create(this.elements);
      },

      map: function(fn, context) {
        if (this.elements.length === 0) { return CMatrix.create([]); }
        var els = [], i = this.elements.length, nj = this.elements[0].length, j;
        while (i--) { j = nj;
          els[i] = [];
          while (j--) {
            els[i][j] = C.from(fn.call(context, this.elements[i][j], i + 1, j + 1));
          }
        }
        return CMatrix.create(els);
      },

      isSameSizeAs: function(Cmatrix) {
        var M = Cmatrix.elements || Cmatrix;
        if (typeof(M[0][0]) === 'undefined') { M = CMatrix.create(M).elements; }
        if (this.elements.length === 0) { return M.length === 0; }
        return (this.elements.length === M.length &&
            this.elements[0].length === M[0].length);
      },

      add: function(Cmatrix) {
        if (this.elements.length === 0) return this.map(function(x) { return x });
        var M = Cmatrix.elements || Cmatrix;
        if (typeof(M[0][0]) === 'undefined') { M = CMatrix.create(M).elements; }
        if (!this.isSameSizeAs(M)) { return null; }
        return this.map(function(x, i, j) { return x.add(M[i-1][j-1]); });
      },

      subtract: function(Cmatrix) {
        if (this.elements.length === 0) return this.map(function(x) { return x });
        var M = Cmatrix.elements || Cmatrix;
        if (typeof(M[0][0]) === 'undefined') { M = CMatrix.create(M).elements; }
        if (!this.isSameSizeAs(M)) { return null; }
        return this.map(function(x, i, j) { return x.subtract(M[i-1][j-1]); });
      },

      canMultiplyFromLeft: function(Cmatrix) {
        if (this.elements.length === 0) { return false; }
        var M = Cmatrix.elements || Cmatrix;
        if (typeof(M[0][0]) === 'undefined') { M = CMatrix.create(M).elements; }
        // this.columns should equal Cmatrix.rows
        return (this.elements[0].length === M.length);
      },

      multiply: function(Cmatrix) {
        if (this.elements.length === 0) { return null; }
        if (!Cmatrix.elements) {
          return this.map(function(x) { return x.multiply(Cmatrix); });
        }
        var returnVector = Cmatrix.modulus ? true : false;
        var M = Cmatrix.elements || Cmatrix;
        if (typeof(M[0][0]) === 'undefined') { M = CMatrix.create(M).elements; }
        if (!this.canMultiplyFromLeft(M)) { return null; }
        var i = this.elements.length, nj = M[0].length, j;
        var cols = this.elements[0].length, c, elements = [], sum;
        while (i--) { j = nj;
          elements[i] = [];
          while (j--) { c = cols;
            sum = 0;
            while (c--) {
              sum += this.elements[i][c].multiply(M[c][j]);
            }
            elements[i][j] = sum;
          }
        }
        var M = CMatrix.create(elements);
        return returnVector ? M.col(1) : M;
      },

      minor: function(a, b, c, d) {
        if (this.elements.length === 0) { return null; }
        var elements = [], ni = c, i, nj, j;
        var rows = this.elements.length, cols = this.elements[0].length;
        while (ni--) { i = c - ni - 1;
          elements[i] = [];
          nj = d;
          while (nj--) { j = d - nj - 1;
            elements[i][j] = this.elements[(a+i-1)%rows][(b+j-1)%cols];
          }
        }
        return CMatrix.create(elements);
      },

      transpose: function() {
        if (this.elements.length === 0) return CMatrix.create([]);
        var rows = this.elements.length, i, cols = this.elements[0].length, j;
        var elements = [], i = cols;
        while (i--) { j = rows;
          elements[i] = [];
          while (j--) {
            elements[i][j] = this.elements[j][i];
          }
        }
        return CMatrix.create(elements);
      },

      conjugate: function(){
        return this.map(function(x, i, j) { return x.conjugate(); });
      },

      isSquare: function() {
        var cols = (this.elements.length === 0) ? 0 : this.elements[0].length;
        return (this.elements.length === cols);
      },

      // max: function() {
      //   if (this.elements.length === 0) { return null; }
      //   var m = 0, i = this.elements.length, nj = this.elements[0].length, j;
      //   while (i--) { j = nj;
      //     while (j--) {
      //       if (Math.abs(this.elements[i][j]) > Math.abs(m)) { m = this.elements[i][j]; }
      //     }
      //   }
      //   return m;
      // },

      indexOf: function(x) {
        if (this.elements.length === 0) { return null; }
        var index = null, ni = this.elements.length, i, nj = this.elements[0].length, j;
        for (i = 0; i < ni; i++) {
          for (j = 0; j < nj; j++) {
            if (this.elements[i][j].equals(x)) { return {i: i+1, j: j+1}; }
          }
        }
        return null;
      },

      diagonal: function() {
        if (!this.isSquare) { return null; }
        var els = [], n = this.elements.length;
        for (var i = 0; i < n; i++) {
          els.push(this.elements[i][i]);
        }
        return Matrix.create(els);
      },

      toRightTriangular: function() {
        if (this.elements.length === 0) return CMatrix.create([]);
        var M = this.dup(), els;
        var n = this.elements.length, i, j, np = this.elements[0].length, p;
        for (i = 0; i < n; i++) {
          if (M.elements[j][i].equals(0)) {
            for (j = i + 1; j < n; j++) {
              if (!M.elements[j][i].equals(0)) {
                els = [];
                for (p = 0; p < np; p++) { els.push(M.elements[i][p].add(M.elements[j][p])); }
                M.elements[i] = els;
                break;
              }
            }
          }
          if (!M.elements[j][i].equals(0)) {
            for (j = i + 1; j < n; j++) {
              var multiplier = M.elements[j][i].divide(M.elements[i][i]);
              els = [];
              for (p = 0; p < np; p++) {
                // Elements with column numbers up to an including the number of the
                // row that we're subtracting can safely be set straight to zero,
                // since that's the point of this routine and it avoids having to
                // loop over and correct rounding errors later
                els.push(p <= i ? 0 : M.elements[j][p].subtract(M.elements[i][p].multiply(multiplier)));
              }
              M.elements[j] = els;
            }
          }
        }
        return M;
      },

      determinant: function() {
        if (this.elements.length === 0) { return 1; }
        if (!this.isSquare()) { return null; }
        var M = this.toRightTriangular();
        var det = M.elements[0][0], n = M.elements.length;
        for (var i = 1; i < n; i++) {
          det = det.multiply(M.elements[i][i]);
        }
        return det;
      },

      isSingular: function() {
        return (this.isSquare() && this.determinant().equals(0));
      },

      trace: function() {
        if (this.elements.length === 0) { return 0; }
        if (!this.isSquare()) { return null; }
        var tr = this.elements[0][0], n = this.elements.length;
        for (var i = 1; i < n; i++) {
          tr = tr.add(this.elements[i][i]);
        }
        return tr;
      },

      // rank: function() {
      //   if (this.elements.length === 0) { return 0; }
      //   var M = this.toRightTriangular(), rank = 0;
      //   var i = this.elements.length, nj = this.elements[0].length, j;
      //   while (i--) { j = nj;
      //     while (j--) {
      //       if (M.elements[i][j].magnitude() > CMatrix.precision) { rank++; break; }
      //     }
      //   }
      //   return rank;
      // },

      augment: function(Cmatrix) {
        if (this.elements.length === 0) { return this.dup(); }
        var M = Cmatrix.elements || Cmatrix;
        if (typeof(M[0][0]) === 'undefined') { M = CMatrix.create(M).elements; }
        var T = this.dup(), cols = T.elements[0].length;
        var i = T.elements.length, nj = M[0].length, j;
        if (i !== M.length) { return null; }
        while (i--) { j = nj;
          while (j--) {
            T.elements[i][cols + j] = C.from(M[i][j]);
          }
        }
        return T;
      },

      inverse: function() {
        if (this.elements.length === 0) { return null; }
        if (!this.isSquare() || this.isSingular()) { return null; }
        var n = this.elements.length, i= n, j;
        var M = this.augment(CMatrix.I(n)).toRightTriangular();
        var np = M.elements[0].length, p, els, divisor;
        var inverse_elements = [], new_element;
        // CMatrix is non-singular so there will be no zeros on the
        // diagonal. Cycle through rows from last to first.
        while (i--) {
          // First, normalise diagonal elements to 1
          els = [];
          inverse_elements[i] = [];
          divisor = M.elements[i][i];
          for (p = 0; p < np; p++) {
            new_element = M.elements[i][p].divide(divisor);
            els.push(new_element);
            // Shuffle off the current row of the right hand side into the results
            // array as it will not be modified by later runs through this loop
            if (p >= n) { inverse_elements[i].push(new_element); }
          }
          M.elements[i] = els;
          // Then, subtract this row from those above it to give the identity Cmatrix
          // on the left hand side
          j = i;
          while (j--) {
            els = [];
            for (p = 0; p < np; p++) {
              els.push(M.elements[j][p].subtract(M.elements[i][p].multiply(M.elements[j][i])));
            }
            M.elements[j] = els;
          }
        }
        return CMatrix.create(inverse_elements);
      },

      // round: function() {
      //   return this.map(function(x) { return Math.round(x); });
      // },

      // snapTo: function(x) {
      //   return this.map(function(p) {
      //     return (Math.abs(p - x) <= Sylvester.precision) ? x : p;
      //   });
      // },

      // inspect: function() {
      //   var Cmatrix_rows = [];
      //   var n = this.elements.length;
      //   if (n === 0) return '[]';
      //   for (var i = 0; i < n; i++) {
      //     Cmatrix_rows.push(Sylvester.Vector.create(this.elements[i]).inspect());
      //   }
      //   return Cmatrix_rows.join('\n');
      // },

      setElements: function(els) {
        var i, j, elements = els.elements || els;
        if (elements[0] && typeof(elements[0][0]) !== 'undefined') {
          i = elements.length;
          this.elements = [];
          while (i--) { j = elements[i].length;
            this.elements[i] = [];
            while (j--) {
              this.elements[i][j] = C.from(elements[i][j]);
            }
          }
          return this;
        }
        var n = elements.length;
        this.elements = [];
        for (i = 0; i < n; i++) {
          this.elements.push([C.from(elements[i])]);
        }
        return this;
      }
    };

    CMatrix.prototype.toUpperTriangular = CMatrix.prototype.toRightTriangular;
    CMatrix.prototype.det = CMatrix.prototype.determinant;
    CMatrix.prototype.tr = CMatrix.prototype.trace;
    CMatrix.prototype.rk = CMatrix.prototype.rank;
    CMatrix.prototype.inv = CMatrix.prototype.inverse;
    CMatrix.prototype.x = CMatrix.prototype.multiply;

    return CMatrix;
  }
);