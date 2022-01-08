import React from 'react';
import './Input.css';

export default function Input(props) {
  return (
    <input
      className="Input"
      type={props.type}
      placeholder={props.placeholder}
      required={props.required}
      name={props.name}
    ></input>
  );
}
