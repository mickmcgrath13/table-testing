var isNumeric = function(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var Comparators = {
  comparator: function(a,b, sortPriority) {
      if(!sortPriority){
          return false;
      }


      var arr1 = [],
          arr2 = [];

      var cmp = function(x, y) {
          return x > y ? 1 : x < y ? -1 : 0;
      };

      for (var i = 0; i < sortPriority.length; i++) {


          var order = sortPriority[i].sortOrder === 'desc' ? -1 : 1,
              aa = a[sortPriority[i].sortName],
              bb = b[sortPriority[i].sortName];

          if (aa === undefined || aa === null) {
              aa = '';
          }
          if (bb === undefined || bb === null) {
              bb = '';
          }
          if (isNumeric(aa) && isNumeric(bb)) {
              aa = parseFloat(aa);
              bb = parseFloat(bb);
          }
          if (typeof aa !== 'string') {
              aa = aa.toString();
          }

          arr1.push(
              order * cmp(aa, bb));
          arr2.push(
              order * cmp(bb, aa));


          if(cmp(arr1, arr2) !== 0){
              break;
          }
      }

      return cmp(arr1, arr2);
  }
};


if(typeof(module) !== 'undefined'){
  module.exports = Comparators;
}