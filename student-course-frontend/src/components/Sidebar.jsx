import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  ClipboardList,
  BarChart3,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

function Sidebar({ activePage, setActivePage, onLogout, isOpen, onClose }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      icon: Users,
    },
    {
      name: "Courses",
      icon: BookOpen,
    },
    {
      name: "Faculty",
      icon: GraduationCap,
    },
    {
      name: "Registrations",
      icon: ClipboardList,
    },
    {
      name: "Reports",
      icon: BarChart3,
    },
  ];

  const handleMenuClick = (page) => {
    setActivePage(page);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              🎓
            </div>

            <div>
              <h2>Student Portal</h2>
              <span>Academic Management</span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-navigation">
          <p className="sidebar-section-title">
            MAIN MENU
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`sidebar-menu-item ${
                  activePage === item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleMenuClick(item.name)
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <p className="sidebar-section-title">
            ACCOUNT
          </p>

          <button
            className={`sidebar-menu-item ${
              activePage === "Profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick("Profile")
            }
          >
            <UserCircle size={19} />

            <span>Profile</span>
          </button>

          <button
            className="sidebar-menu-item logout-item"
            onClick={onLogout}
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-icon">
            🎓
          </div>

          <div>
            <strong>Student Course System</strong>

            <span>
              Management Portal
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;