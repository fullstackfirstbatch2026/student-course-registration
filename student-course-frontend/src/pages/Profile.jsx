import { useEffect, useState } from "react";

import {
  UserCircle,
  ShieldCheck,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";

import API_BASE_URL from "../services/api";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  async function loadProfile() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/users/me`,
        {
          credentials: "include",
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        throw new Error(
          responseText ||
            "Unable to load profile."
        );
      }

      const data = responseText
        ? JSON.parse(responseText)
        : null;

      setProfile(data);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // LOAD PROFILE ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfile();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  async function handleChangePassword(event) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!currentPassword.trim()) {
      setErrorMessage(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword.trim()) {
      setErrorMessage(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/api/users/me/password`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            currentPassword:
              currentPassword,

            newPassword:
              newPassword,
          }),
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        throw new Error(
          responseText ||
            "Unable to change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccessMessage(
        "Password changed successfully."
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="profile-page">

        <div className="profile-loading">
          Loading profile...
        </div>

      </main>
    );
  }

  // ==========================================
  // PROFILE ERROR
  // ==========================================

  if (!profile) {
    return (
      <main className="profile-page">

        <div className="profile-error-card">

          <UserCircle size={42} />

          <h2>
            Unable to load profile
          </h2>

          <p>
            {errorMessage ||
              "Profile information could not be loaded."}
          </p>

          <button
            type="button"
            className="profile-refresh-button"
            onClick={loadProfile}
          >
            <RefreshCw size={16} />
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="profile-page">

      <div className="profile-container">

        {/* ======================================
            HEADER
            ====================================== */}

        <header className="profile-header">

          <div>

            <p className="profile-label">
              ACCOUNT
            </p>

            <h1>
              Profile
            </h1>

            <p className="profile-subtitle">
              View your account information and
              manage your password.
            </p>

          </div>

          <button
            type="button"
            className="profile-refresh-button"
            onClick={loadProfile}
            disabled={loading}
          >
            <RefreshCw size={16} />

            Refresh
          </button>

        </header>

        {/* ======================================
            MESSAGES
            ====================================== */}

        {successMessage && (
          <div className="profile-message success">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="profile-message error">
            {errorMessage}
          </div>
        )}

        {/* ======================================
            PROFILE GRID
            ====================================== */}

        <div className="profile-grid">

          {/* ====================================
              ACCOUNT INFORMATION
              ==================================== */}

          <section className="profile-card">

            <div className="profile-card-header">

              <div className="profile-card-icon">
                <UserCircle size={24} />
              </div>

              <div>

                <p>
                  ACCOUNT INFORMATION
                </p>

                <h2>
                  My Profile
                </h2>

              </div>

            </div>

            <div className="profile-information">

              {/* USERNAME */}

              <div className="profile-field">

                <span>
                  Username
                </span>

                <strong>
                  {profile.username}
                </strong>

              </div>

              {/* ROLE */}

              <div className="profile-field">

                <span>
                  Role
                </span>

                <div className="profile-role">

                  <ShieldCheck size={16} />

                  <strong>
                    {profile.role}
                  </strong>

                </div>

              </div>

              {/* ID */}

              <div className="profile-field">

                <span>
                  User ID
                </span>

                <strong>
                  {profile.id}
                </strong>

              </div>

            </div>

          </section>

          {/* ====================================
              PASSWORD
              ==================================== */}

          <section className="profile-card">

            <div className="profile-card-header">

              <div className="profile-card-icon">
                <LockKeyhole size={24} />
              </div>

              <div>

                <p>
                  SECURITY
                </p>

                <h2>
                  Change Password
                </h2>

              </div>

            </div>

            <form
              className="profile-password-form"
              onSubmit={
                handleChangePassword
              }
            >

              <div className="profile-form-group">

                <label htmlFor="current-password">
                  Current Password
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter current password"
                  disabled={saving}
                  autoComplete="current-password"
                  required
                />

              </div>

              <div className="profile-form-group">

                <label htmlFor="new-password">
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter new password"
                  disabled={saving}
                  autoComplete="new-password"
                  required
                />

                <small>
                  Minimum 6 characters.
                </small>

              </div>

              <div className="profile-form-group">

                <label htmlFor="confirm-password">
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  disabled={saving}
                  autoComplete="new-password"
                  required
                />

              </div>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                <LockKeyhole size={16} />

                {saving
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

            </form>

          </section>

        </div>

      </div>

    </main>
  );
}

export default Profile;