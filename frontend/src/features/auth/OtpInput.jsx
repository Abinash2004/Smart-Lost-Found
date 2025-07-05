import { useRef } from 'react'

const OtpInput = ({
  otp,
  setOtp,
  title = 'Verify OTP',
  buttonText = 'Verify & Continue',
  loading = false,
  onSubmit,
  isOtpComplete = false,
  children,
  containerClassName = 'min-h-screen flex items-center justify-center bg-gray-50',
  formClassName = 'bg-white p-6 rounded-xl shadow-md max-w-sm w-full space-y-6',
  titleClassName = 'text-2xl font-bold text-center',
  otpContainerClassName = 'flex gap-2 justify-center my-4',
  inputClassName = 'w-12 h-12 text-xl text-center border rounded shadow',
  buttonClassName = 'w-full py-2 rounded text-white transition',
  buttonDisabledClassName = 'bg-gray-400 cursor-not-allowed',
  buttonEnabledClassName = 'bg-blue-600 hover:bg-blue-700'
}) => {
  const inputs = useRef([])

  const handleChange = (e, i) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      // Prevent skipping blocks
      if (i > 0 && otp[i - 1] === '') return

      const newOtp = [...otp]
      newOtp[i] = value
      setOtp(newOtp)

      if (value !== '' && i < otp.length - 1) {
        inputs.current[i + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp]
      if (otp[i]) {
        newOtp[i] = ''
        setOtp(newOtp)
      } else if (i > 0) {
        inputs.current[i - 1]?.focus()
      }
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (isOtpComplete && onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <div className={containerClassName}>
      <form onSubmit={handleSubmit} className={formClassName}>
        {title && <h2 className={titleClassName}>{title}</h2>}
        
        <div className={otpContainerClassName}>
          {otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => {
                e.preventDefault()
                const paste = e.clipboardData.getData('text').trim()
                if (/^\d+$/.test(paste) && paste.length === otp.length) {
                  const newOtp = paste.split('').slice(0, otp.length)
                  setOtp([...newOtp, ...otp.slice(newOtp.length)])
                }
              }}
              ref={(el) => (inputs.current[i] = el)}
              className={inputClassName}
              disabled={loading}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
            />
          ))}
        </div>

        {children}

        <button
          type="submit"
          disabled={!isOtpComplete || loading}
          className={`${buttonClassName} ${
            !isOtpComplete || loading
              ? buttonDisabledClassName
              : buttonEnabledClassName
          }`}
        >
          {loading ? 'Verifying...' : buttonText}
        </button>
      </form>
    </div>
  )
}

export default OtpInput
