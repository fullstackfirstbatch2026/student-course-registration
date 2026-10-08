import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Faculty from "./pages/Faculty";
import Registrations from "./pages/Registrations";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";

import API_BASE_URL from "./services/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================
  // LOGIN SUCCESS
  // ==========================================

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActivePage("Dashboard");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await fetch(
        `${API_BASE_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    setIsLoggedIn(false);
    setActivePage("Dashboard");
    setSidebarOpen(false);
  };

  // ==========================================
  // LOGIN PAGE
  // ==========================================

  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={
          handleLoginSuccess
        }
      />
    );
  }

  // ==========================================
  // MAIN APPLICATION
  // ==========================================

  return (
    <div className="app-layout">

      {/* ======================================
          SIDEBAR
          ====================================== */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* ======================================
          MAIN CONTENT
          ====================================== */}

      <div className="app-main">

        {/* MOBILE MENU BUTTON */}

        <button
          className="mobile-menu-button"
          onClick={() =>
            setSidebarOpen(true)
          }
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* ====================================
            DASHBOARD
            ==================================== */}

        {activePage === "Dashboard" && (
          <Dashboard />
        )}

        {/* ====================================
            STUDENTS
            ==================================== */}

        {activePage === "Students" && (
          <Students />
        )}

        {/* ====================================
            COURSES
            ==================================== */}

        {activePage === "Courses" && (
          <Courses />
        )}

        {/* ====================================
            FACULTY
            ==================================== */}

        {activePage === "Faculty" && (
          <Faculty />
        )}

        {/* ====================================
            REGISTRATIONS
            ==================================== */}

        {activePage === "Registrations" && (
          <Registrations />
        )}

        {/* ====================================
            REPORTS
            ==================================== */}

        {activePage === "Reports" && (
          <Reports />
        )}

        {/* ====================================
            PROFILE
            ==================================== */}

        {activePage === "Profile" && (
          <Profile />
        )}

        {/* ====================================
            COMING SOON PAGES
            ==================================== */}

        {activePage !== "Dashboard" &&
          activePage !== "Students" &&
          activePage !== "Courses" &&
          activePage !== "Faculty" &&
          activePage !== "Registrations" &&
          activePage !== "Reports" &&
          activePage !== "Profile" && (

            <div className="coming-soon-page">

              <div className="coming-soon-card">

                <div className="coming-soon-icon">
                  🚧
                </div>

                <p className="dashboard-label">
                  COMING SOON
                </p>

                <h1>
                  {activePage}
                </h1>

                <p>
                  This section will be added in
                  the next step.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setActivePage(
                      "Dashboard"
                    )
                  }
                >
                  Back to Dashboard
                </button>

              </div>

            </div>

          )}

      </div>

    </div>
  );
}

export default App;