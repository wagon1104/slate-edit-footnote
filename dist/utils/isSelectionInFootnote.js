"use strict";

/**
 * Is the selection in a footnote
 *
 * @param {Object} options
 * @param {State} state
 */
module.exports = function isSelectionInFootnote(opts, state) {
    var startBlock = state.startBlock;

    // Only handle events in cells

    return startBlock.type === opts.typeFootnote;
};