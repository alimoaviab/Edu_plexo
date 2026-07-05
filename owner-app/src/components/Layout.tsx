import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  School, 
  Compass, 
  Users, 
  CreditCard, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  ChevronDown,
  Building2
} from "lucide-react";
import { api, removeToken, getActiveSchoolId, setActiveSchoolId } from "../lib/api";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Schools", path: "/schools", icon: School },
  { label: "Campuses", path: "/campuses", icon: Compass },
  { label: "School Admins", path: "/admins", icon: Users },
  { label: "Subscriptions", path: "/subscriptions", icon: CreditCard },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [activeSchoolId, setActiveSchoolIdState] = useState<string>(getActiveSchoolId() || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch profile and schools list
    api.get("/auth/session")
      .then((data: any) => setUser(data))
      .catch(() => navigate("/login"));

    api.get("/owner/schools")
      .then((data: any) => setSchools(data || []))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    api.post("/auth/logout").finally(() => {
      removeToken();
      localStorage.removeItem("active_school_id");
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/login");
    });
  };

  const handleSchoolSwitch = (schoolId: string) => {
    setActiveSchoolIdState(schoolId);
    if (schoolId) {
      setActiveSchoolId(schoolId);
    } else {
      localStorage.removeItem("active_school_id");
    }
    setDropdownOpen(false);
    // Reload components depending on school switching
    window.dispatchEvent(new Event("school-switched"));
  };

  const activeSchool = schools.find(s => s.school_id === activeSchoolId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 w-64 fixed inset-y-0 left-0 z-30 transition-transform duration-300 transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Building2 size={20} />
            </div>
            <span className="font-bold text-lg tracking-wider text-indigo-400">EduPlexo Owner</span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User Session card */}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-lg border border-indigo-500/30">
              {user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate text-sm">{user.profile?.first_name || "Owner"}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-12rem)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 md:pl-64 flex flex-col min-h-screen transition-all`}>
        {/* Navbar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>

            {/* School/Campus Switcher dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 transition-all"
              >
                <Building2 size={16} className="text-indigo-400" />
                <span className="max-w-[150px] md:max-w-[200px] truncate">
                  {activeSchool ? activeSchool.name : "All Schools / Campuses"}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => handleSchoolSwitch("")}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700/50 flex items-center gap-2 ${
                      !activeSchoolId ? "text-indigo-400 font-medium" : "text-slate-300"
                    }`}
                  >
                    All Schools / Campuses
                  </button>
                  <div className="border-t border-slate-700 my-1" />
                  {schools.map((school) => (
                    <button
                      key={school.school_id}
                      onClick={() => handleSchoolSwitch(school.school_id)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700/50 flex items-center gap-2 truncate ${
                        activeSchoolId === school.school_id ? "text-indigo-400 font-medium" : "text-slate-300"
                      }`}
                    >
                      {school.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-white transition-all bg-slate-800/50 rounded-lg hover:bg-slate-800">
              <Bell size={20} />
              {/* Optional red badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
