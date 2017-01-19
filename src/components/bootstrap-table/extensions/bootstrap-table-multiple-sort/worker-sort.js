importScripts('comparator.js');

onmessage = function(event) {
  var data = event.data.data,
      sortPriority = event.data.sortPriority;

  data.sort((a, b) => {
      return Comparators.comparator(a, b, sortPriority);
  });

  self.postMessage(data);
};

