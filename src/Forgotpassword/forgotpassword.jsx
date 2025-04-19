import React, { useState } from 'react';

function PasswordReset() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const api = 'http://localhost:5000'; // Update to your Flask backend URL if hosted elsewhere

  const handleForgotPassword = async () => {
    try {
      const res = await fetch(`${api}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep(2);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetch(`${api}/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep(3);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch(`${api}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep(1);
        setEmail('');
        setCode('');
        setNewPassword('');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>

        {message && <p className="text-red-500 text-sm text-center">{message}</p>}

        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleForgotPassword}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Reset Code
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input
              type="text"
              placeholder="Enter 4-digit code"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={handleVerifyCode}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Verify Code
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordReset;
