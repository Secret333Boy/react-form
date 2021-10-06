import React from 'react';
import './SubmitButton.css';

export default function SubmitButton(props) {
  return (
    <input
      className="submitButton"
      type="submit"
      placeholder={props.placeholder}
      onClick={props.onClick}
    />
  );
}
