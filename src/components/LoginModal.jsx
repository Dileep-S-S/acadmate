import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import './Register.css';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    usn: '',
    branch: '',
    section: '',
    email: '',
    phone: ''
  });

  const [error, setError] = useState({ message: '', field: '' });

  const branches = ['Biotechnology','Civil Engineering','Construction Technology and Management',
    'Computer Science and Engineering','Computer Science and Engineering(AI & ML)',
    'Computer Science and Business System','Electronics and Communication Engineering',
    'Information Science and Engineering','Mechanical Engineering','Bachelor of Computer Applications',
    'Bachelor of Business Administration','other'
  ];

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/\d/.test(password)) return 'Password must contain at least one number.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain a special character (e.g., !@#$%).';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ message: '', field: '' });

    if (isRegistering) {
      // Validation (same as before)
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key) && String(formData[key]).trim() === '') {
          setError({ message: 'Please fill in all required fields.', field: key });
          return;
        }
      }
      if (!formData.usn.toUpperCase().includes('JST')) {
        setError({ message: 'Invalid USN. It must contain "JST".', field: 'usn' });
        return;
      }
      if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
        setError({ message: 'Please provide a valid @gmail.com email address.', field: 'email' });
        return;
      }
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setError({ message: passwordError, field: 'password' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError({ message: 'Passwords do not match.', field: 'confirmPassword' });
        return;
      }

      try {
        // ✅ Firebase Registration
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        alert('Registration successful! You can now log in.');
        setIsRegistering(false);
      } catch (err) {
        console.error(err);
        setError({ message: err.message || 'Registration failed.', field: '' });
      }

    } else {
      // ✅ Firebase Login
      if (!formData.email || !formData.password) {
        setError({ message: 'Please enter both email and password.', field: 'email' });
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        onLogin({
          username: user.displayName || formData.username || 'User',
          email: user.email,
          usn: formData.usn || '',
          branch: formData.branch || '',
          section: formData.section || '',
          phone: formData.phone || '',
        });
        onClose();
      } catch (err) {
        console.error(err);
        setError({ message: 'Invalid email or password.', field: '' });
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error.message) setError({ message: '', field: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold custom-brown">
              {isRegistering ? 'Register' : 'Login'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 custom-brown" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'username' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Create a username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    USN
                  </label>
                  <input
                    type="text"
                    name="usn"
                    required
                    value={formData.usn}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'usn' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., 01JST21CS001"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium custom-brown mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'email' ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={isRegistering ? "your.name@gmail.com" : "Enter your email"}
              />
            </div>

            <div className={isRegistering ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
              <div>
                <label className="block text-sm font-medium custom-brown mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'password' ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={isRegistering ? "Create a strong password" : "Enter your password"}
                  title={isRegistering ? "Must contain at least 8 characters, including an uppercase, lowercase, number, and special character." : ""}
                />
              </div>
              {isRegistering && (
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'confirmPassword' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Confirm your password"
                  />
                </div>
              )}
            </div>

            {isRegistering && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium custom-brown mb-2">
                      Branch
                    </label>
                    <select
                      name="branch"
                      required
                      value={formData.branch}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'branch' ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium custom-brown mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      required
                      value={formData.section}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'section' ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium custom-brown mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'phone' ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="10-digit number"
                      pattern="^(91)?[0-9]{10}$"
                      title="Please enter a valid 10 or 12-digit number"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full custom-accent text-brown font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
            
            {error.message && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error.message}
              </div>
            )}
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="custom-brown opacity-70">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-2 text-accent font-semibold hover:underline"
              >
                {isRegistering ? 'Login' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
