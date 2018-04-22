import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { addVariabile, addMessaggio } from "../Actions/index";
import uuidv1 from "uuid";

const mapDispatchToProps = dispatch => {
    return {
      addVariabile: variabile => dispatch(addVariabile(variabile))
    };
};

class ConnectedUpload extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            filename: 'Seleziona...',
            showSend: 0
        }

        this.handlefileupload = this.handlefileupload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlefileupload(e){
        if(e.target.value){
            this.setState({ 
                filename: (e.target.value.split( '\\' ).pop()) ? e.target.value.split( '\\' ).pop() : "Seleziona...",
                showSend: 1,
                progress: 0,
            });
        }
    }

    handleSubmit(e){
        e.preventDefault();
        var file = this.fileInput.files[0];
        var formdata = new FormData();
        formdata.append('file', file);

        axios.post('http://localhost:5000/upload', formdata, {
            onUploadProgress: (progressEvent) => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                if (totalLength !== null) {
                    this.setState({ progress: Math.round( (progressEvent.loaded * 100) / totalLength ) })
                }
            }
        }).then(response => {
            const name = response.data.name;

            if(name){
                this.props.addVariabile({ "name": name, "id": uuidv1() });
                this.props.addMessaggio({"id": uuidv1(), "who": "comp", "messaggio": "Dataset caricato " + response.data.name});
    
                this.setState({ showSend: 0, filename: "Seleziona..." });
            }else{
                this.setState({ showSend: 0, filename: "File non caricato!" });
            }
        })
    }

    render(){
        return (
            <form action="/" method="POST" encType="multipart/form-data" className="form-upload" onSubmit={this.handleSubmit}>
                <input type="file" name="file" id="file" className="hidden_input" onChange={this.handlefileupload} ref={input => { this.fileInput = input; }} />
                <label className="upload-file" htmlFor="file">
                    <i className="material-icons">attach_file</i>
                    <span className="file-name">{this.state.filename}</span>
                </label>
                <button type="submit" className={(this.state.showSend) ? "show_send send-file" : "send-file"}><i className="material-icons">file_upload</i><span className="progress_count">{this.state.progress}</span></button>
            </form>
        );
    }
}

const Upload = connect(null, mapDispatchToProps)(ConnectedUpload);
export default Upload;