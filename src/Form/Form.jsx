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
  const [online, setOnline] = useState(true);

  window.ononline = () => {
    setOnline(true);
    setError(false);
  };

  window.onoffline = () => {
    setOnline(false);
    setError('You are offline...');
  };

  const sendData = (e) => {
    e.preventDefault();
    const fNameInput = form.current.elements[2];
    const sNameInput = form.current.elements[3];
    const emailInput = form.current.elements[4];
    const messageInput = form.current.elements[5];

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

    setLoading(true);
    const body = { firstName, secondName, email, message };
    try {
      fetch('/api/sendMessage', {
        method: 'POST',
        body: JSON.stringify(body),
      }).then(async (res) => {
        setLoading('false');
        if (res.status === 200) {
          setError(false);
          setSuccess('Successfully done!');
        } else {
          setSuccess(false);
          setError(await res.json());
        }
      });
    } catch (e) {
      console.error(e);
      console.warn(e);
      setSuccess(false);
      setError(String(e));
    }
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
        online={online}
      />
    </form>
  );
}
