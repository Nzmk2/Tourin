import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await login(email, password);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg('Login failed. Network error or server unavailable.');
      }
    }
  };

  if (loading) {
    return <div className="pageloader is-active is-light"><span className="title">Loading...</span></div>;
  }

  return (
    <section className="hero is-fullheight is-fullwidth has-background-light">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-one-third">
              <form onSubmit={handleLogin} className="box p-5 has-shadow-2">
                <p className="has-text-centered has-text-info is-size-3 has-text-weight-bold mb-5">Tourin Login</p>
                {msg && <p className="has-text-centered has-text-danger mb-4">{msg}</p>}
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <button type="submit" className="button is-info is-fullwidth">Login</button>
                </div>
                <div className="has-text-centered mt-4">
                  <Link to="/register">Don't have an account? Register here</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;