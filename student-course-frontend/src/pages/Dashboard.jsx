import { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  BookOpen,
  GraduationCap,
  Users,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

import API_BASE_URL from "../services/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);

      const responses = await Promise.all([
        fetch(`${API_BASE_URL}/api/students`, {
          credentials: "include",
        }),

        fetch(`${API_BASE_URL}/api/courses`, {
          credentials: "include",
        }),

        fetch(`${API_BASE_URL}/api/faculty`, {
          credentials: "include",
        }),

        fetch(`${API_BASE_URL}/api/registrations`, {
          credentials: "include",
        }),
      ]);

      const [
        studentsResponse,
        coursesResponse,
        facultyResponse,
        registrationsResponse,
      ] = responses;

      if (
        !studentsResponse.ok ||
        !coursesResponse.ok ||
        !facultyResponse.ok ||
        !registrationsResponse.ok
      ) {
        throw new Error(
          "Unable to load dashboard data."
        );
      }

      const studentsData =
        await studentsResponse.json();

      const coursesData =
        await coursesResponse.json();

      const facultyData =
        await facultyResponse.json();

      const registrationsData =
        await registrationsResponse.json();

      setStudents(studentsData);
      setCourses(coursesData);
      setFaculty(facultyData);
      setRegistrations(registrationsData);

      setError("");
    } catch (error) {
      setError(
        error.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const responses = await Promise.all([
          fetch(`${API_BASE_URL}/api/students`, {
            credentials: "include",
          }),

          fetch(`${API_BASE_URL}/api/courses`, {
            credentials: "include",
          }),

          fetch(`${API_BASE_URL}/api/faculty`, {
            credentials: "include",
          }),

          fetch(`${API_BASE_URL}/api/registrations`, {
            credentials: "include",
          }),
        ]);

        if (
          !responses[0].ok ||
          !responses[1].ok ||
          !responses[2].ok ||
          !responses[3].ok
        ) {
          throw new Error(
            "Unable to load dashboard data."
          );
        }

        const studentsData =
          await responses[0].json();

        const coursesData =
          await responses[1].json();

        const facultyData =
          await responses[2].json();

        const registrationsData =
          await responses[3].json();

        if (cancelled) {
          return;
        }

        setStudents(studentsData);
        setCourses(coursesData);
        setFaculty(facultyData);
        setRegistrations(registrationsData);
        setError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error.message ||
            "Unable to load dashboard data."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeRegistrations =
    registrations.filter(
      (registration) =>
        registration.status === "ACTIVE"
    );

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
    },
    {
      title: "Total Courses",
      value: courses.length,
      icon: BookOpen,
    },
    {
      title: "Total Faculty",
      value: faculty.length,
      icon: GraduationCap,
    },
    {
      title: "Active Registrations",
      value: activeRegistrations.length,
      icon: ClipboardList,
    },
  ];

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">
              OVERVIEW
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Welcome to your Student Course
              Registration Management System.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RefreshCw size={17} />

            {loading
              ? "Loading..."
              : "Refresh"}
          </button>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="stat-card"
                key={stat.title}
              >
                <div className="stat-icon">
                  <Icon size={22} />
                </div>

                <div>
                  <p>{stat.title}</p>

                  <h2>
                    {loading
                      ? "—"
                      : stat.value}
                  </h2>
                </div>
              </div>
            );
          })}
        </section>

        <section className="dashboard-content">
          <div className="dashboard-panel">

            <div className="panel-header">
              <div>
                <p className="panel-label">
                  RECENT ACTIVITY
                </p>

                <h2>
                  Latest Registrations
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                Loading registrations...
              </div>
            ) : registrations.length === 0 ? (
              <div className="empty-state">
                No registrations found.
              </div>
            ) : (
              <div className="registration-list">

                {registrations
                  .slice(0, 5)
                  .map((registration) => (
                    <div
                      className="registration-item"
                      key={registration.id}
                    >

                      <div className="registration-icon">
                        <ClipboardList size={18} />
                      </div>

                      <div className="registration-info">

                        <h3>
                          {registration.student?.name ||
                            "Unknown Student"}
                        </h3>

                        <p>
                          {registration.course?.courseCode ||
                            "Course"}

                          {" · "}

                          {registration.course?.courseName ||
                            "Unknown Course"}
                        </p>

                      </div>

                      <span
                        className={`status-badge ${
                          registration.status ===
                          "ACTIVE"
                            ? "active"
                            : "cancelled"
                        }`}
                      >
                        {registration.status}
                      </span>

                    </div>
                  ))}

              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}

export default Dashboard;