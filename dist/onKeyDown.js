'use strict';

var Slate = require('slate');
var isSelectionInFootnote = require('./utils/isSelectionInFootnote');

/**
 * Prevent enter from splitting footnotes block and apply a transform to add a
 * paragraph at the end of the document, right before the first foonote.
 *
 * @param {Object} opts  - options
 * @param {Object} event - event object
 * @param {Object} data  - slate data
 * @param {Object} state - slate state
 *
 */
module.exports = function onKeyDown(opts, event, data, state) {
    // console.log("--------onKeyDown----------",event.key,event.key === 'Enter')
    if (!(event.key === 'Enter' && isSelectionInFootnote(opts, data.value))) {
        // console.log("--------onKeyDown----------A")
        return;
    }
    // console.log("--------onKeyDown----------B")
    // debugger;
    // Only handle key enter and events in footnotes
    event.stopPropagation();
    event.preventDefault();

    var document = data.value.document;

    // Find first footnote index for a footnote in the document

    var firstFootnoteIndex = document.nodes.findKey(function (node) {
        return node.type === opts.typeFootnote;
    });

    // Create an empty block of type defaultBlock
    // const block = Slate.Block.create({
    //     type: opts.defaultBlock,
    //     data: {}
    // });
    var block = Slate.Block.create({
        type: opts.defaultBlock,
        data: {},
        nodes: [Slate.Text.create()]
    });

    return data.insertNodeByKey(document.key, firstFootnoteIndex, block).moveToRangeOf(block);
    // .apply();
};