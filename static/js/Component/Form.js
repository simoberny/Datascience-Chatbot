import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { addMessaggio } from "../Actions/index";
import uuidv1 from "uuid";
import Upload from "./Upload"

const mapDispatchToPropsMessaggio = dispatch => {
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
        axios.get('http://localhost:5000/api/messages', {withCredentials: true})
        .then(response => {
            response.data.messages.map(messaggio => {
                this.props.addMessaggio({"id": uuidv1(), "who": messaggio[0], "messaggio": messaggio[1]});
            })
        })
    }

    handleKeyPress(event) {
        if(event.key === 'Enter'){
            var value = event.target.value;

            this.props.addMessaggio({"id": uuidv1(), "who": "me", "messaggio": value});
            this.setState({ inputValue: ''});

            axios.get('http://localhost:5000/api/message?message=' + value, {withCredentials: true})
            .then(response => {
                this.props.addMessaggio({"id": uuidv1(), "who": "comp", "messaggio": response.data.response});
            })
        }
    }

    handleChange(evt){
        this.setState({ inputValue: evt.target.value });
    }

    render(){
        return (
            <div className="control">
                <input type="text" name="input" id="dialog" autoComplete="off" placeholder="Ask me something!" value={this.state.inputValue} onKeyPress={this.handleKeyPress} onChange={this.handleChange}/>
                <Upload addMessaggio={this.props.addMessaggio}/>
            </div>
        );
    }
}

const Form = connect(null, mapDispatchToPropsMessaggio)(ConnectedForm);
export default Form;