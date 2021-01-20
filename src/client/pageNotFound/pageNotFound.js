import './pageNotFound.css';
import React from 'react';
import {useHistory,Link} from 'react-router-dom'


export default () => {
    const history = useHistory()
    return (
        <div>
            <h1>404 NOT FOUND!</h1>
            <i  onClick={() => {history.goBack()}}>
            Click here to return to the previous page
            </i>
        </div>
    );
};