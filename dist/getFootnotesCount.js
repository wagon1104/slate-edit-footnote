'use strict';

var listNodesOfType = require('./listNodesOfType');

/**
 * Return counts of all footnotes in the document
 * @return {Number} counts
 */
function getFootnotesCount(opts, state) {
  var footnotes = listNodesOfType(state, opts.typeFootnote);
  return footnotes.size;
}

module.exports = getFootnotesCount;