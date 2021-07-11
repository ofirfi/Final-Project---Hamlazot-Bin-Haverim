import './pageNotFound.css';
import React from 'react';
import { useHistory } from 'react-router-dom'
import Image from '../images/No-Reception.jpg'

const PageNotFound = () => {
    const history = useHistory()
    return (
        <div className="flex flex-col p-32">
            <div className="flex flex-row">
                <div>
                    <img src={Image} alt=""></img>
                </div>
                <div className="flex flex-col text-3xl font-black">
                    <h2 className = "h-1/2 flex items-end">OPS...</h2>
                    <h1 className = "h-1/2 flex items-start">404 NOT FOUND!</h1>
                </div>
            </div>
            <i className = "underline font-mono"
                onClick={() => history.push('')}
                >
                לחזרה לדף הראשי לחץ כאן
            </i>

        </div>
    );
};

export default PageNotFound;