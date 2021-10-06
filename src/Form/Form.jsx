import React from 'react';
import './Form.css';
import Input from './Input/Input.jsx';
import SubmitButton from './SubmitButton/SubmitButton.jsx';

const sendData = (e) => {
  e.preventDefault();
};

export default function Form() {
  return (
    <form name="form">
      <div className="inputWrapper">
        <Input type="text" placeholder="First name" required />
        <Input type="text" placeholder="Second name" />
      </div>
      <div className="inputWrapper">
        <Input type="email" placeholder="Email" required />
        <textarea placeholder="Message" />
      </div>
      <br />
      <SubmitButton type="submit" placeholder="Submit" onClick={sendData} />
    </form>
  );
}
