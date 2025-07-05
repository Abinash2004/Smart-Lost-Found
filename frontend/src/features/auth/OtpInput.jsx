import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../lib/axios';

const OtpInput = ({
  otp,
  setOtp,
  title = '',
  buttonText = 'Verify & Continue',
  loading = false,
  onSubmit,
  isOtpComplete = false,
  email = '',
  isPasswordReset = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputs = useRef([]);

  const handleOtpVerification = async (e) => {
    e?.preventDefault();
    if (!isOtpComplete) return;

    try {
      const otpString = otp.join('');

      if (isPasswordReset) {
        const response = await axios.post('/auth/verify-password-otp', {
          email: email || location.state?.email,
          otp: otpString
        });

        const { resetToken } = response.data;

        navigate('/update-password', {
          state: {
            email: email || location.state?.email,
            resetToken
          }
        });
      } else if (onSubmit) {
        await onSubmit(e);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      if (onSubmit) {
        await onSubmit(e, error);
      }
    }
  };

  const handleChange = (e, i) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (i > 0 && otp[i - 1] === '') return;

      const newOtp = [...otp];
      newOtp[i] = value;
      setOtp(newOtp);

      if (value !== '' && i < otp.length - 1) {
        inputs.current[i + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[i]) {
        newOtp[i] = '';
        setOtp(newOtp);
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
      }
    }
  };

  return (
    <form onSubmit={handleOtpVerification} className="space-y-5">
      <div className="flex justify-center gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={(e) => {
              e.preventDefault();
              const paste = e.clipboardData.getData('text').trim();
              if (/^\d+$/.test(paste) && paste.length === otp.length) {
                const newOtp = paste.split('').slice(0, otp.length);
                setOtp([...newOtp, ...otp.slice(newOtp.length)]);
              }
            }}
            ref={(el) => (inputs.current[i] = el)}
            className="w-12 h-12 text-xl text-center border rounded-md shadow focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={!isOtpComplete || loading}
        className={`w-full py-2 rounded text-white text-sm font-medium flex items-center justify-center transition ${
          !isOtpComplete || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Verifying...
          </>
        ) : (
          isPasswordReset ? 'Continue to Reset Password' : buttonText
        )}
      </button>
    </form>
  );
};

export default OtpInput;
