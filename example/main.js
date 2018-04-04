import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class'
// const React = require('react');
// const ReactDOM = require('react-dom');
// const Slate = require('slate');
const FootnotePlugin = require('../src');

const stateJson = require('./state');

const initialValue = Value.fromJSON(stateJson)
// const initialValue = Value.fromJSON({
//     document: {
//       nodes: [
//         {
//           object: 'block',
//           type: 'paragraph',
//           nodes: [
//             {
//               object: 'text',
//               leaves: [
//                 {
//                   text: 'A line of text in a paragraph.',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   })


const footnotePlugin = FootnotePlugin();
const plugins = [
    footnotePlugin
];

const schema = {
    nodes: {
        // footnote_ref: FootnoteRef,
        footnote_ref: props => <sup>{props.node.data.get('id')}</sup>,
        footnote:     props => <div className="footnote">{props.node.data.get('id')}: {props.children}</div>,
        paragraph:    props => <p {...props.attributes}>{props.children}</p>,
        heading:      props => <h1 {...props.attributes}>{props.children}</h1>
    }
};

schema.nodes.paragraph.propTypes = schema.nodes.heading.propTypes = {
    attributes: PropTypes.object.isRequired,
    children:   PropTypes.node.isRequired
};

schema.nodes.footnote_ref.propTypes = {
    node: PropTypes.object.isRequired
};

schema.nodes.footnote.propTypes = {
    node:     PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};

const Toolbar = createReactClass({
    propTypes: {
        onInsertFootnote: PropTypes.func.isRequired
    },

    render() {
        return (
            <div>
                <button onClick={this.props.onInsertFootnote}>Insert Footnote</button>
            </div>
        );
    }
});

const Example = createReactClass({
    getInitialState() {
        return {
            value: initialValue//Slate.Raw.deserialize(stateJson, { terse: true })
        };
    },

    onChange({ value })  {
        // console.log(JSON.stringify(value.toJSON()))
        this.setState({ value })
    },
    renderNode(props ){
        var type = props.node.type;
  
        var Comp = schema.nodes[type]
        if(Comp)return <Comp {...props} />
    },
    onInsertFootnote(e) {
        const { value } = this.state;

        this.onChange(
            footnotePlugin.transforms.insertFootnote(value.change()).focus()
        );
    },

    render() {
        // const { value } = this.state;

        return (
            <div>
                <Toolbar
                    onInsertFootnote={this.onInsertFootnote}
                />

                <Editor
                    placeholder={'Enter some text...'}
                    plugins={plugins}
                    value={this.state.value}
                    onChange={this.onChange}
                    renderNode={this.renderNode}
                />
            </div>
        );
    }
});



ReactDOM.render(
    <Example />,
    document.getElementById('example')
);
