import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Reports.css";

function Reports() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadReportData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [
        studentsResponse,
        coursesResponse,
        facultyResponse,
        registrationsResponse,
      ] = await Promise.all([
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

      if (!studentsResponse.ok) {
        throw new Error("Failed to load student report data.");
      }

      if (!coursesResponse.ok) {
        throw new Error("Failed to load course report data.");
      }

      if (!facultyResponse.ok) {
        throw new Error("Failed to load faculty report data.");
      }

      if (!registrationsResponse.ok) {
        throw new Error(
          "Failed to load registration report data."
        );
      }

      const studentData = await studentsResponse.json();
      const courseData = await coursesResponse.json();
      const facultyData = await facultyResponse.json();
      const registrationData =
        await registrationsResponse.json();

      setStudents(studentData);
      setCourses(courseData);
      setFaculty(facultyData);
      setRegistrations(registrationData);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to load report data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReportData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const activeRegistrations = registrations.filter(
    (registration) =>
      registration.status === "ACTIVE"
  );

  const cancelledRegistrations = registrations.filter(
    (registration) =>
      registration.status === "CANCELLED"
  );

  const totalCapacity = courses.reduce(
    (total, course) =>
      total + Number(course.capacity || 0),
    0
  );

  const totalAvailableSeats = courses.reduce(
    (total, course) =>
      total + Number(course.availableSeats || 0),
    0
  );

  const occupiedSeats =
    totalCapacity - totalAvailableSeats;

  const utilizationPercentage =
    totalCapacity > 0
      ? Math.round(
          (occupiedSeats / totalCapacity) * 100
        )
      : 0;

  const getFacultyCourseCount = (facultyId) => {
    return courses.filter(
      (course) =>
        Number(course.faculty?.id) ===
        Number(facultyId)
    ).length;
  };

  const getCourseRegistrationCount = (courseId) => {
    return activeRegistrations.filter(
      (registration) =>
        Number(registration.course?.id) ===
        Number(courseId)
    ).length;
  };

  return (
    <main className="reports-page">

      <div className="reports-container">

        {/* ======================================
            HEADER
            ====================================== */}

        <header className="reports-header">

          <div>
            <p className="reports-label">
              ANALYTICS & REPORTS
            </p>

            <h1>Reports</h1>

            <p className="reports-subtitle">
              Monitor students, courses, faculty,
              registrations and seat utilization.
            </p>
          </div>

          <button
            type="button"
            className="reports-refresh-button"
            onClick={loadReportData}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Refresh Reports"}
          </button>

        </header>

        {/* ======================================
            ERROR
            ====================================== */}

        {errorMessage && (
          <div className="reports-error">
            {errorMessage}
          </div>
        )}

        {/* ======================================
            SUMMARY CARDS
            ====================================== */}

        <section className="reports-summary-grid">

          <div className="reports-summary-card">
            <span>Total Students</span>

            <strong>
              {loading ? "—" : students.length}
            </strong>
          </div>

          <div className="reports-summary-card">
            <span>Total Courses</span>

            <strong>
              {loading ? "—" : courses.length}
            </strong>
          </div>

          <div className="reports-summary-card">
            <span>Total Faculty</span>

            <strong>
              {loading ? "—" : faculty.length}
            </strong>
          </div>

          <div className="reports-summary-card">
            <span>Total Registrations</span>

            <strong>
              {loading
                ? "—"
                : registrations.length}
            </strong>
          </div>

        </section>

        {/* ======================================
            REGISTRATION SUMMARY
            ====================================== */}

        <section className="reports-grid">

          <div className="reports-panel">

            <div className="reports-panel-header">
              <div>
                <p className="reports-panel-label">
                  REGISTRATION STATUS
                </p>

                <h2>
                  Registration Overview
                </h2>
              </div>
            </div>

            <div className="registration-overview">

              <div className="registration-stat">
                <span>Active</span>

                <strong>
                  {activeRegistrations.length}
                </strong>
              </div>

              <div className="registration-stat">
                <span>Cancelled</span>

                <strong>
                  {cancelledRegistrations.length}
                </strong>
              </div>

            </div>

          </div>

          {/* ====================================
              SEAT UTILIZATION
              ==================================== */}

          <div className="reports-panel">

            <div className="reports-panel-header">

              <div>
                <p className="reports-panel-label">
                  COURSE CAPACITY
                </p>

                <h2>
                  Seat Utilization
                </h2>
              </div>

            </div>

            <div className="utilization-content">

              <div className="utilization-number">
                {utilizationPercentage}%
              </div>

              <div className="utilization-text">
                <span>
                  {occupiedSeats} occupied
                </span>

                <span>
                  {totalAvailableSeats} available
                </span>

                <span>
                  {totalCapacity} total
                </span>
              </div>

            </div>

            <div className="utilization-bar">

              <div
                className="utilization-progress"
                style={{
                  width: `${utilizationPercentage}%`,
                }}
              />

            </div>

          </div>

        </section>

        {/* ======================================
            COURSE REPORT
            ====================================== */}

        <section className="reports-panel">

          <div className="reports-panel-header">

            <div>
              <p className="reports-panel-label">
                COURSE REPORT
              </p>

              <h2>
                Course Registration Overview
              </h2>
            </div>

          </div>

          {courses.length === 0 ? (

            <div className="reports-empty">
              No courses available.
            </div>

          ) : (

            <div className="course-report-list">

              {courses.map((course) => {

                const registrationCount =
                  getCourseRegistrationCount(
                    course.id
                  );

                const capacity =
                  Number(course.capacity || 0);

                const percentage =
                  capacity > 0
                    ? Math.round(
                        (registrationCount /
                          capacity) *
                          100
                      )
                    : 0;

                return (
                  <div
                    className="course-report-row"
                    key={course.id}
                  >

                    <div className="course-report-info">

                      <div>
                        <strong>
                          {course.courseName}
                        </strong>

                        <span>
                          {course.courseCode}
                        </span>
                      </div>

                      <small>
                        {registrationCount} active
                        registrations /{" "}
                        {capacity} seats
                      </small>

                    </div>

                    <div className="course-report-bar">

                      <div
                        className="course-report-progress"
                        style={{
                          width: `${Math.min(
                            percentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    <strong className="course-report-percent">
                      {percentage}%
                    </strong>

                  </div>
                );
              })}

            </div>

          )}

        </section>

        {/* ======================================
            FACULTY REPORT
            ====================================== */}

        <section className="reports-panel">

          <div className="reports-panel-header">

            <div>
              <p className="reports-panel-label">
                FACULTY REPORT
              </p>

              <h2>
                Faculty Course Assignment
              </h2>
            </div>

          </div>

          {faculty.length === 0 ? (

            <div className="reports-empty">
              No faculty available.
            </div>

          ) : (

            <div className="faculty-report-grid">

              {faculty.map((facultyMember) => {

                const courseCount =
                  getFacultyCourseCount(
                    facultyMember.id
                  );

                return (
                  <div
                    className="faculty-report-card"
                    key={facultyMember.id}
                  >

                    <div>

                      <strong>
                        {facultyMember.name}
                      </strong>

                      <span>
                        {facultyMember.department ||
                          "Department not assigned"}
                      </span>

                    </div>

                    <div className="faculty-course-count">

                      <strong>
                        {courseCount}
                      </strong>

                      <span>
                        {courseCount === 1
                          ? "Course"
                          : "Courses"}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default Reports;