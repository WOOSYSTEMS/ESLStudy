import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Mic,
  Video,
  Home,
  Settings,
  FileText,
  Calendar,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  PenTool
} from 'lucide-react';

// Import components
import TeacherDashboard from './components/TeacherDashboard';
import TeachingCanvas from './components/TeachingCanvas';
import StudentList from './components/StudentList';
import LessonPlanner from './components/LessonPlanner';
import Assignments from './components/Assignments';
import VideoConference from './components/VideoConference';
import PronunciationLab from './components/PronunciationLab';
import Analytics from './components/Analytics';
import LoginPage from './components/LoginPage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  level?: string;
}

const NavItem = ({ to, icon: Icon, children, isActive, onClick }: any) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // If not logged in, show login page
  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const isTeacher = user.role === 'teacher';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="text-lg font-semibold">ESL Academy</h2>
          <p className="text-xs text-muted mt-1">Professional Teaching Platform</p>
        </div>

        <nav className="sidebar-content">
          <div className="flex flex-col gap-1">
            <NavItem
              to="/"
              icon={Home}
              isActive={location.pathname === '/'}
            >
              Dashboard
            </NavItem>

            {isTeacher && (
              <>
                <NavItem
                  to="/teaching-canvas"
                  icon={PenTool}
                  isActive={location.pathname === '/teaching-canvas'}
                >
                  Teaching Canvas
                </NavItem>
                <NavItem
                  to="/students"
                  icon={Users}
                  isActive={location.pathname === '/students'}
                >
                  Students
                </NavItem>
                <NavItem
                  to="/lessons"
                  icon={BookOpen}
                  isActive={location.pathname === '/lessons'}
                >
                  Lesson Planner
                </NavItem>
                <NavItem
                  to="/assignments"
                  icon={FileText}
                  isActive={location.pathname === '/assignments'}
                >
                  Assignments
                </NavItem>
                <NavItem
                  to="/video-conference"
                  icon={Video}
                  isActive={location.pathname === '/video-conference'}
                >
                  Video Conference
                </NavItem>
                <NavItem
                  to="/pronunciation"
                  icon={Mic}
                  isActive={location.pathname === '/pronunciation'}
                >
                  Pronunciation Lab
                </NavItem>
                <NavItem
                  to="/analytics"
                  icon={BarChart3}
                  isActive={location.pathname === '/analytics'}
                >
                  Analytics
                </NavItem>
              </>
            )}

            {!isTeacher && (
              <>
                <NavItem
                  to="/my-lessons"
                  icon={BookOpen}
                  isActive={location.pathname === '/my-lessons'}
                >
                  My Lessons
                </NavItem>
                <NavItem
                  to="/assignments"
                  icon={FileText}
                  isActive={location.pathname === '/assignments'}
                >
                  Assignments
                </NavItem>
                <NavItem
                  to="/pronunciation"
                  icon={Mic}
                  isActive={location.pathname === '/pronunciation'}
                >
                  Practice
                </NavItem>
                <NavItem
                  to="/schedule"
                  icon={Calendar}
                  isActive={location.pathname === '/schedule'}
                >
                  Schedule
                </NavItem>
              </>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="border-t pt-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-surface border flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => setUser(null)}
              className="nav-item w-full mt-2"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="tool-btn"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h1 className="text-lg font-semibold">
                {isTeacher ? 'Teacher Portal' : 'Student Portal'}
              </h1>
              <p className="text-xs text-muted">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="tool-btn"
            >
              {isDark ? '☀' : '☾'}
            </button>
            <button className="tool-btn">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          <Routes>
            <Route path="/" element={<TeacherDashboard user={user} />} />
            <Route path="/teaching-canvas" element={<TeachingCanvas />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/lessons" element={<LessonPlanner />} />
            <Route path="/assignments" element={<Assignments user={user} />} />
            <Route path="/video-conference" element={<VideoConference />} />
            <Route path="/pronunciation" element={<PronunciationLab />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;