import React from 'react';
import './PromotionPopup.css';

const PromotionPopup = ({ onPromote, onCancel, color }) => {

    debugger;
    
    /* Promotion popup for white */
    if(color === "w") {
        return (
            <div className = "promotion-popup-shadow">
                
                <div className = "promotion-popup-card">
                    <img src='../../assets/images/queen_w.png' alt="Queen" onClick={() => onPromote('q')} />
                    <img src='../../assets/images/rook_w.png' alt="Rook" onClick={() => onPromote('r')} />
                    <img src='../../assets/images/knight_w.png' alt="Knight" onClick={() => onPromote('n')} />
                    <img src='../../assets/images/bishop_w.png' alt="Bishop" onClick={() => onPromote('b')} />
                    <img src='../../assets/images/X_Icon.png' alt="cancel" onClick={() => onCancel()} />
                </div>
            </div>
        );
    }

    /* Promotion popup for black */
    else if(color === "b") {
        return (
            <div className = "promotion-popup-shadow">
                
                <div className = "promotion-popup-card">
                    <img src='../../assets/images/queen_b.png' alt="Queen" onClick={() => onPromote('q')} />
                    <img src='../../assets/images/rook_b.png' alt="Rook" onClick={() => onPromote('r')} />
                    <img src='../../assets/images/knight_b.png' alt="Knight" onClick={() => onPromote('n')} />
                    <img src='../../assets/images/bishop_b.png' alt="Bishop" onClick={() => onPromote('b')} />
                    <img src='../../assets/images/X_Icon.png' alt="cancel" onClick={() => onCancel()} />
                </div>
            </div>
        );
    }
    
}
    
export default PromotionPopup;

/*

onClick={() => onPromote('queen')}

*/