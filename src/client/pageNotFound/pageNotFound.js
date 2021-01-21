import './pageNotFound.css';
import React from 'react';
import {useHistory} from 'react-router-dom'


const PageNotFound = () => {
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

export default PageNotFound;