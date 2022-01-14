import React from 'react';
import './SuccessMessage.css';

export default function ErrorMessage(props) {
  const hideMessage = (e) => {
    e.preventDefault();
    props.setSuccess(false);
  };
  return (
    <div className="successMessage" hidden={props.hidden}>
      {props.children}
      <button className="close" onClick={hideMessage}>
        х
      </button>
    </div>
  );
}
