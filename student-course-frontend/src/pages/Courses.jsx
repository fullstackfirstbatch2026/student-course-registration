import { useEffect, useState } from "react";

import {
  BookOpen,
  GraduationCap,
  Users,
  RefreshCw,
  IndianRupee,
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import API_BASE_URL from "../services/api";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [loading, setLoading] = useState(true);
  const [facultyLoading, setFacultyLoading] = useState(true);

  const [error, setError] = useState("");
  const [facultyError, setFacultyError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // ADD COURSE MODAL
  // ==========================================

  const [showAddModal, setShowAddModal] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseCapacity, setCourseCapacity] = useState("");
  const [facultyId, setFacultyId] = useState("");

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // ==========================================
  // EDIT COURSE MODAL
  // ==========================================

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [editCourseName, setEditCourseName] = useState("");
  const [editCourseCode, setEditCourseCode] = useState("");
  const [editCourseFee, setEditCourseFee] = useState("");
  const [editCourseCapacity, setEditCourseCapacity] = useState("");
  const [editFacultyId, setEditFacultyId] = useState("");

  const [editAvailableSeats, setEditAvailableSeats] = useState("");
  const [editOriginalCapacity, setEditOriginalCapacity] = useState("");

  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  // ==========================================
  // DELETE COURSE MODAL
  // ==========================================

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // ==========================================
  // PAGE MESSAGE
  // ==========================================

  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // LOAD COURSES
  // ==========================================

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/courses`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load courses.");
      }

      const data = await response.json();

      setCourses(data);
    } catch (error) {
      setError(
        error.message || "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD FACULTY
  // ==========================================

  const loadFaculty = async () => {
    try {
      setFacultyLoading(true);
      setFacultyError("");

      const response = await fetch(
        `${API_BASE_URL}/api/faculty`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load faculty.");
      }

      const data = await response.json();

      setFaculty(data);
    } catch (error) {
      setFacultyError(
        error.message || "Unable to load faculty."
      );
    } finally {
      setFacultyLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses();
      loadFaculty();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // SEARCH COURSES
  // ==========================================

  const filteredCourses = courses.filter((course) => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return true;
    }

    return (
      String(course.id || "")
        .toLowerCase()
        .includes(search) ||

      String(course.courseName || "")
        .toLowerCase()
        .includes(search) ||

      String(course.courseCode || "")
        .toLowerCase()
        .includes(search) ||

      String(course.faculty?.name || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // ==========================================
  // OPEN ADD COURSE MODAL
  // ==========================================

  const openAddModal = () => {
    setCourseName("");
    setCourseCode("");
    setCourseFee("");
    setCourseCapacity("");
    setFacultyId("");
    setFormMessage("");

    setShowAddModal(true);

    loadFaculty();
  };

  // ==========================================
  // CLOSE ADD COURSE MODAL
  // ==========================================

  const closeAddModal = () => {
    if (saving) {
      return;
    }

    setShowAddModal(false);

    setCourseName("");
    setCourseCode("");
    setCourseFee("");
    setCourseCapacity("");
    setFacultyId("");
    setFormMessage("");
  };

  // ==========================================
  // ADD COURSE
  // ==========================================

  const handleAddCourse = async (event) => {
    event.preventDefault();

    setFormMessage("");
    setError("");
    setSuccessMessage("");

    if (!courseName.trim()) {
      setFormMessage(
        "Please enter the course name."
      );
      return;
    }

    if (!courseCode.trim()) {
      setFormMessage(
        "Please enter the course code."
      );
      return;
    }

    if (!courseFee || Number(courseFee) < 0) {
      setFormMessage(
        "Please enter a valid course fee."
      );
      return;
    }

    if (
      !courseCapacity ||
      Number(courseCapacity) <= 0
    ) {
      setFormMessage(
        "Please enter a valid capacity."
      );
      return;
    }

    if (!facultyId) {
      setFormMessage(
        "Please select a faculty member."
      );
      return;
    }

    try {
      setSaving(true);

      const capacity = Number(courseCapacity);

      const courseData = {
        courseName: courseName.trim(),
        courseCode: courseCode.trim(),
        fee: Number(courseFee),
        capacity: capacity,
        availableSeats: capacity,
        faculty: {
          id: Number(facultyId),
        },
      };

      const response = await fetch(
        `${API_BASE_URL}/api/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(courseData),
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          resultText || "Unable to add course."
        );
      }

      setFormMessage(
        "Course added successfully!"
      );

      await loadCourses();

      setTimeout(() => {
        setShowAddModal(false);
        setFormMessage("");

        setCourseName("");
        setCourseCode("");
        setCourseFee("");
        setCourseCapacity("");
        setFacultyId("");

        setSuccessMessage(
          "Course added successfully!"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }, 700);
    } catch (error) {
      setFormMessage(
        error.message || "Unable to add course."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN EDIT COURSE MODAL
  // ==========================================

  const openEditModal = (course) => {
    setEditingCourseId(course.id);

    setEditCourseName(
      course.courseName || ""
    );

    setEditCourseCode(
      course.courseCode || ""
    );

    setEditCourseFee(
      course.fee !== null &&
      course.fee !== undefined
        ? String(course.fee)
        : ""
    );

    setEditCourseCapacity(
      course.capacity !== null &&
      course.capacity !== undefined
        ? String(course.capacity)
        : ""
    );

    setEditFacultyId(
      course.faculty?.id
        ? String(course.faculty.id)
        : ""
    );

    setEditAvailableSeats(
      course.availableSeats !== null &&
      course.availableSeats !== undefined
        ? Number(course.availableSeats)
        : 0
    );

    setEditOriginalCapacity(
      course.capacity !== null &&
      course.capacity !== undefined
        ? Number(course.capacity)
        : 0
    );

    setEditMessage("");
    setShowEditModal(true);

    loadFaculty();
  };

  // ==========================================
  // CLOSE EDIT COURSE MODAL
  // ==========================================

  const closeEditModal = () => {
    if (editing) {
      return;
    }

    setShowEditModal(false);

    setEditingCourseId(null);

    setEditCourseName("");
    setEditCourseCode("");
    setEditCourseFee("");
    setEditCourseCapacity("");
    setEditFacultyId("");
    setEditAvailableSeats("");
    setEditOriginalCapacity("");
    setEditMessage("");
  };

  // ==========================================
  // UPDATE COURSE
  // ==========================================

  const handleEditCourse = async (event) => {
    event.preventDefault();

    setEditMessage("");
    setError("");
    setSuccessMessage("");

    if (!editCourseName.trim()) {
      setEditMessage(
        "Please enter the course name."
      );
      return;
    }

    if (!editCourseCode.trim()) {
      setEditMessage(
        "Please enter the course code."
      );
      return;
    }

    if (
      !editCourseFee ||
      Number(editCourseFee) < 0
    ) {
      setEditMessage(
        "Please enter a valid course fee."
      );
      return;
    }

    if (
      !editCourseCapacity ||
      Number(editCourseCapacity) <= 0
    ) {
      setEditMessage(
        "Please enter a valid capacity."
      );
      return;
    }

    if (!editFacultyId) {
      setEditMessage(
        "Please select a faculty member."
      );
      return;
    }

    const newCapacity = Number(
      editCourseCapacity
    );

    const occupiedSeats =
      Number(editOriginalCapacity) -
      Number(editAvailableSeats);

    const newAvailableSeats =
      newCapacity - occupiedSeats;

    if (newAvailableSeats < 0) {
      setEditMessage(
        `Capacity cannot be less than ${occupiedSeats} occupied seat(s).`
      );
      return;
    }

    try {
      setEditing(true);

      const courseData = {
        courseName: editCourseName.trim(),
        courseCode: editCourseCode.trim(),
        fee: Number(editCourseFee),
        capacity: newCapacity,
        availableSeats: newAvailableSeats,
        faculty: {
          id: Number(editFacultyId),
        },
      };

      const response = await fetch(
        `${API_BASE_URL}/api/courses/${editingCourseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(courseData),
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          resultText ||
            "Unable to update course."
        );
      }

      setEditMessage(
        "Course updated successfully!"
      );

      await loadCourses();

      setTimeout(() => {
        setShowEditModal(false);
        setEditMessage("");

        setEditingCourseId(null);

        setEditCourseName("");
        setEditCourseCode("");
        setEditCourseFee("");
        setEditCourseCapacity("");
        setEditFacultyId("");
        setEditAvailableSeats("");
        setEditOriginalCapacity("");

        setSuccessMessage(
          "Course updated successfully!"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }, 700);
    } catch (error) {
      setEditMessage(
        error.message ||
          "Unable to update course."
      );
    } finally {
      setEditing(false);
    }
  };

  // ==========================================
  // OPEN DELETE CONFIRMATION
  // ==========================================

  const openDeleteModal = (course) => {
    setDeletingCourse(course);
    setDeleteMessage("");
    setShowDeleteModal(true);
  };

  // ==========================================
  // CLOSE DELETE CONFIRMATION
  // ==========================================

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
    setDeletingCourse(null);
    setDeleteMessage("");
  };

  // ==========================================
  // DELETE COURSE
  // ==========================================

  const handleDeleteCourse = async () => {
    if (!deletingCourse) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteMessage("");
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/courses/${deletingCourse.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          resultText ||
            "Unable to delete course."
        );
      }

      await loadCourses();

      setShowDeleteModal(false);
      setDeletingCourse(null);

      setSuccessMessage(
        `Course "${deletingCourse.courseName}" deleted successfully!`
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setDeleteMessage(
        error.message ||
          "Unable to delete course."
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

            <h1>Courses</h1>

            <p className="dashboard-subtitle">
              Manage courses available in the
              Student Course Registration System.
            </p>

          </div>

          <div className="course-header-actions">

            <button
              type="button"
              className="refresh-button"
              onClick={() => {
                loadCourses();
                loadFaculty();
              }}
              disabled={loading}
            >
              <RefreshCw size={17} />

              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

            <button
              type="button"
              className="add-course-button"
              onClick={openAddModal}
            >
              <Plus size={18} />

              Add Course
            </button>

          </div>

        </header>

        {/* ======================================
            SUCCESS MESSAGE
            ====================================== */}

        {successMessage && (
          <div className="course-form-message success">
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

        {facultyError && (
          <div className="dashboard-error">
            {facultyError}
          </div>
        )}

        {/* ======================================
            COURSE COUNT
            ====================================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <BookOpen size={22} />
            </div>

            <div>

              <p>Total Courses</p>

              <h2>
                {loading
                  ? "—"
                  : courses.length}
              </h2>

            </div>

          </div>

        </section>

        {/* ======================================
            COURSE DIRECTORY
            ====================================== */}

        <section className="dashboard-content">

          <div className="dashboard-panel">

            {/* PANEL HEADER */}

            <div className="panel-header">

              <div>

                <p className="panel-label">
                  COURSE DIRECTORY
                </p>

                <h2>All Courses</h2>

              </div>

            </div>

            {/* ==================================
                SEARCH
                ================================== */}

            <div className="course-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search by course name, code, faculty or ID..."
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
                  className="course-clear-search"
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
                COURSE CONTENT
                ================================== */}

            {loading ? (

              <div className="empty-state">
                Loading courses...
              </div>

            ) : error ? (

              <div className="empty-state">
                Unable to load courses.
              </div>

            ) : filteredCourses.length === 0 ? (

              <div className="empty-state">

                {searchTerm
                  ? "No courses match your search."
                  : "No courses found."}

              </div>

            ) : (

              <div className="course-list">

                {filteredCourses.map(
                  (course) => (

                    <div
                      className="course-item"
                      key={course.id}
                    >

                      {/* COURSE ICON */}

                      <div className="course-icon">
                        <BookOpen size={21} />
                      </div>

                      {/* COURSE INFORMATION */}

                      <div className="course-info">

                        <div className="course-title-row">

                          <h3>
                            {course.courseName}
                          </h3>

                          <span className="course-code">
                            {course.courseCode}
                          </span>

                        </div>

                        <p>
                          Course ID: {course.id}
                        </p>

                      </div>

                      {/* FACULTY */}

                      <div className="course-detail">

                        <GraduationCap size={17} />

                        <div>

                          <span>
                            Faculty
                          </span>

                          <strong>
                            {course.faculty?.name ||
                              "Not assigned"}
                          </strong>

                        </div>

                      </div>

                      {/* AVAILABLE SEATS */}

                      <div className="course-detail">

                        <Users size={17} />

                        <div>

                          <span>
                            Available Seats
                          </span>

                          <strong>
                            {course.availableSeats}
                            {" / "}
                            {course.capacity}
                          </strong>

                        </div>

                      </div>

                      {/* COURSE FEE */}

                      <div className="course-detail">

                        <IndianRupee size={17} />

                        <div>

                          <span>
                            Course Fee
                          </span>

                          <strong>
                            ₹{" "}
                            {Number(
                              course.fee
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="course-actions">

                        <button
                          type="button"
                          className="course-edit-button"
                          onClick={() =>
                            openEditModal(course)
                          }
                          title="Edit course"
                        >
                          <Pencil size={17} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="course-delete-button"
                          onClick={() =>
                            openDeleteModal(course)
                          }
                          title="Delete course"
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
          ADD COURSE MODAL
          ========================================== */}

      {showAddModal && (

        <div className="course-modal-overlay">

          <div className="course-modal">

            <div className="course-modal-header">

              <div>

                <p className="dashboard-label">
                  COURSE MANAGEMENT
                </p>

                <h2>
                  Add Course
                </h2>

              </div>

              <button
                type="button"
                className="course-modal-close"
                onClick={closeAddModal}
                disabled={saving}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="course-form"
              onSubmit={handleAddCourse}
            >

              {/* COURSE NAME */}

              <div className="course-form-group">

                <label htmlFor="course-name">
                  Course Name
                </label>

                <input
                  id="course-name"
                  type="text"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(event) =>
                    setCourseName(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* COURSE CODE */}

              <div className="course-form-group">

                <label htmlFor="course-code">
                  Course Code
                </label>

                <input
                  id="course-code"
                  type="text"
                  placeholder="Example: CS101"
                  value={courseCode}
                  onChange={(event) =>
                    setCourseCode(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* FEE */}

              <div className="course-form-group">

                <label htmlFor="course-fee">
                  Course Fee
                </label>

                <input
                  id="course-fee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter course fee"
                  value={courseFee}
                  onChange={(event) =>
                    setCourseFee(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* CAPACITY */}

              <div className="course-form-group">

                <label htmlFor="course-capacity">
                  Capacity
                </label>

                <input
                  id="course-capacity"
                  type="number"
                  min="1"
                  placeholder="Enter maximum seats"
                  value={courseCapacity}
                  onChange={(event) =>
                    setCourseCapacity(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* FACULTY */}

              <div className="course-form-group">

                <label htmlFor="faculty-id">
                  Faculty
                </label>

                <select
                  id="faculty-id"
                  value={facultyId}
                  onChange={(event) =>
                    setFacultyId(
                      event.target.value
                    )
                  }
                  disabled={
                    saving || facultyLoading
                  }
                  required
                >

                  <option value="">
                    {facultyLoading
                      ? "Loading faculty..."
                      : "Select Faculty"}
                  </option>

                  {faculty.map(
                    (facultyMember) => (

                      <option
                        key={facultyMember.id}
                        value={facultyMember.id}
                      >
                        {facultyMember.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {facultyError && (
                <div className="course-form-message error">
                  {facultyError}
                </div>
              )}

              {formMessage && (

                <div
                  className={`course-form-message ${
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

              <div className="course-form-actions">

                <button
                  type="button"
                  className="course-cancel-button"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="course-save-button"
                  disabled={
                    saving ||
                    facultyLoading ||
                    faculty.length === 0
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Course"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================================
          EDIT COURSE MODAL
          ========================================== */}

      {showEditModal && (

        <div className="course-modal-overlay">

          <div className="course-modal">

            <div className="course-modal-header">

              <div>

                <p className="dashboard-label">
                  COURSE MANAGEMENT
                </p>

                <h2>
                  Edit Course
                </h2>

              </div>

              <button
                type="button"
                className="course-modal-close"
                onClick={closeEditModal}
                disabled={editing}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="course-form"
              onSubmit={handleEditCourse}
            >

              {/* COURSE NAME */}

              <div className="course-form-group">

                <label htmlFor="edit-course-name">
                  Course Name
                </label>

                <input
                  id="edit-course-name"
                  type="text"
                  placeholder="Enter course name"
                  value={editCourseName}
                  onChange={(event) =>
                    setEditCourseName(
                      event.target.value
                    )
                  }
                  disabled={editing}
                  required
                />

              </div>

              {/* COURSE CODE */}

              <div className="course-form-group">

                <label htmlFor="edit-course-code">
                  Course Code
                </label>

                <input
                  id="edit-course-code"
                  type="text"
                  placeholder="Example: CS101"
                  value={editCourseCode}
                  onChange={(event) =>
                    setEditCourseCode(
                      event.target.value
                    )
                  }
                  disabled={editing}
                  required
                />

              </div>

              {/* COURSE FEE */}

              <div className="course-form-group">

                <label htmlFor="edit-course-fee">
                  Course Fee
                </label>

                <input
                  id="edit-course-fee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter course fee"
                  value={editCourseFee}
                  onChange={(event) =>
                    setEditCourseFee(
                      event.target.value
                    )
                  }
                  disabled={editing}
                  required
                />

              </div>

              {/* CAPACITY */}

              <div className="course-form-group">

                <label htmlFor="edit-course-capacity">
                  Capacity
                </label>

                <input
                  id="edit-course-capacity"
                  type="number"
                  min="1"
                  placeholder="Enter maximum seats"
                  value={editCourseCapacity}
                  onChange={(event) =>
                    setEditCourseCapacity(
                      event.target.value
                    )
                  }
                  disabled={editing}
                  required
                />

              </div>

              {/* AVAILABLE SEATS */}

              <div className="course-form-group">

                <label htmlFor="edit-available-seats">
                  Available Seats
                </label>

                <input
                  id="edit-available-seats"
                  type="number"
                  value={editAvailableSeats}
                  disabled
                  readOnly
                />

              </div>

              {/* FACULTY */}

              <div className="course-form-group">

                <label htmlFor="edit-faculty-id">
                  Faculty
                </label>

                <select
                  id="edit-faculty-id"
                  value={editFacultyId}
                  onChange={(event) =>
                    setEditFacultyId(
                      event.target.value
                    )
                  }
                  disabled={
                    editing || facultyLoading
                  }
                  required
                >

                  <option value="">
                    {facultyLoading
                      ? "Loading faculty..."
                      : "Select Faculty"}
                  </option>

                  {faculty.map(
                    (facultyMember) => (

                      <option
                        key={facultyMember.id}
                        value={facultyMember.id}
                      >
                        {facultyMember.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {facultyError && (
                <div className="course-form-message error">
                  {facultyError}
                </div>
              )}

              {editMessage && (

                <div
                  className={`course-form-message ${
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

              <div className="course-form-actions">

                <button
                  type="button"
                  className="course-cancel-button"
                  onClick={closeEditModal}
                  disabled={editing}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="course-save-button"
                  disabled={
                    editing ||
                    facultyLoading ||
                    faculty.length === 0
                  }
                >
                  {editing
                    ? "Updating..."
                    : "Update Course"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}

      {showDeleteModal && deletingCourse && (

        <div className="course-modal-overlay">

          <div className="course-modal">

            <div className="course-modal-header">

              <div>

                <p className="dashboard-label">
                  COURSE MANAGEMENT
                </p>

                <h2>
                  Delete Course
                </h2>

              </div>

              <button
                type="button"
                className="course-modal-close"
                onClick={closeDeleteModal}
                disabled={deleting}
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            <div className="course-delete-content">

              <div className="course-delete-icon">
                <AlertTriangle size={30} />
              </div>

              <h3>
                Are you sure?
              </h3>

              <p>
                You are about to delete:
              </p>

              <strong>
                {deletingCourse.courseName}
              </strong>

              <p>
                Course Code:{" "}
                {deletingCourse.courseCode}
              </p>

              <p>
                This action cannot be undone.
              </p>

            </div>

            {deleteMessage && (

              <div className="course-form-message error">
                {deleteMessage}
              </div>

            )}

            <div className="course-form-actions">

              <button
                type="button"
                className="course-cancel-button"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="course-delete-confirm-button"
                onClick={handleDeleteCourse}
                disabled={deleting}
              >
                <Trash2 size={17} />

                {deleting
                  ? "Deleting..."
                  : "Delete Course"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Courses;