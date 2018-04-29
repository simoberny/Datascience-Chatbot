import React from "react";
import axios from 'axios';
import Form from "./Form";
import uuidv1 from "uuid";
import { connect } from "react-redux";
import { addMessaggio } from "../Actions/index";

const mapMessaggi = state => {
    return { messaggi: state.messaggi };
};

class ConnectedMessages extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected: '',
            nIn: 0
        }
        this.handleListClick = this.handleListClick.bind(this);
    }

    scrollToBottom(){
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
      
    componentDidMount() { this.scrollToBottom(); }
    componentDidUpdate() { this.scrollToBottom(); }

    handleListClick (e, id){
        this.setState({ selected: id });
    }

    render(){
        const list = this.props.messaggi.map((el, n) => {
            return(
                <li key={el.id} onClick={(e) => this.handleListClick(e, el.id)} >
                    <div className="line">
                        <span style={{display: (el.what == "code") ? "inline-block" : "none"}} className="incode">In [ {n} ]: </span>
                        <span style={{display: (el.what == "markdown") ? "inline-block" : "none"}} className="incode-markdown">{n}</span>
                        <span className={el.what}>
                            <span className={(el.what == "markdown") ? el.who : ' '}>{el.messaggio}</span>
                        </span>
                    </div>
                    <div className="output-area" style={{display: (el.output.content != null) ? "block" : "none"}} >
                        <span style={{display: (el.output.content != null) ? "inline-block" : "none"}} className="outcode">Out [ {n} ]: </span>
                        <img style={{display: (el.output.content != null && el.output.type == "image") ? "block" : "none"}} src={"data:image/gif;base64," + el.output.content}/>
                        <p>{el.output.content}</p>
                    </div>
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

const Messages = connect(mapMessaggi)(ConnectedMessages);

export default class Chat extends React.Component {
    render(){
        return (
            <div className="chat col-12 col-md-8 col-lg-8">
                <div className="scroll_container">
                    <Messages /> 
                </div>
                <Form />
            </div>
        );
    }
}