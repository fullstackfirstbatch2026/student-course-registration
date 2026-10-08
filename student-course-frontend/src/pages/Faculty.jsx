import { useEffect, useState } from "react";

import {
  Users,
  Mail,
  Building2,
  RefreshCw,
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import API_BASE_URL from "../services/api";
import "./Faculty.css";

function Faculty() {
  // ==========================================
  // FACULTY DATA
  // ==========================================

  const [faculty, setFaculty] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // ADD FACULTY MODAL
  // ==========================================

  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // ==========================================
  // EDIT FACULTY MODAL
  // ==========================================

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState(null);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  // ==========================================
  // DELETE FACULTY MODAL
  // ==========================================

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFaculty, setDeletingFaculty] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // LOAD FACULTY
  // ==========================================

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/faculty`,
        {
          credentials: "include",
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          resultText || "Unable to load faculty."
        );
      }

      const data = resultText
        ? JSON.parse(resultText)
        : [];

      setFaculty(data);
    } catch (error) {
      setError(
        error.message || "Unable to load faculty."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD FACULTY WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFaculty();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // SEARCH FACULTY
  // ==========================================

  const filteredFaculty = faculty.filter(
    (facultyMember) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      if (!search) {
        return true;
      }

      return (
        String(facultyMember.id || "")
          .toLowerCase()
          .includes(search) ||

        String(facultyMember.name || "")
          .toLowerCase()
          .includes(search) ||

        String(facultyMember.email || "")
          .toLowerCase()
          .includes(search) ||

        String(facultyMember.department || "")
          .toLowerCase()
          .includes(search)
      );
    }
  );

  // ==========================================
  // CLEAR ADD FORM
  // ==========================================

  const clearAddForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setFormMessage("");
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    clearAddForm();
    setShowAddModal(true);
  };

  // ==========================================
  // CLOSE ADD MODAL
  // ==========================================

  const closeAddModal = () => {
    if (saving) {
      return;
    }

    setShowAddModal(false);
    clearAddForm();
  };

  // ==========================================
  // ADD FACULTY
  // ==========================================

  const handleAddFaculty = async (event) => {
    event.preventDefault();

    setFormMessage("");
    setError("");
    setSuccessMessage("");

    // Name validation
    if (!name.trim()) {
      setFormMessage(
        "Please enter the faculty name."
      );
      return;
    }

    // Email validation
    if (!email.trim()) {
      setFormMessage(
        "Please enter the faculty email."
      );
      return;
    }

    if (!email.includes("@")) {
      setFormMessage(
        "Please enter a valid email address."
      );
      return;
    }

    // Department validation
    if (!department.trim()) {
      setFormMessage(
        "Please enter the department."
      );
      return;
    }

    try {
      setSaving(true);

      const facultyData = {
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/faculty`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(facultyData),
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          resultText || "Unable to add faculty."
        );
      }

      await loadFaculty();

      setFormMessage(
        "Faculty added successfully!"
      );

      setTimeout(() => {
        setShowAddModal(false);
        clearAddForm();

        setSuccessMessage(
          "Faculty added successfully!"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }, 700);
    } catch (error) {
      setFormMessage(
        error.message || "Unable to add faculty."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (facultyMember) => {
    setEditingFacultyId(facultyMember.id);

    setEditName(
      facultyMember.name || ""
    );

    setEditEmail(
      facultyMember.email || ""
    );

    setEditDepartment(
      facultyMember.department || ""
    );

    setEditMessage("");
    setShowEditModal(true);
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const closeEditModal = () => {
    if (editing) {
      return;
    }

    setShowEditModal(false);
    setEditingFacultyId(null);

    setEditName("");
    setEditEmail("");
    setEditDepartment("");
    setEditMessage("");
  };

  // ==========================================
  // UPDATE FACULTY
  // ==========================================

  const handleEditFaculty = async (event) => {
    event.preventDefault();

    setEditMessage("");
    setError("");
    setSuccessMessage("");

    // Name validation
    if (!editName.trim()) {
      setEditMessage(
        "Please enter the faculty name."
      );
      return;
    }

    // Email validation
    if (!editEmail.trim()) {
      setEditMessage(
        "Please enter the faculty email."
      );
      return;
    }

    if (!editEmail.includes("@")) {
      setEditMessage(
        "Please enter a valid email address."
      );
      return;
    }

    // Department validation
    if (!editDepartment.trim()) {
      setEditMessage(
        "Please enter the department."
      );
      return;
    }

    try {
      setEditing(true);

      const facultyData = {
        name: editName.trim(),
        email: editEmail.trim(),
        department: editDepartment.trim(),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/faculty/${editingFacultyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(facultyData),
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          resultText ||
            "Unable to update faculty."
        );
      }

      await loadFaculty();

      setEditMessage(
        "Faculty updated successfully!"
      );

      setTimeout(() => {
        setShowEditModal(false);
        setEditingFacultyId(null);

        setEditName("");
        setEditEmail("");
        setEditDepartment("");
        setEditMessage("");

        setSuccessMessage(
          "Faculty updated successfully!"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }, 700);
    } catch (error) {
      setEditMessage(
        error.message ||
          "Unable to update faculty."
      );
    } finally {
      setEditing(false);
    }
  };

  // ==========================================
  // OPEN DELETE MODAL
  // ==========================================

  const openDeleteModal = (facultyMember) => {
    setDeletingFaculty(facultyMember);
    setDeleteMessage("");
    setShowDeleteModal(true);
  };

  // ==========================================
  // CLOSE DELETE MODAL
  // ==========================================

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
    setDeletingFaculty(null);
    setDeleteMessage("");
  };

  // ==========================================
  // DELETE FACULTY
  // ==========================================

  const handleDeleteFaculty = async () => {
    if (!deletingFaculty) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteMessage("");
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/faculty/${deletingFaculty.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          resultText ||
            "Unable to delete faculty."
        );
      }

      await loadFaculty();

      setShowDeleteModal(false);

      const deletedName =
        deletingFaculty.name;

      setDeletingFaculty(null);

      setSuccessMessage(
        `Faculty "${deletedName}" deleted successfully!`
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setDeleteMessage(
        error.message ||
          "Unable to delete faculty."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        {/* ======================================
            HEADER
            ====================================== */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-label">
              MANAGEMENT
            </p>

            <h1>Faculty</h1>

            <p className="dashboard-subtitle">
              Manage faculty members in the
              Student Course Registration System.
            </p>

          </div>

          <div className="faculty-header-actions">

            <button
              type="button"
              className="faculty-refresh-button"
              onClick={loadFaculty}
              disabled={loading}
            >
              <RefreshCw size={17} />

              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

            <button
              type="button"
              className="faculty-add-button"
              onClick={openAddModal}
            >
              <Plus size={18} />

              Add Faculty
            </button>

          </div>

        </header>

        {/* ======================================
            SUCCESS MESSAGE
            ====================================== */}

        {successMessage && (
          <div className="faculty-message success">
            {successMessage}
          </div>
        )}

        {/* ======================================
            ERROR
            ====================================== */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* ======================================
            FACULTY COUNT
            ====================================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <Users size={22} />
            </div>

            <div>

              <p>Total Faculty</p>

              <h2>
                {loading
                  ? "—"
                  : faculty.length}
              </h2>

            </div>

          </div>

        </section>

        {/* ======================================
            FACULTY DIRECTORY
            ====================================== */}

        <section className="dashboard-content">

          <div className="dashboard-panel">

            {/* PANEL HEADER */}

            <div className="panel-header">

              <div>

                <p className="panel-label">
                  FACULTY DIRECTORY
                </p>

                <h2>All Faculty</h2>

              </div>

            </div>

            {/* ==================================
                SEARCH
                ================================== */}

            <div className="faculty-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search by name, email, department or ID..."
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
                  className="faculty-clear-search"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

            {/* ==================================
                FACULTY CONTENT
                ================================== */}

            {loading ? (

              <div className="empty-state">
                Loading faculty...
              </div>

            ) : error ? (

              <div className="empty-state">
                Unable to load faculty.
              </div>

            ) : filteredFaculty.length === 0 ? (

              <div className="empty-state">

                {searchTerm
                  ? "No faculty members match your search."
                  : "No faculty members found."}

              </div>

            ) : (

              <div className="faculty-list">

                {filteredFaculty.map(
                  (facultyMember) => (

                    <div
                      className="faculty-item"
                      key={facultyMember.id}
                    >

                      {/* FACULTY ICON */}

                      <div className="faculty-icon">
                        <Users size={21} />
                      </div>

                      {/* FACULTY INFORMATION */}

                      <div className="faculty-info">

                        <div className="faculty-title-row">

                          <h3>
                            {facultyMember.name}
                          </h3>

                          <span className="faculty-id-badge">
                            ID: {facultyMember.id}
                          </span>

                        </div>

                        <p>
                          Faculty Member
                        </p>

                      </div>

                      {/* EMAIL */}

                      <div className="faculty-detail">

                        <Mail size={17} />

                        <div>

                          <span>
                            Email
                          </span>

                          <strong>
                            {facultyMember.email ||
                              "Not available"}
                          </strong>

                        </div>

                      </div>

                      {/* DEPARTMENT */}

                      <div className="faculty-detail">

                        <Building2 size={17} />

                        <div>

                          <span>
                            Department
                          </span>

                          <strong>
                            {facultyMember.department ||
                              "Not assigned"}
                          </strong>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="faculty-actions">

                        <button
                          type="button"
                          className="faculty-edit-button"
                          onClick={() =>
                            openEditModal(
                              facultyMember
                            )
                          }
                          title="Edit faculty"
                        >
                          <Pencil size={17} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="faculty-delete-button"
                          onClick={() =>
                            openDeleteModal(
                              facultyMember
                            )
                          }
                          title="Delete faculty"
                        >
                          <Trash2 size={17} />
                          Delete
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

      {/* ==========================================
          ADD FACULTY MODAL
          ========================================== */}

      {showAddModal && (

        <div className="faculty-modal-overlay">

          <div className="faculty-modal">

            {/* MODAL HEADER */}

            <div className="faculty-modal-header">

              <div>

                <p className="dashboard-label">
                  FACULTY MANAGEMENT
                </p>

                <h2>
                  Add Faculty
                </h2>

              </div>

              <button
                type="button"
                className="faculty-modal-close"
                onClick={closeAddModal}
                disabled={saving}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              className="faculty-form"
              onSubmit={handleAddFaculty}
            >

              {/* NAME */}

              <div className="faculty-form-group">

                <label htmlFor="faculty-name">
                  Faculty Name
                </label>

                <input
                  id="faculty-name"
                  type="text"
                  placeholder="Enter faculty name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="faculty-form-group">

                <label htmlFor="faculty-email">
                  Email
                </label>

                <input
                  id="faculty-email"
                  type="email"
                  placeholder="Enter faculty email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* DEPARTMENT */}

              <div className="faculty-form-group">

                <label htmlFor="faculty-department">
                  Department
                </label>

                <input
                  id="faculty-department"
                  type="text"
                  placeholder="Example: Computer Science"
                  value={department}
                  onChange={(event) =>
                    setDepartment(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* MESSAGE */}

              {formMessage && (

                <div
                  className={`faculty-message ${
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

              <div className="faculty-form-actions">

                <button
                  type="button"
                  className="faculty-cancel-button"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="faculty-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Faculty"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================================
          EDIT FACULTY MODAL
          ========================================== */}

      {showEditModal && (

        <div className="faculty-modal-overlay">

          <div className="faculty-modal">

            {/* MODAL HEADER */}

            <div className="faculty-modal-header">

              <div>

                <p className="dashboard-label">
                  FACULTY MANAGEMENT
                </p>

                <h2>
                  Edit Faculty
                </h2>

              </div>

              <button
                type="button"
                className="faculty-modal-close"
                onClick={closeEditModal}
                disabled={editing}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              className="faculty-form"
              onSubmit={handleEditFaculty}
            >

              {/* NAME */}

              <div className="faculty-form-group">

                <label htmlFor="edit-faculty-name">
                  Faculty Name
                </label>

                <input
                  id="edit-faculty-name"
                  type="text"
                  placeholder="Enter faculty name"
                  value={editName}
                  onChange={(event) =>
                    setEditName(
                      event.target.value
                    )
                  }
                  disabled={editing}
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="faculty-form-group">

                <label htmlFor="edit-faculty-email">
                  Email
                </label>

                <input
                  id="edit-faculty-email"
                  type="email"
                  placeholder="Enter faculty email"
                  value={editEmail}
                  onChange={(event) =>
                    setEditEmail(
                      event.target.value
                    )
                  }
                  disabled={editing}
                  required
                />

              </div>

              {/* DEPARTMENT */}

              <div className="faculty-form-group">

                <label htmlFor="edit-faculty-department">
                  Department
                </label>

                <input
                  id="edit-faculty-department"
                  type="text"
                  placeholder="Example: Computer Science"
                  value={editDepartment}
                  onChange={(event) =>
                    setEditDepartment(
                      event.target.value
                    )
                  }
                  disabled={editing}
                  required
                />

              </div>

              {/* MESSAGE */}

              {editMessage && (

                <div
                  className={`faculty-message ${
                    editMessage.includes(
                      "successfully"
                    )
                      ? "success"
                      : "error"
                  }`}
                >
                  {editMessage}
                </div>

              )}

              {/* BUTTONS */}

              <div className="faculty-form-actions">

                <button
                  type="button"
                  className="faculty-cancel-button"
                  onClick={closeEditModal}
                  disabled={editing}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="faculty-save-button"
                  disabled={editing}
                >
                  {editing
                    ? "Updating..."
                    : "Update Faculty"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}

      {showDeleteModal && deletingFaculty && (

        <div className="faculty-modal-overlay">

          <div className="faculty-modal">

            {/* MODAL HEADER */}

            <div className="faculty-modal-header">

              <div>

                <p className="dashboard-label">
                  FACULTY MANAGEMENT
                </p>

                <h2>
                  Delete Faculty
                </h2>

              </div>

              <button
                type="button"
                className="faculty-modal-close"
                onClick={closeDeleteModal}
                disabled={deleting}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* DELETE CONTENT */}

            <div className="faculty-delete-content">

              <div className="faculty-delete-icon">
                <AlertTriangle size={30} />
              </div>

              <h3>
                Are you sure?
              </h3>

              <p>
                You are about to delete:
              </p>

              <strong>
                {deletingFaculty.name}
              </strong>

              <p>
                Email:{" "}
                {deletingFaculty.email}
              </p>

              <p>
                Department:{" "}
                {deletingFaculty.department}
              </p>

              <p>
                This action cannot be undone.
              </p>

            </div>

            {/* DELETE ERROR */}

            {deleteMessage && (

              <div className="faculty-message error">
                {deleteMessage}
              </div>

            )}

            {/* BUTTONS */}

            <div className="faculty-form-actions">

              <button
                type="button"
                className="faculty-cancel-button"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="faculty-delete-confirm-button"
                onClick={handleDeleteFaculty}
                disabled={deleting}
              >
                <Trash2 size={17} />

                {deleting
                  ? "Deleting..."
                  : "Delete Faculty"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Faculty;