import { useRef } from 'react'

const OtpInput = ({ otp, setOtp }) => {
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

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => (inputs.current[i] = el)}
          className="w-12 h-12 text-xl text-center border rounded shadow"
        />
      ))}
    </div>
  )
}

export default OtpInput
