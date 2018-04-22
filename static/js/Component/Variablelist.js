import React from "react";
import { connect } from "react-redux";
import axios from 'axios';

const mapStateToProps = state => {
    return { variabili: state.variabili };
};

class ConnectedList extends React.Component {
    render() {
        return (
            <div className="variable-list">
                {this.props.variabili.map(el => (
                    <div key={el.id} className={(this.props.selected == el.name) ? 'variable-container selected-var' : 'variable-container'} id={el.name} onClick={() => this.props.onClick(el)}>{el.name}</div>
                ))}
            </div>
        );
    }
}

const List = connect(mapStateToProps)(ConnectedList);
export default List;