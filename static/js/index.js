import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./Store/index";
import { Provider } from "react-redux";

import { addVariabile } from "./Actions/index";
import { addMessage } from "./Actions/index"

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("content")
);
