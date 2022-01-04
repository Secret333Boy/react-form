import React from 'react';
import './SubmitButton.css';
import spinner from './MkTK.gif';

export default function SubmitButton(props) {
  if (!props.online) {
    return <div>Offline...</div>;
  }
  if (props.loading === 'false') {
    return (
      <input
        className="submitButton"
        type="submit"
        placeholder={props.placeholder}
        onClick={props.onClick}
        loading={props.loading}
      />
    );
  } else {
    return (
      <div className="spinnerWrapper">
        <img className="spinner" src={spinner} alt="Loading..." />
      </div>
    );
  }
}
