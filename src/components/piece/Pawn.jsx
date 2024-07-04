import React from 'react';

function Pawn (props) {

    const {color} = props;

    if(color === "light") {
        return (
            <div>
                <img src="../../assets/pawn_w.png" width="30" height="30" />
            </div>
        );
        
    } else if(color === "dark") {

        return (
            <div>
                <img src="../../assets/pawn_b.png" width="30" height="30" />
            </div>
        );
    };
};

export default Pawn;