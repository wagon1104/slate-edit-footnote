'use strict';

var Slate = require('slate');
var getFootnotesCount = require('./getFootnotesCount');

var DEFAULT_TEXT = 'Enter footnote here.';

/**
 * Insert a footnote at end of selection:
 *     1. Insert an entity "footnote-ref"
 *     2. Insert a block at the end of the document, of type "footnote"
 *
 * @param  {Object} opts
 * @param  {Slate.Transform} transform
 * @param  {String} defaultText
 * @return {Slate.Transform}
 */
function insertFootnote(opts, transform) {
    var defaultText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_TEXT;
    var _transform = transform,
        value = _transform.value;

    var footnotes = getFootnotesCount(opts, value);
    var footnodeRef = String(footnotes + 1);

    var document = value.document;

    var lastIndex = document.nodes.count();
    var footnote = Slate.Block.create({
        type: opts.typeFootnote,
        data: { id: footnodeRef },
        nodes: [Slate.Text.create()]
    });

    transform = transform
    // Collapse selection
    .collapseToEnd()

    // Insert ref
    .insertInline({
        type: opts.typeRef,
        isVoid: true,
        data: {
            id: footnodeRef
        }
    }, { normalize: false })

    // Insert block at the end
    .insertNodeByKey(document.key, lastIndex, footnote)

    // Insert text
    .moveToRangeOf(footnote).insertText(defaultText)
    // set selection to footnote
    .extend(defaultText.length);

    return transform;
}

module.exports = insertFootnote;