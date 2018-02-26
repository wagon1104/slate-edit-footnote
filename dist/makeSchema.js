'use strict';

/**
 * Create a schema for footnotes
 * @param {Object} opts
 * @return {Object} A schema definition with rules to normalize tables
 */
function makeSchema(opts) {
    return {
        rules: [footnotesInDocument(opts), footnotesAtTheEnd(opts)]
    };
}

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

module.exports = makeSchema;