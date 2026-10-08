import { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Registrations.css";

function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedRegistration, setSelectedRegistration] =
    useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    registrationDate: new Date()
      .toISOString()
      .split("T")[0],
    status: "ACTIVE",
  });

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // ==========================================
  // LOAD ALL DATA
  // ==========================================

  async function loadAllData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [
        registrationResponse,
        studentResponse,
        courseResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/registrations`,
          {
            credentials: "include",
          }
        ),
        fetch(
          `${API_BASE_URL}/api/students`,
          {
            credentials: "include",
          }
        ),
        fetch(
          `${API_BASE_URL}/api/courses`,
          {
            credentials: "include",
          }
        ),
      ]);

      if (!registrationResponse.ok) {
        throw new Error(
          "Failed to load registrations."
        );
      }

      if (!studentResponse.ok) {
        throw new Error(
          "Failed to load students."
        );
      }

      if (!courseResponse.ok) {
        throw new Error(
          "Failed to load courses."
        );
      }

      const registrationData =
        await registrationResponse.json();

      const studentData =
        await studentResponse.json();

      const courseData =
        await courseResponse.json();

      setRegistrations(registrationData);
      setStudents(studentData);
      setCourses(courseData);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load registration data."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // LOAD DATA WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAllData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // GET STUDENT NAME
  // ==========================================

  const getStudentName = (studentId) => {
    const student = students.find(
      (item) =>
        Number(item.id) === Number(studentId)
    );

    if (!student) {
      return `Student #${studentId}`;
    }

    return (
      student.studentName ||
      student.name ||
      student.fullName ||
      `Student #${student.id}`
    );
  };

  // ==========================================
  // GET COURSE NAME
  // ==========================================

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) =>
        Number(item.id) === Number(courseId)
    );

    if (!course) {
      return `Course #${courseId}`;
    }

    return (
      course.courseName ||
      course.name ||
      `Course #${course.id}`
    );
  };

  // ==========================================
  // FILTER REGISTRATIONS
  // ==========================================

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(
      (registration) => {
        const studentId =
          registration.student?.id;

        const courseId =
          registration.course?.id;

        const studentName =
          getStudentName(studentId).toLowerCase();

        const courseName =
          getCourseName(courseId).toLowerCase();

        const searchText =
          search.toLowerCase().trim();

        const matchesSearch =
          searchText === "" ||
          studentName.includes(searchText) ||
          courseName.includes(searchText) ||
          String(studentId).includes(searchText) ||
          String(courseId).includes(searchText);

        const matchesStatus =
          statusFilter === "ALL" ||
          registration.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    registrations,
    students,
    courses,
    search,
    statusFilter,
  ]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      studentId: "",
      courseId: "",
      registrationDate: new Date()
        .toISOString()
        .split("T")[0],
      status: "ACTIVE",
    });
  };

  // ==========================================
  // OPEN ADD REGISTRATION
  // ==========================================

  const handleAddRegistration = () => {
    setSuccessMessage("");
    setErrorMessage("");

    resetForm();

    setShowAddModal(true);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE REGISTRATION
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.studentId) {
      setErrorMessage(
        "Please select a student."
      );
      return;
    }

    if (!formData.courseId) {
      setErrorMessage(
        "Please select a course."
      );
      return;
    }

    if (!formData.registrationDate) {
      setErrorMessage(
        "Please select registration date."
      );
      return;
    }

    try {
      setSaving(true);

      const requestBody = {
        student: {
          id: Number(formData.studentId),
        },

        course: {
          id: Number(formData.courseId),
        },

        registrationDate:
          formData.registrationDate,

        status: formData.status,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/registrations`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(requestBody),
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        throw new Error(
          responseText ||
            "Failed to create registration."
        );
      }

      setShowAddModal(false);

      resetForm();

      setSuccessMessage(
        "Student registered for the course successfully."
      );

      await loadAllData();
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to create registration."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN CANCEL MODAL
  // ==========================================

  const openCancelModal = (
    registration
  ) => {
    setSelectedRegistration(
      registration
    );

    setSuccessMessage("");
    setErrorMessage("");

    setShowCancelModal(true);
  };

  // ==========================================
  // CLOSE CANCEL MODAL
  // ==========================================

  const closeCancelModal = () => {
    if (saving) {
      return;
    }

    setShowCancelModal(false);
    setSelectedRegistration(null);
  };

  // ==========================================
  // CANCEL REGISTRATION
  // ==========================================

  const handleCancelRegistration =
    async () => {
      if (!selectedRegistration) {
        return;
      }

      try {
        setSaving(true);

        setSuccessMessage("");
        setErrorMessage("");

        const response = await fetch(
          `${API_BASE_URL}/api/registrations/${selectedRegistration.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              registrationDate:
                selectedRegistration.registrationDate,

              status: "CANCELLED",
            }),
          }
        );

        const responseText =
          await response.text();

        if (!response.ok) {
          throw new Error(
            responseText ||
              "Failed to cancel registration."
          );
        }

        setShowCancelModal(false);

        setSelectedRegistration(null);

        setSuccessMessage(
          "Registration cancelled successfully."
        );

        await loadAllData();
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to cancel registration."
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================
  // COUNTS
  // ==========================================

  const activeCount =
    registrations.filter(
      (registration) =>
        registration.status === "ACTIVE"
    ).length;

  const cancelledCount =
    registrations.filter(
      (registration) =>
        registration.status === "CANCELLED"
    ).length;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="registrations-page">

      {/* ======================================
          HEADER
          ====================================== */}

      <div className="page-header">

        <div>

          <p className="page-label">
            COURSE MANAGEMENT
          </p>

          <h1>
            Registrations
          </h1>

          <p className="page-description">
            Register students for courses
            and manage registrations.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddRegistration}
        >
          + Register Student
        </button>

      </div>

      {/* ======================================
          SUCCESS
          ====================================== */}

      {successMessage && (
        <div className="message success-message">
          {successMessage}
        </div>
      )}

      {/* ======================================
          ERROR
          ====================================== */}

      {errorMessage && (
        <div className="message error-message">
          {errorMessage}
        </div>
      )}

      {/* ======================================
          SUMMARY
          ====================================== */}

      <div className="registration-summary">

        <div className="summary-card">

          <span>
            Total Registrations
          </span>

          <strong>
            {registrations.length}
          </strong>

        </div>

        <div className="summary-card">

          <span>
            Active
          </span>

          <strong>
            {activeCount}
          </strong>

        </div>

        <div className="summary-card">

          <span>
            Cancelled
          </span>

          <strong>
            {cancelledCount}
          </strong>

        </div>

      </div>

      {/* ======================================
          TOOLBAR
          ====================================== */}

      <div className="registration-toolbar">

        <input
          type="text"
          placeholder="Search student or course..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>

        </select>

        <button
          type="button"
          className="secondary-button"
          onClick={loadAllData}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Refresh"}
        </button>

      </div>

      {/* ======================================
          REGISTRATION TABLE
          ====================================== */}

      <div className="registration-table-container">

        {loading ? (

          <div className="empty-state">
            Loading registrations...
          </div>

        ) : filteredRegistrations.length === 0 ? (

          <div className="empty-state">
            No registrations found.
          </div>

        ) : (

          <table className="registration-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Student
                </th>

                <th>
                  Course
                </th>

                <th>
                  Registration Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRegistrations.map(
                (registration) => {

                  const studentId =
                    registration.student?.id;

                  const courseId =
                    registration.course?.id;

                  return (

                    <tr
                      key={registration.id}
                    >

                      <td>
                        {registration.id}
                      </td>

                      <td>

                        <div className="main-text">
                          {getStudentName(
                            studentId
                          )}
                        </div>

                        <div className="sub-text">
                          ID: {studentId}
                        </div>

                      </td>

                      <td>

                        <div className="main-text">
                          {getCourseName(
                            courseId
                          )}
                        </div>

                        <div className="sub-text">
                          ID: {courseId}
                        </div>

                      </td>

                      <td>
                        {registration.registrationDate ||
                          "-"}
                      </td>

                      <td>

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

                      </td>

                      <td>

                        {registration.status ===
                        "ACTIVE" ? (

                          <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                              openCancelModal(
                                registration
                              )
                            }
                          >
                            Cancel
                          </button>

                        ) : (

                          <span className="disabled-action">
                            Cancelled
                          </span>

                        )}

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        )}

      </div>

      {/* ======================================
          ADD REGISTRATION MODAL
          ====================================== */}

      {showAddModal && (

        <div className="modal-overlay">

          <div className="registration-modal">

            <div className="modal-header">

              <div>

                <p className="page-label">
                  NEW REGISTRATION
                </p>

                <h2>
                  Register Student
                </h2>

              </div>

              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setShowAddModal(false)
                }
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
            >

              {/* STUDENT */}

              <div className="form-group">

                <label htmlFor="registration-student">
                  Student
                </label>

                <select
                  id="registration-student"
                  name="studentId"
                  value={
                    formData.studentId
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={saving}
                  required
                >

                  <option value="">
                    Select Student
                  </option>

                  {students.map(
                    (student) => (

                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.studentName ||
                          student.name ||
                          student.fullName ||
                          `Student #${student.id}`}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* COURSE */}

              <div className="form-group">

                <label htmlFor="registration-course">
                  Course
                </label>

                <select
                  id="registration-course"
                  name="courseId"
                  value={
                    formData.courseId
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={saving}
                  required
                >

                  <option value="">
                    Select Course
                  </option>

                  {courses.map(
                    (course) => (

                      <option
                        key={course.id}
                        value={course.id}
                      >

                        {course.courseName ||
                          course.name ||
                          `Course #${course.id}`}

                        {course.courseCode
                          ? ` (${course.courseCode})`
                          : ""}

                      </option>

                    )
                  )}

                </select>

              </div>

              {/* DATE */}

              <div className="form-group">

                <label htmlFor="registration-date">
                  Registration Date
                </label>

                <input
                  id="registration-date"
                  type="date"
                  name="registrationDate"
                  value={
                    formData.registrationDate
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label htmlFor="registration-status">
                  Status
                </label>

                <select
                  id="registration-status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={saving}
                  required
                >

                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="CANCELLED">
                    CANCELLED
                  </option>

                </select>

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Registering..."
                    : "Register Student"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ======================================
          CANCEL REGISTRATION MODAL
          ====================================== */}

      {showCancelModal &&
        selectedRegistration && (

          <div className="modal-overlay">

            <div className="registration-modal small-modal">

              <div className="modal-header">

                <div>

                  <p className="page-label">
                    CONFIRM ACTION
                  </p>

                  <h2>
                    Cancel Registration
                  </h2>

                </div>

                <button
                  type="button"
                  className="close-button"
                  onClick={closeCancelModal}
                  disabled={saving}
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

              <p className="confirmation-text">
                Are you sure you want to
                cancel this registration?
              </p>

              <div className="confirmation-details">

                <p>

                  <strong>
                    Student:
                  </strong>{" "}

                  {getStudentName(
                    selectedRegistration
                      .student?.id
                  )}

                </p>

                <p>

                  <strong>
                    Course:
                  </strong>{" "}

                  {getCourseName(
                    selectedRegistration
                      .course?.id
                  )}

                </p>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeCancelModal}
                  disabled={saving}
                >
                  Keep Active
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={
                    handleCancelRegistration
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Cancelling..."
                    : "Yes, Cancel"}
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default Registrations;