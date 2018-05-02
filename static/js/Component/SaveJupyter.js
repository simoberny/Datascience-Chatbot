import React from "react";
import { connect } from "react-redux";
var fileDownload = require('js-file-download');

var metadata = {
    "kernelspec": {
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

const mapMessaggi = state => {
    return { messaggi: state.messaggi };
};

class ConnectedJupyter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            savedJup: 'Save Jupyter Notebook'
        }

        this.saveJupyter = this.saveJupyter.bind(this);
    }

    generateJSON(){
        var cells = [];

        this.props.messaggi.map(el =>{
            if(el.output.content != null){
                var dati = (el.output.type == "image/png") ? {"image/png": el.output.content} : {"text/plain": [el.output.content]}
                var result_type = (el.output.type == "image/png") ? "display_data" : "execute_result";

                var outputs = (el.output.content != null) ? {"data": dati, "metadata": {}, "execution_count": 1, "output_type": result_type} : "";

                cells.push({"cell_type": "code", "execution_count": 1, "metadata": {}, "outputs": [outputs], "source": [el.code]});
            }else{
                if(el.who == "me"){
                    cells.push({"cell_type": "markdown", "metadata": {}, "source": ["### &#x1F539; " + el.messaggio]});
                }else{
                    cells.push({"cell_type": "markdown", "metadata": {}, "source": ["&#x1F538; " + el.messaggio + "\n *** "]});
                }
            }
        });

        var struttura = {
            "cells": cells,
            "metadata": metadata,
            "nbformat": 4,
            "nbformat_minor": 2
        }

        return struttura;
    }

    saveJupyter(e){
        this.setState({ savedJup: 'Saved' });
        var ipynb = this.generateJSON();
        fileDownload(JSON.stringify(ipynb), 'jupyter.ipynb');
    }

    render(){
        return(
            <button className="button-board-lateral" onClick={this.saveJupyter}>{this.state.savedJup}</button>
        );
    }
}

const Jupyter = connect(mapMessaggi)(ConnectedJupyter);
export default Jupyter;