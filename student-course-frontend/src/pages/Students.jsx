import { useEffect, useState } from "react";
import "./Students.css";

import {
  RefreshCw,
  Users,
  Mail,
  Phone,
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

import API_BASE_URL from "../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Student selected for editing
  const [editingStudent, setEditingStudent] = useState(null);

  // Student currently being deleted
  const [deletingId, setDeletingId] = useState(null);

  // Add student form
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
        setError("");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/students`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load students.");
      }

      const data = await response.json();

      setStudents(data);
      setError("");
    } catch (error) {
      setError(
        error.message || "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD STUDENTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // SEARCH STUDENTS
  // ==========================================

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      String(student.id)
        .toLowerCase()
        .includes(search) ||
      String(student.name || "")
        .toLowerCase()
        .includes(search) ||
      String(student.email || "")
        .toLowerCase()
        .includes(search) ||
      String(student.phone || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // ==========================================
  // OPEN ADD STUDENT MODAL
  // ==========================================

  const openAddModal = () => {
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setFormMessage("");
    setShowAddModal(true);
  };

  // ==========================================
  // CLOSE ADD STUDENT MODAL
  // ==========================================

  const closeAddModal = () => {
    if (saving) {
      return;
    }

    setShowAddModal(false);
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setFormMessage("");
  };

  // ==========================================
  // ADD STUDENT
  // ==========================================

  const handleAddStudent = async (event) => {
    event.preventDefault();

    setFormMessage("");

    if (!studentName.trim()) {
      setFormMessage("Please enter the student name.");
      return;
    }

    if (!studentEmail.trim()) {
      setFormMessage("Please enter the student email.");
      return;
    }

    if (!studentPhone.trim()) {
      setFormMessage("Please enter the student phone.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/api/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: studentName.trim(),
            email: studentEmail.trim(),
            phone: studentPhone.trim(),
          }),
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        let errorMessage = "Unable to add student.";

        try {
          const errorData = JSON.parse(resultText);

          errorMessage =
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          if (resultText) {
            errorMessage = resultText;
          }
        }

        throw new Error(errorMessage);
      }

      setFormMessage(
        "Student added successfully!"
      );

      setStudentName("");
      setStudentEmail("");
      setStudentPhone("");

      await loadStudents(false);

      setTimeout(() => {
        setShowAddModal(false);
        setFormMessage("");
      }, 700);
    } catch (error) {
      setFormMessage(
        error.message || "Unable to add student."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UPDATE STUDENT
  // ==========================================

  const handleUpdateStudent = async () => {
    if (!editingStudent) {
      return;
    }

    if (!editingStudent.name?.trim()) {
      setFormMessage("Please enter the student name.");
      return;
    }

    if (!editingStudent.email?.trim()) {
      setFormMessage("Please enter the student email.");
      return;
    }

    if (!editingStudent.phone?.trim()) {
      setFormMessage("Please enter the student phone.");
      return;
    }

    try {
      setSaving(true);
      setFormMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/students/${editingStudent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: editingStudent.name.trim(),
            email: editingStudent.email.trim(),
            phone: editingStudent.phone.trim(),
          }),
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        let errorMessage = "Unable to update student.";

        try {
          const errorData = JSON.parse(resultText);

          errorMessage =
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          if (resultText) {
            errorMessage = resultText;
          }
        }

        throw new Error(errorMessage);
      }

      setFormMessage(
        "Student updated successfully!"
      );

      await loadStudents(false);

      setTimeout(() => {
        setEditingStudent(null);
        setFormMessage("");
      }, 700);
    } catch (error) {
      setFormMessage(
        error.message || "Unable to update student."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const handleDeleteStudent = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(student.id);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/students/${student.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const resultText = await response.text();

      // Handle backend errors properly
      if (!response.ok) {
        let errorMessage = "Unable to delete student.";

        try {
          const errorData = JSON.parse(resultText);

          errorMessage =
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          if (resultText) {
            errorMessage = resultText;
          }
        }

        throw new Error(errorMessage);
      }

      // Refresh student list after successful deletion
      await loadStudents(false);
    } catch (error) {
      setError(
        error.message || "Unable to delete student."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <p className="dashboard-label">
              MANAGEMENT
            </p>

            <h1>Students</h1>

            <p className="dashboard-subtitle">
              Manage registered students in the
              Student Course Registration System.
            </p>
          </div>

          <div className="student-header-actions">

            <button
              className="refresh-button"
              onClick={() => loadStudents(true)}
              disabled={loading}
            >
              <RefreshCw size={17} />

              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

            <button
              className="add-student-button"
              onClick={openAddModal}
            >
              <Plus size={18} />

              Add Student
            </button>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* STUDENT COUNT */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <Users size={22} />
            </div>

            <div>
              <p>Total Students</p>

              <h2>
                {loading
                  ? "—"
                  : students.length}
              </h2>
            </div>

          </div>

        </section>

        {/* STUDENT DIRECTORY */}

        <section className="dashboard-content">

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <p className="panel-label">
                  STUDENT DIRECTORY
                </p>

                <h2>All Students</h2>
              </div>

            </div>

            {/* SEARCH */}

            <div className="student-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search by name, email, phone or ID..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="clear-search"
                >
                  ×
                </button>
              )}

            </div>

            {/* STUDENT LIST */}

            {loading ? (

              <div className="empty-state">
                Loading students...
              </div>

            ) : filteredStudents.length === 0 ? (

              <div className="empty-state">
                No students found.
              </div>

            ) : (

              <div className="student-list">

                {filteredStudents.map(
                  (student) => (

                    <div
                      className="student-item"
                      key={student.id}
                    >

                      {/* STUDENT ICON */}

                      <div className="registration-icon">
                        <Users size={19} />
                      </div>

                      {/* STUDENT INFORMATION */}

                      <div className="registration-info">

                        <h3>
                          {student.name}
                        </h3>

                        <p>
                          Student ID: {student.id}
                        </p>

                      </div>

                      {/* EMAIL */}

                      <div className="student-contact">

                        <Mail size={17} />

                        <span>
                          {student.email}
                        </span>

                      </div>

                      {/* PHONE */}

                      <div className="student-contact">

                        <Phone size={17} />

                        <span>
                          {student.phone}
                        </span>

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="student-actions">

                        {/* EDIT */}

                        <button
                          type="button"
                          className="student-edit-button"
                          onClick={() => {
                            setFormMessage("");

                            setEditingStudent({
                              ...student,
                            });
                          }}
                          disabled={
                            deletingId === student.id
                          }
                        >
                          <Pencil size={15} />

                          Edit
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="student-delete-button"
                          onClick={() =>
                            handleDeleteStudent(
                              student
                            )
                          }
                          disabled={
                            deletingId === student.id
                          }
                        >
                          <Trash2 size={15} />

                          {deletingId === student.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

      </div>

      {/* =================================
          ADD STUDENT MODAL
          ================================= */}

      {showAddModal && (

        <div className="student-modal-overlay">

          <div className="student-modal">

            <div className="student-modal-header">

              <div>

                <p className="dashboard-label">
                  STUDENT MANAGEMENT
                </p>

                <h2>
                  Add Student
                </h2>

              </div>

              <button
                type="button"
                className="student-modal-close"
                onClick={closeAddModal}
                disabled={saving}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="student-form"
              onSubmit={handleAddStudent}
            >

              {/* NAME */}

              <div className="student-form-group">

                <label htmlFor="student-name">
                  Student Name
                </label>

                <input
                  id="student-name"
                  type="text"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(event) =>
                    setStudentName(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="student-form-group">

                <label htmlFor="student-email">
                  Email
                </label>

                <input
                  id="student-email"
                  type="email"
                  placeholder="Enter email address"
                  value={studentEmail}
                  onChange={(event) =>
                    setStudentEmail(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* PHONE */}

              <div className="student-form-group">

                <label htmlFor="student-phone">
                  Phone
                </label>

                <input
                  id="student-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={studentPhone}
                  onChange={(event) =>
                    setStudentPhone(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* FORM MESSAGE */}

              {formMessage && (

                <div
                  className={`student-form-message ${
                    formMessage.includes(
                      "successfully"
                    )
                      ? "success"
                      : "error"
                  }`}
                >
                  {formMessage}
                </div>

              )}

              {/* BUTTONS */}

              <div className="student-form-actions">

                <button
                  type="button"
                  className="student-cancel-button"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="student-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Student"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================
          EDIT STUDENT MODAL
          ================================= */}

      {editingStudent && (

        <div className="student-modal-overlay">

          <div className="student-modal">

            <div className="student-modal-header">

              <div>

                <p className="dashboard-label">
                  STUDENT MANAGEMENT
                </p>

                <h2>
                  Edit Student
                </h2>

              </div>

              <button
                type="button"
                className="student-modal-close"
                onClick={() => {
                  if (!saving) {
                    setEditingStudent(null);
                    setFormMessage("");
                  }
                }}
                disabled={saving}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            <div className="student-form">

              {/* STUDENT ID */}

              <div className="student-form-group">

                <label htmlFor="edit-student-id">
                  Student ID
                </label>

                <input
                  id="edit-student-id"
                  type="text"
                  value={editingStudent.id}
                  disabled
                />

              </div>

              {/* NAME */}

              <div className="student-form-group">

                <label htmlFor="edit-student-name">
                  Student Name
                </label>

                <input
                  id="edit-student-name"
                  type="text"
                  value={
                    editingStudent.name || ""
                  }
                  onChange={(event) =>
                    setEditingStudent({
                      ...editingStudent,
                      name: event.target.value,
                    })
                  }
                  disabled={saving}
                />

              </div>

              {/* EMAIL */}

              <div className="student-form-group">

                <label htmlFor="edit-student-email">
                  Email
                </label>

                <input
                  id="edit-student-email"
                  type="email"
                  value={
                    editingStudent.email || ""
                  }
                  onChange={(event) =>
                    setEditingStudent({
                      ...editingStudent,
                      email:
                        event.target.value,
                    })
                  }
                  disabled={saving}
                />

              </div>

              {/* PHONE */}

              <div className="student-form-group">

                <label htmlFor="edit-student-phone">
                  Phone
                </label>

                <input
                  id="edit-student-phone"
                  type="tel"
                  value={
                    editingStudent.phone || ""
                  }
                  onChange={(event) =>
                    setEditingStudent({
                      ...editingStudent,
                      phone:
                        event.target.value,
                    })
                  }
                  disabled={saving}
                />

              </div>

              {/* FORM MESSAGE */}

              {formMessage && (

                <div
                  className={`student-form-message ${
                    formMessage.includes(
                      "successfully"
                    )
                      ? "success"
                      : "error"
                  }`}
                >
                  {formMessage}
                </div>

              )}

              {/* BUTTONS */}

              <div className="student-form-actions">

                <button
                  type="button"
                  className="student-cancel-button"
                  onClick={() => {
                    if (!saving) {
                      setEditingStudent(null);
                      setFormMessage("");
                    }
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="student-save-button"
                  onClick={handleUpdateStudent}
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Update Student"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Students;