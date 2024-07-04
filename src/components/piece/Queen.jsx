import React from 'react';

function Queen(props) {

    const {color} = props;

    if(color === "light") {
        return (
            <div>
                <img src="../../assets/queen_w.png" width="30" height="30" />
            </div>
        );
        
    } else if(color === "dark") {

        return (
            <div>
                <img src="../../assets/queen_b.png" width="30" height="30" />
            </div>
        );
    };
};

export default Queen;