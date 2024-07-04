import React from 'react';

function Bishop(props) {

    const {color} = props;

    if(color === "light") {
        return (
            <div>
                <img src="../../assets/bishop_w.png" width="30" height="30" />
            </div>
        );
        
    } else if(color === "dark") {

        return (
            <div>
                <img src="../../assets/bishop_b.png" width="30" height="30" />
            </div>
        );
    };
};

export default Bishop;