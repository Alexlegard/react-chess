import React from 'react';

function King(props) {

    const {color} = props;

    if(color === "light") {
        return (
            <div>
                <img src="../../assets/king_w.png" width="30" height="30" />
            </div>
        );
        
    } else if(color === "dark") {

        return (
            <div>
                <img src="../../assets/king_b.png" width="30" height="30" />
            </div>
        );
    };
};

export default King;