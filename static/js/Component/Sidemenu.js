import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import List from './Variablelist';
import { clearMessaggi } from "../Actions/index";
var fileDownload = require('js-file-download');

const JsonTable = require('ts-react-json-table');

const mapClearMessaggiEvent = dispatch => {
    return {
      clearMessaggi: () => dispatch(clearMessaggi())
    };
};

class ConnectedSidemenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            idVar: '',
            selectedVar: '',
            contentVar: [],
            savedJup: 'Save Jupyter Notebook'
        }
        this.handleClick = this.handleClick.bind(this);
        this.clearSession = this.clearSession.bind(this);
        this.saveJupyter = this.saveJupyter.bind(this);
    }

    handleClick (el) {
        axios.get('http://localhost:5000/variable/' + el.name, {withCredentials: true, responseType: 'json'})
        .then(response => {
            console.log(response.data);
            this.setState({
                idVar: el.id,
                selectedVar: el.name,
                contentVar: response.data
            });
        })
    }

    clearSession(e) {
        axios.get('http://localhost:5000/api/clear', {withCredentials: true})
        .then(response => {
            this.props.clearMessaggi();
        })
    }

    saveJupyter(e){
        this.setState({ savedJup: 'Saved' });
        fileDownload("{cells: []}", 'acaso.ipynb');
    }

    render () {
        let getColumns = (columns) => {
            var array = [];
            for(let i = 0; i < columns.length; i++){
                array.push(columns[i].name);
            }
            return array;
        }

        const dettaglioVariabile = (this.state.selectedVar) ? (
            <div className="variable-detail">
                <h5>Dettagli Variabile</h5>
                <JsonTable className="table table-striped table-hover" theadClassName="thead-dark" rows={this.state.contentVar.data} columns={getColumns(this.state.contentVar.schema.fields)}/>
            </div>
        ) : (
            <div className="variable-detail"></div>
        );

        return (
            <div className="gestione col-12 col-md-6 col-lg-4">
                <div className="variable-context">
                    <h5>Variables</h5>
                    <List onClick={this.handleClick} selected={this.state.idVar}/>
                </div>
                {dettaglioVariabile}
                <div className="panel">
                    <button className="button-board" onClick={this.saveJupyter}>{this.state.savedJup}</button>
                    <button className="button-board" onClick={this.clearSession}>Clear</button>
                </div>
            </div>
        );
    }
}

const Sidemenu = connect(null, mapClearMessaggiEvent)(ConnectedSidemenu);
export default Sidemenu;