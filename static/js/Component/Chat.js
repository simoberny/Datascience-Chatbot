import React from "react";
import axios from 'axios';
import Form from "./Form";
import uuidv1 from "uuid";
import { connect } from "react-redux";
import { addMessaggio } from "../Actions/index";

const mapStateToProps = state => {
    return { messaggi: state.messaggi };
};

class ConnectedMessages extends React.Component {
    scrollToBottom(){
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
      
    componentDidMount() { this.scrollToBottom(); }
      
    componentDidUpdate() { this.scrollToBottom(); }

    render(){
        const list = this.props.messaggi.map(el =>{
            return(
                <li key={el.id} className={el.who}>
                    {el.messaggio}
                </li>
            );
        });

        return(
            <ul className="chat-thread">
                {list}
                <li style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}></li>
            </ul>
        );
    }
}

const Messages = connect(mapStateToProps)(ConnectedMessages);

export default class Chat extends React.Component {
    render(){
        return (
            <div className="chat col-12 col-md-6 col-lg-8">
                <div className="scroll_container">
                    <Messages /> 
                </div>
                <Form />
            </div>
        );
    }
}