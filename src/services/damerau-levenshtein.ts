export class DamerauLevenshtein {


  insert: any
  remove: any
  substitute: any
  transpose: any

  damerau: any
  prices: any

  constructor(_prices: any, _damerau: any) {
    // 'prices' customisation of the edit costs by passing an
    // object with optional 'insert', 'remove', 'substitute', and
    // 'transpose' keys, corresponding to either a constant
    // number, or a function that returns the cost. The default
    // cost for each operation is 1. The price functions take
    // relevant character(s) as arguments, should return numbers,
    // and have the following form:
    //
    // insert: function (inserted) { return NUMBER; }
    //
    // remove: function (removed) { return NUMBER; }
    //
    // substitute: function (from, to) { return NUMBER; }
    //
    // transpose: function (backward, forward) { return NUMBER; }
    //
    // The damerau flag allows us to turn off transposition and
    // only do plain Levenshtein distance.

    this.damerau = _damerau
    this.prices = _prices

    if (this.damerau !== false) this.damerau = true;
    if (!this.prices) this.prices = {};

    switch (typeof this.prices.insert) {
      case 'function': this.insert = this.prices.insert; break;
      case 'number': this.insert = function (c: any) { return this.prices.insert; }; break;
      default: this.insert = function (c: any) { return 1; }; break;
    }

    switch (typeof this.prices.remove) {
      case 'function': this.remove = this.prices.remove; break;
      case 'number': this.remove = function (c: any) { return this.prices.remove; }; break;
      default: this.remove = function (c: any) { return 1; }; break;
    }

    switch (typeof this.prices.substitute) {
      case 'function': this.substitute = this.prices.substitute; break;
      case 'number':
        this.substitute = function (from: any, to: any) { return this.prices.substitute; };
        break;
      default: this.substitute = function (from: any, to: any) { return 1; }; break;
    }

    switch (typeof this.prices.transpose) {
      case 'function': this.transpose = this.prices.transpose; break;
      case 'number':
        this.transpose = function (backward: any, forward: any) { return this.prices.transpose; };
        break;
      default: this.transpose = function (backward: any, forward: any) { return 1; }; break;
    }

  }

  distance(down: any, across: any) {
    // http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
    let self = this
    var ds: any = [];
    if (down === across) {
      return 0;
    } else {
      down = down.split(''); down.unshift(null);
      across = across.split(''); across.unshift(null);
      down.forEach(function (d: any, i: any) {
        if (!ds[i]) ds[i] = [];
        across.forEach(function (a: any, j: any) {
          if (i === 0 && j === 0) ds[i][j] = 0;
          // Empty down (i == 0) -> across[1..j] by inserting
          else if (i === 0) ds[i][j] = ds[i][j - 1] + self.insert(a);
          // Down -> empty across (j == 0) by deleting
          else if (j === 0) ds[i][j] = ds[i - 1][j] + self.remove(d);
          else {
            // Find the least costly operation that turns
            // the prefix down[1..i] into the prefix
            // across[1..j] using already calculated costs
            // for getting to shorter matches.
            ds[i][j] = Math.min(
              // Cost of editing down[1..i-1] to
              // across[1..j] plus cost of deleting
              // down[i] to get to down[1..i-1].
              ds[i - 1][j] + self.remove(d),
              // Cost of editing down[1..i] to
              // across[1..j-1] plus cost of inserting
              // across[j] to get to across[1..j].
              ds[i][j - 1] + self.insert(a),
              // Cost of editing down[1..i-1] to
              // across[1..j-1] plus cost of
              // substituting down[i] (d) with across[j]
              // (a) to get to across[1..j].
              ds[i - 1][j - 1] + (d === a ? 0 : self.substitute(d, a))
            );
            // Can we match the last two letters of down
            // with across by transposing them? Cost of
            // getting from down[i-2] to across[j-2] plus
            // cost of moving down[i-1] forward and
            // down[i] backward to match across[j-1..j].
            if (self.damerau
              && i > 1 && j > 1
              && down[i - 1] === a && d === across[j - 1]) {
              ds[i][j] = Math.min(
                ds[i][j],
                ds[i - 2][j - 2] + (d === a ? 0 : self.transpose(d, down[i - 1]))
              );
            };
          };
        });
      });
      return ds[down.length - 1][across.length - 1];
    };
  };

}