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
    const [firstName, secondName, email, message] = Array.from(
      form.current.elements
    )
      .map((el) => {
        if (['fname', 'email'].includes(el.name) && !el.value)
          el.classList.add('requireWarning');
        return el.value;
      })
      .filter((el) => el);
    if (!firstName || !email) return;
    setLoading(true);
    const body = { firstName, secondName, email, message };
    fetch('/sendMessage', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      setLoading('false');
      if (res.status === 200) {
        setError(false);
        setSuccess('Successfully done!');
      } else {
        setSuccess(false);
        setError(res.statusText);
      }
    }).catch((e) => {
      console.error(e);
      setLoading(false);
      setSuccess(false);
      setError(String(e));
    });
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
