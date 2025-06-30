// src/features/auth/RegisterForm.jsx
import { useState } from 'react'

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    designation: '',
    contactNumber: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white shadow rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Designation</option>
        <option value="Student">Student</option>
        <option value="Staff">Staff</option>
      </select>

      <input
        name="contactNumber" 
        value={formData.contactNumber}
        onChange={handleChange}
        placeholder="Contact Number"
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Send OTP
      </button>
    </form>
  )
}

export default RegisterForm
