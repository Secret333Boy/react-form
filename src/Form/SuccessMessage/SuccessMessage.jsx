import React, { useRef } from 'react';
import './SuccessMessage.css';

export default function ErrorMessage(props) {
  const msgRef = useRef(null);
  const hideMessage = () => {
    props.setSuccess(false);
  };
  return (
    <div className="successMessage" hidden={props.hidden} ref={msgRef}>
      {props.children}
      <button className="close" onClick={hideMessage}>
        х
      </button>
    </div>
  );
}
