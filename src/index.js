import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App
        boardWidth={15}
        rawBoard={`
            111110011101111
            111110111101111
            111111111111111
            000111100111111
            011101110111100
            111111111101111
            111110011110111
            111011111110111
            111011110011111
            111101111111111
            001111011101110
            111111001111000
            111111111111111
            111101111011111
            111101110011111
        `}
    />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
