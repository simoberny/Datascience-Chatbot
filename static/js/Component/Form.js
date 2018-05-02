import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { addMessaggio } from "../Actions/index";
import uuidv1 from "uuid";
import Upload from "./Upload";

const mapAddMessaggioEvent = dispatch => {
    return {
      addMessaggio: messaggio => dispatch(addMessaggio(messaggio))
    };
};

class ConnectedForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: ''
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        axios.get('http://localhost:8080/api/messages', {withCredentials: true})
        .then(response => {
            response.data.map(messaggio => {
                this.props.addMessaggio({id: uuidv1(), who: messaggio.who, what: messaggio.what, messaggio: messaggio.message, output: {type: messaggio.output.type, content: messaggio.output.content}, code: messaggio.code});
            })
        })
    }

    handleKeyPress(event) {
        if(event.key === 'Enter'){
            var value = event.target.value;
            

            this.props.addMessaggio({id: uuidv1(), who: "me", what: "markdown", messaggio: value, output: {type: null, content: null}});
            this.setState({ inputValue: ''});

            var url = 'http://localhost:8080/api/message?message=' + encodeURIComponent(value);

            axios.get(url, {withCredentials: true})
            .then(response => {
                this.props.addMessaggio({id: uuidv1(), who: "comp", what: "markdown", messaggio: response.data.response, output: {type: response.data.output.type, content: response.data.output.content}, code: response.data.code});
            })
        }
    }

    handleChange(evt){
        this.setState({ inputValue: evt.target.value });
    }

    render(){
        return (
            <div className="control">
                <button className="button-board round"><i className="material-icons">undo</i></button>
                <button className="button-board round"><i className="material-icons">redo</i></button>
                <input type="text" name="input" id="dialog" autoComplete="off" placeholder="Ask me something!" value={this.state.inputValue} onKeyPress={this.handleKeyPress} onChange={this.handleChange}/>
                <Upload addMessaggio={this.props.addMessaggio}/>
            </div>
        );
    }
}

const Form = connect(null, mapAddMessaggioEvent)(ConnectedForm);
export default Form;