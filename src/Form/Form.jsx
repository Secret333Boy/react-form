import React, { useRef, useState } from 'react';
import './Form.css';
import Input from './Input/Input.jsx';
import SubmitButton from './SubmitButton/SubmitButton.jsx';

export default function Form() {
  const form = useRef(null);
  const [loading, setLoading] = useState(false);

  const sendData = (e) => {
    e.preventDefault();

    const fNameInput = form.current.querySelector('input[name="fname"]');
    const sNameInput = form.current.querySelector('input[name="sname"]');
    const emailInput = form.current.querySelector('input[name="email"]');
    const messageInput = form.current.querySelector(
      'textarea[name="textarea"]'
    );

    const firstName = fNameInput.value;
    const secondName = sNameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;

    if (!firstName) {
      fNameInput.classList.add('requireWarning');
      return;
    }

    if (!email) {
      emailInput.classList.add('requireWarning');
      return;
    }

    const queryString = `fName=${firstName}&sName=${secondName}&email=${email}&message=${message}`;

    setLoading(true);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/sendMessage?${queryString}`);
    xhr.send();
    xhr.onload = () => {
      console.log(xhr.response);
      setLoading('false');
    };
  };
  return (
    <form name="form" method="post" ref={form}>
      <div className="inputWrapper">
        <Input name="fname" type="text" placeholder="First name" required />
        <Input name="sname" type="text" placeholder="Second name" />
      </div>
      <div className="inputWrapper">
        <Input name="email" type="email" placeholder="Email" required />
        <textarea name="textarea" placeholder="Message" />
      </div>
      <br />
      <SubmitButton
        type="submit"
        placeholder="Submit"
        onClick={sendData}
        loading={loading.toString()}
      />
    </form>
  );
}
