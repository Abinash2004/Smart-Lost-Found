import { useRef, useCallback } from 'react';
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
  const btnClass = `w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
    !isOtpComplete || loading
      ? 'bg-neutral-800 cursor-not-allowed text-neutral-500'
      : 'bg-neutral-800 hover:bg-neutral-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1'}`;

  const handleOtpVerification = useCallback(async (e) => {
    e?.preventDefault();
    if (!isOtpComplete) return;
    if (onSubmit) return onSubmit(e);
  }, [isOtpComplete, onSubmit]);

  const handleChange = useCallback((e, i) => {
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
  }, [otp, setOtp]);

  const handleKeyDown = useCallback((e, i) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[i]) {
        newOtp[i] = '';
        setOtp(newOtp);
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
      }
    }
  }, [otp, setOtp]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(paste) && paste.length === otp.length) {
      const newOtp = paste.split('').slice(0, otp.length);
      setOtp([...newOtp, ...otp.slice(newOtp.length)]);
    }
  }, [otp, setOtp]);

  return (
    <form onSubmit={handleOtpVerification} className="space-y-6">
      <div className="flex justify-center gap-3">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            ref={(el) => (inputs.current[i] = el)}
            className="w-12 h-12 text-xl text-center bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-colors"
            disabled={loading}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            autoFocus={i === 0}
          />
        ))}
      </div>
      
      <button
        type="submit"
        className={btnClass}
        disabled={!isOtpComplete || loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Verifying...
          </span>
        ) : (
          isPasswordReset ? 'Continue to Reset' : buttonText
        )}
      </button>
    </form>
  );
};

export default OtpInput;
