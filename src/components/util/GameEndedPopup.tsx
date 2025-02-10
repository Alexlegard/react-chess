import React, { Component } from 'react';
import './GameEndedPopup.css';

interface GameEndedPopupProps {
    result: string;
}

class GameEndedPopup extends Component<GameEndedPopupProps> {

    render() {
        const result = this.props.result;
        return (
            <div className='result-popup'>
                <p>{result}</p>            
            </div>
        );
    }
}

export default GameEndedPopup;