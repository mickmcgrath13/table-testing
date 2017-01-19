/**
 * Created by nlundqu on 2017-01-19.
 */

import mapHelpers from 'can/map/map_helpers';

// fixing memory issue with massive lists on setup
// filthiest hack ever, will need to work with Justin to fix this more robustly
can.List.prototype.setup = function(instances, options) {
  this.length = 0;
  can.cid(this, ".map");
  this._setupComputedProperties();
  instances = instances || [];
  var teardownMapping;

  if (can.isPromise(instances)) {
    this.replace(instances);
  } else {
    teardownMapping = instances.length && mapHelpers.addToMap(instances, this);
    if (instances.length > 40000) {
      // pushing a huge amount of args at once causes the stack to explode
      // push fewer at a time to resolve this
      // todo: push a few thousand items at a time
      for (var arg of instances) {
        this.push.apply(this, [arg]);
      }
    } else {
      this.push.apply(this, can.makeArray(instances || []));
    }
  }

  if (teardownMapping) {
    teardownMapping();
  }

  // this change needs to be ignored
  can.simpleExtend(this, options);
};
