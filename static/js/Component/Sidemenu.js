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

const mapMessaggi = state => {
    return { messaggi: state.messaggi };
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
        axios.get('http://localhost:8080/api/variable/' + el.name, {withCredentials: true, responseType: 'json'})
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
        axios.get('http://localhost:8080/api/clear', {withCredentials: true})
        .then(response => {
            this.props.clearMessaggi();
        })
    }

    saveJupyter(e){
        this.setState({ savedJup: 'Saved' });

        var metadata = {"kernelspec": {
                                "display_name": "Python 3",
                                "language": "python",
                                "name": "python3"
                            },
                        "language_info": {
                            "codemirror_mode": {
                                "name": "ipython",
                                "version": 3
                            },
                            "file_extension": ".py",
                            "mimetype": "text/x-python",
                            "name": "python",
                            "nbconvert_exporter": "python",
                            "pygments_lexer": "ipython3",
                            "version": "3.6.4"
                        }
                    };

        var cells = [];

        this.props.messaggi.map(el =>{
            var source = [];
            source.push(el.messaggio);

            if(el.what == "code"){
                var type = (el.output.type == "image/png") ? {"image/png": el.output.content} : {"text/plain": [el.output.content]}
                var outputs = (el.output.content != null) ? {"data": { 
                    type
                },"metadata": {}, "output_type": "display_data"} : "";
                cells.push({"cell_type": el.what, "execution_count": 1, "metadata": {}, "outputs": [outputs], source});
            }else{
                cells.push({"cell_type": el.what, "metadata": {}, source});
            }
        });

        var json = {
            "cells": cells,
            "metadata": metadata,
            "nbformat": 4,
            "nbformat_minor": 2
        }

        fileDownload(JSON.stringify(json), 'acaso.ipynb');
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
            <div className="gestione col-12 col-md-4 col-lg-4">
                <div className="variable-context">
                    <h5>Variables</h5>
                    <List onClick={this.handleClick} selected={this.state.idVar}/>
                </div>
                {dettaglioVariabile}
                <div className="panel">
                    <button className="button-board-lateral" onClick={this.saveJupyter}>{this.state.savedJup}</button>
                    <button className="button-board-lateral" onClick={this.clearSession}>Clear</button>
                </div>
            </div>
        );
    }
}

const Sidemenu = connect(mapMessaggi, mapClearMessaggiEvent)(ConnectedSidemenu);
export default Sidemenu;