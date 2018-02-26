'use strict';

var onKeyDown = require('./onKeyDown');
var makeSchema = require('./makeSchema');
var insertFootnote = require('./insertFootnote');
var isSelectionInFootnote = require('./utils/isSelectionInFootnote');

/**
 * @param {String} opts.typeFootnote type for the footnote block
 * @param {String} opts.typeRef type for the footnote ref
 */
function EditFootnote() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    opts.typeFootnote = opts.typeFootnote || 'footnote';
    opts.typeRef = opts.typeRef || 'footnote_ref';
    opts.defaultBlock = opts.defaultBlock || 'paragraph';

    var schema = makeSchema(opts);

    return {
        schema: schema,

        onKeyDown: onKeyDown.bind(null, opts),

        isSelectionInFootnote: isSelectionInFootnote.bind(null, opts),

        transforms: {
            insertFootnote: insertFootnote.bind(null, opts)
        }
    };
}

module.exports = EditFootnote;