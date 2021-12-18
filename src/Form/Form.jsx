import React, { useRef, useState } from 'react';
import './Form.css';
import Input from './Input/Input.jsx';
import SubmitButton from './SubmitButton/SubmitButton.jsx';
import SuccessMessage from './SuccessMessage/SuccessMessage.jsx';
import ErrorMessage from './ErrorMessage/ErrorMessage.jsx';

export default function Form() {
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

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

    const body = { firstName, secondName, email, message };
    setLoading(true);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/sendMessage`);
    xhr.send(JSON.stringify(body));
    xhr.onload = () => {
      setLoading('false');
      if (xhr.status === 200) {
        setError(false);
        setSuccess('Successfully done!');
      } else {
        setSuccess(false);
        setError(xhr.response);
      }
    };
  };
  return (
    <form name="form" method="post" ref={form}>
      <SuccessMessage hidden={!success} setSuccess={setSuccess}>
        {success.toString()}
      </SuccessMessage>
      <ErrorMessage hidden={!error} setError={setError}>
        {error.toString()}
      </ErrorMessage>
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
