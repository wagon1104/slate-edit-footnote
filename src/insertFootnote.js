const Slate = require('slate');
const getFootnotesCount = require('./getFootnotesCount');

const DEFAULT_TEXT = 'Enter footnote here.';

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
function insertFootnote(opts, transform, defaultText = DEFAULT_TEXT) {
    const { value }   = transform;
    const footnotes   = getFootnotesCount(opts, value);
    const footnodeRef = String(footnotes + 1);

    const { document } = value;
    const lastIndex = document.nodes.count();
    const footnote = Slate.Block.create({
        type: opts.typeFootnote,
        data: { id: footnodeRef },
        nodes: [Slate.Text.create()]
    });

    // console.log("AAAAAAAAAA");
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
        .moveToRangeOf(footnote)
        .insertText(defaultText)
        // set selection to footnote
        .extendLineBackward(defaultText.length);

    return transform;
}

module.exports = insertFootnote;
