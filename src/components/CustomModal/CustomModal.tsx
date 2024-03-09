import React, { FC } from 'react';
import './CustomModal.css';

interface Props {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const CustomModal: FC<Props> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <div className="custom-modal-content">
                    <p>{message}</p>
                    <div className="button-container">
                        <button onClick={onConfirm} className="modal-btn-submit" >Confirm</button>
                        <button onClick={onCancel} className="modal-btn-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
