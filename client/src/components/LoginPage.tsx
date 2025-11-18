import React, { useState } from 'react';
import { User, Lock, AlertCircle } from 'lucide-react';
import { authAPI } from '../utils/api';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userData;

      if (isRegistering) {
        // Register new user
        userData = await authAPI.register({
          name,
          email,
          password,
          role
        });
      } else {
        // Login existing user
        userData = await authAPI.login(email, password);
      }

      onLogin(userData.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">ESL Academy</h1>
          <p className="text-sm text-secondary">Professional Teaching Platform</p>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setError('');
              }}
              className={`btn ${!isRegistering ? 'btn-primary' : 'btn-secondary'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setError('');
              }}
              className={`btn ${isRegistering ? 'btn-primary' : 'btn-secondary'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="text-error mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="John Doe"
                required={isRegistering}
              />
            </div>
          )}

          <div>
            <label className="label">Login as</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`btn ${role === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Student
              </button>
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="your@email.com"
                required
              />
              <User size={18} className="absolute left-3 top-3 text-muted" />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <Lock size={18} className="absolute left-3 top-3 text-muted" />
            </div>
            {isRegistering && (
              <p className="text-xs text-muted mt-1">Minimum 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-secondary">
            {isRegistering
              ? 'Already have an account? Click Sign In above'
              : 'New user? Click Sign Up above to create an account'}
          </p>
        </div>

        <div className="mt-4 p-3 bg-surface rounded-lg">
          <p className="text-xs text-muted text-center">
            For testing: Use any email and password (min 6 chars)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;