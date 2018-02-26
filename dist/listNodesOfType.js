"use strict";

/**
 * List all node of a specific type in the page
 * @param {Slate.State} state
 * @param {String} type
 * @return {List<Node>} nodes
 */
function listNodesOfType(state, type) {
    var document = state.document;


    return document.filterDescendants(function (node) {
        return node.type === type;
    });
}

module.exports = listNodesOfType;