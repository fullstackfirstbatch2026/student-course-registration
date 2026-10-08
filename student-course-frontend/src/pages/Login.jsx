import { useState } from "react";
import API_BASE_URL from "../services/api";
import "./Login.css";
function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  // ==========================================
  // LOGIN FIELDS
  // ==========================================

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ==========================================
  // SIGN UP FIELDS
  // ==========================================

  const [signupUsername, setSignupUsername] =
    useState("");

  const [signupPassword, setSignupPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  // ==========================================
  // COMMON STATE
  // ==========================================

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          result || "Login failed"
        );
      }

      setMessage("Login successful!");

      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      }
    } catch (error) {
      setMessage(
        error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SIGN UP
  // ==========================================

  const handleSignup = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    if (!signupUsername.trim()) {
      setMessage(
        "Please enter a username."
      );
      setLoading(false);
      return;
    }

    if (!signupPassword) {
      setMessage(
        "Please enter a password."
      );
      setLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      setLoading(false);
      return;
    }

    if (
      signupPassword !== confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            username:
              signupUsername.trim(),

            password: signupPassword,

            // Backend also forces USER,
            // but this makes the intention clear.
            role: "USER",
          }),
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          result || "Registration failed."
        );
      }

      setMessage(
        "Account created successfully! Please sign in."
      );

      // Put the new username into the login form
      setUsername(
        signupUsername.trim()
      );

      // Clear signup fields
      setSignupUsername("");
      setSignupPassword("");
      setConfirmPassword("");

      // Switch to login after a moment
      setTimeout(() => {
        setMode("login");
        setMessage("");
        setPassword("");
      }, 1200);
    } catch (error) {
      setMessage(
        error.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SWITCH TO LOGIN
  // ==========================================

  const showLogin = () => {
    setMode("login");
    setMessage("");

    setSignupUsername("");
    setSignupPassword("");
    setConfirmPassword("");
  };

  // ==========================================
  // SWITCH TO SIGN UP
  // ==========================================

  const showSignup = () => {
    setMode("signup");
    setMessage("");

    setPassword("");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="login-page">

      <div className="login-glow login-glow-one"></div>

      <div className="login-glow login-glow-two"></div>

      <section className="login-card">

        {/* ======================================
            BRAND
            ====================================== */}

        <div className="brand-icon">
          🎓
        </div>

        {/* ======================================
            HEADER
            ====================================== */}

        <div className="login-header">

          <p className="welcome-text">
            {mode === "login"
              ? "WELCOME BACK"
              : "CREATE ACCOUNT"}
          </p>

          <h1>
            Student Portal
          </h1>

          <p className="subtitle">
            Student Course Registration
            Management System
          </p>

        </div>

        {/* ======================================
            LOGIN FORM
            ====================================== */}

        {mode === "login" && (

          <form
            onSubmit={handleLogin}
            className="login-form"
          >

            {/* USERNAME */}

            <div className="form-group">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                autoComplete="username"
                required
                disabled={loading}
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                required
                disabled={loading}
              />

            </div>

            {/* SIGN IN */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

        )}

        {/* ======================================
            SIGN UP FORM
            ====================================== */}

        {mode === "signup" && (

          <form
            onSubmit={handleSignup}
            className="login-form"
          >

            {/* USERNAME */}

            <div className="form-group">

              <label htmlFor="signup-username">
                Username
              </label>

              <input
                id="signup-username"
                type="text"
                placeholder="Choose a username"
                value={signupUsername}
                onChange={(event) =>
                  setSignupUsername(
                    event.target.value
                  )
                }
                autoComplete="username"
                required
                disabled={loading}
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="signup-password">
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(event) =>
                  setSignupPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                required
                disabled={loading}
              />

              <small className="signup-hint">
                Minimum 6 characters
              </small>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                required
                disabled={loading}
              />

            </div>

            {/* SIGN UP */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

        )}

        {/* ======================================
            MESSAGE
            ====================================== */}

        {message && (

          <div
            className={`login-message ${
              message === "Login successful!" ||
              message.includes(
                "Account created successfully"
              )
                ? "success"
                : "error"
            }`}
          >
            {message}
          </div>

        )}

        {/* ======================================
            SWITCH LOGIN / SIGNUP
            ====================================== */}

        <div className="auth-switch">

          {mode === "login" ? (

            <p>
              Don't have an account?

              <button
                type="button"
                onClick={showSignup}
                disabled={loading}
              >
                Sign Up
              </button>
            </p>

          ) : (

            <p>
              Already have an account?

              <button
                type="button"
                onClick={showLogin}
                disabled={loading}
              >
                Sign In
              </button>
            </p>

          )}

        </div>

        {/* ======================================
            FOOTER
            ====================================== */}

        <p className="login-footer">

          {mode === "signup"
            ? "Create a secure USER account"
            : "Secure access to your academic portal"}

        </p>

      </section>

    </main>
  );
}

export default Login;