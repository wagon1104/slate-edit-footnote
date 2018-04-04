'use strict';

/**
 * Create a schema for footnotes
 * @param {Object} opts
 * @return {Object} A schema definition with rules to normalize tables
 */
// function makeSchema(opts) {
//     return {
//         rules: [
//             footnotesInDocument(opts),
//             footnotesAtTheEnd(opts)
//         ]
//     };
// }

/**
 * Move a node to end of the document.
 * @param  {Transform} transform
 * @param  {Node} node
 * @return {Transform} transform
 */
function moveToDocumentEnd(transform, node) {
    var state = transform.state;
    var document = state.document;

    return transform.moveNodeByKey(node.key, document.key, document.nodes.size);
}

/**
 * Rule to enforce footnotes are in the document
 */
function footnotesInDocument(opts) {
    return {
        match: function match(node) {
            return node.kind === 'block';
        },
        validate: function validate(node) {
            var footnotes = node.nodes.filter(function (child) {
                return child.type === opts.typeFootnote;
            });

            if (footnotes.isEmpty()) return;

            return {
                footnotes: footnotes
            };
        },
        normalize: function normalize(transform, node, _ref) {
            var footnotes = _ref.footnotes;

            return footnotes.reduce(moveToDocumentEnd, transform);
        }
    };
}

/**
 * Rule to enforce footnotes are at the end
 */
function footnotesAtTheEnd(opts) {
    var isFootnode = function isFootnode(child) {
        return child.type === opts.typeFootnote;
    };

    return {
        match: function match(node) {
            return node.kind === 'document';
        },
        validate: function validate(node) {
            var nodes = node.nodes;

            var footnotesAtEnd = nodes.reverse().takeWhile(isFootnode);

            // Find all footnotes not at the end
            var lastNonFootnote = nodes.size - footnotesAtEnd.size;
            var invalids = nodes.slice(0, lastNonFootnote).filter(isFootnode);

            if (invalids.size === 0) return;

            return {
                invalids: invalids
            };
        },
        normalize: function normalize(transform, node, _ref2) {
            var invalids = _ref2.invalids;

            return invalids.reduce(moveToDocumentEnd, transform);
        }
    };
}

function makeSchema(opts, node) {
    var isFootnode = function isFootnode(child) {
        return child.type === opts.typeFootnote;
    };

    if (node.object === 'block') {
        var footnotes = node.nodes.filter(function (child) {
            return child.type === opts.typeFootnote;
        });

        if (footnotes.isEmpty()) return;

        var invalids = footnotes.isEmpty() ? null : {
            footnotes: footnotes
        };
        console.log(node.object, invalids);
        if (!invalids) return;
        return function (change) {
            // Reverse the list to handle consecutive merges, since the earlier nodes
            // will always exist after each merge.
            [invalids].reverse().forEach(function (n) {
                //   change.removeNodeByKey(n.key, { normalize: false })
                n.footnotes.reduce(moveToDocumentEnd, change);
            });
        };
    }
    if (node.object === 'document') {
        var nodes = node.nodes;

        var footnotesAtEnd = nodes.reverse().takeWhile(isFootnode);

        // Find all footnotes not at the end
        var lastNonFootnote = nodes.size - footnotesAtEnd.size;
        var _invalids = nodes.slice(0, lastNonFootnote).filter(isFootnode);

        if (_invalids.size === 0) return;
        return function (change) {
            // Reverse the list to handle consecutive merges, since the earlier nodes
            // will always exist after each merge.
            [_invalids].reverse().forEach(function (n) {
                //   change.removeNodeByKey(n.key, { normalize: false })
                n.reduce(moveToDocumentEnd, change);
            });
        };
    }

    // if (node.kind != 'document') return;
    // const e = node
    // .nodes
    // .filter(t => t.type === MarkupIt.BLOCKS.TEXT);
    // var invalids =  e.isEmpty()
    //     ? null
    //     : {
    //         unstyled: e
    //     }


    // if (!invalids) return;
    // return (change) => {
    //     // Reverse the list to handle consecutive merges, since the earlier nodes
    //     // will always exist after each merge.
    //     [invalids].reverse().forEach((n) => {
    //     //   change.removeNodeByKey(n.key, { normalize: false })
    //       n.unstyled
    //             .reduce((t, e) => change.setNodeByKey(e.key, {type: MarkupIt.BLOCKS.PARAGRAPH}), change)
    //     })
    //   }
}

module.exports = makeSchema;