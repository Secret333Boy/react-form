import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage(props) {
  const hideMessage = () => {
    props.setError(false);
  };
  return (
    <div className="errorMessage" hidden={props.hidden}>
      {props.children}
      <button className="close" onClick={hideMessage}>
        х
      </button>
    </div>
  );
}
