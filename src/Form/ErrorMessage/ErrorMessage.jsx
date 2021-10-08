import React, { useRef } from 'react';
import './ErrorMessage.css';

export default function ErrorMessage(props) {
  const msgRef = useRef(null);
  const hideMessage = () => {
    props.setError(false);
  };
  return (
    <div className="errorMessage" hidden={props.hidden} ref={msgRef}>
      {props.children}
      <button className="close" onClick={hideMessage}>
        х
      </button>
    </div>
  );
}
