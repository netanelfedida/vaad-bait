import React from 'react';
import '../CSS/PopUp.css';
import { MDBIcon } from 'mdb-react-ui-kit';

export default function PopUp({ show, onClose, children }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <MDBIcon color='danger' far className="btn-close" onClick={onClose}/>
                {children}
            </div>
        </div>
    );
}
