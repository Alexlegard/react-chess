import React from 'react';

function Knight(props) {

    const {color} = props;

    if(color === "light") {
        return (
            <div>
                <img src="../../assets/knight_w.png" width="30" height="30" />
            </div>
        );
        
    } else if(color === "dark") {

        return (
            <div>
                <img src="../../assets/knight_b.png" width="30" height="30" />
            </div>
        );
    };
};

export default Knight;