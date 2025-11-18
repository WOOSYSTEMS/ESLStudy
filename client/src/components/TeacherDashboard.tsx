import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  ChevronRight,
  FileText,
  Video,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

interface TeacherDashboardProps {
  user: User;
}

interface ClassSession {
  id: string;
  title: string;
  time: string;
  students: number;
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface Student {
  id: string;
  name: string;
  level: string;
  progress: number;
  lastActive: string;
  attendance: number;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  const [todaySessions, setTodaySessions] = useState<ClassSession[]>([]);

  const [recentStudents, setRecentStudents] = useState<Student[]>([]);

  const stats = {
    totalStudents: 0,
    activeClasses: 0,
    completedLessons: 0,
    avgAttendance: 0
  };

  const assignments: any[] = [];

  const announcements: any[] = [];

  return (
    <div className="teacher-dashboard">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Welcome back, {user.name}</h1>
        <p className="text-secondary">Here's your teaching overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Users size={20} className="text-secondary" />
            <span className="text-xs text-success">+5%</span>
          </div>
          <div className="text-2xl font-semibold">{stats.totalStudents}</div>
          <div className="text-sm text-secondary">Total Students</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <BookOpen size={20} className="text-secondary" />
            <span className="text-xs text-success">Active</span>
          </div>
          <div className="text-2xl font-semibold">{stats.activeClasses}</div>
          <div className="text-sm text-secondary">Active Classes</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Award size={20} className="text-secondary" />
            <span className="text-xs text-success">+12</span>
          </div>
          <div className="text-2xl font-semibold">{stats.completedLessons}</div>
          <div className="text-sm text-secondary">Completed Lessons</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={20} className="text-secondary" />
            <span className="text-xs text-success">Good</span>
          </div>
          <div className="text-2xl font-semibold">{stats.avgAttendance}%</div>
          <div className="text-sm text-secondary">Avg Attendance</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar size={18} />
                Today's Schedule
              </h2>
              <button className="text-sm text-secondary hover:text-primary">View All</button>
            </div>
            <div className="space-y-3">
              {todaySessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-surface">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${
                      session.status === 'completed' ? 'bg-success' :
                      session.status === 'in-progress' ? 'bg-warning' :
                      'bg-secondary'
                    }`} />
                    <div>
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-secondary flex items-center gap-2">
                        <Clock size={14} />
                        {session.time}
                        <span className="mx-2">•</span>
                        <Users size={14} />
                        {session.students} students
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.status === 'in-progress' && (
                      <span className="text-xs px-2 py-1 bg-warning text-white rounded">Live</span>
                    )}
                    {session.status === 'upcoming' ? (
                      <button className="btn btn-primary">
                        <Video size={14} />
                        Start
                      </button>
                    ) : session.status === 'completed' ? (
                      <CheckCircle size={18} className="text-success" />
                    ) : (
                      <button className="btn btn-secondary">
                        Join
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText size={18} />
                Pending Assignments
              </h2>
              <button className="text-sm text-secondary hover:text-primary">View All</button>
            </div>
            <div className="space-y-3">
              {assignments.map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{assignment.title}</span>
                      {assignment.urgent && (
                        <AlertCircle size={14} className="text-error" />
                      )}
                    </div>
                    <div className="text-sm text-secondary">Due in {assignment.dueDate}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {assignment.submitted}/{assignment.total}
                      </div>
                      <div className="text-xs text-secondary">Submitted</div>
                    </div>
                    <div className="w-24">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Students */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Students</h2>
              <button className="text-sm text-secondary hover:text-primary">View All</button>
            </div>
            <div className="space-y-3">
              {recentStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface border flex items-center justify-center text-xs font-medium">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{student.name}</div>
                      <div className="text-xs text-secondary">{student.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-secondary">{student.lastActive}</div>
                    <div className="text-xs text-muted">{student.attendance}% attendance</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Announcements</h2>
            <div className="space-y-3">
              {announcements.map(announcement => (
                <div key={announcement.id} className="flex gap-3">
                  <div className={`mt-1 ${
                    announcement.type === 'warning' ? 'text-warning' : 'text-accent'
                  }`}>
                    <AlertCircle size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{announcement.message}</p>
                    <p className="text-xs text-muted mt-1">{announcement.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 border rounded-lg hover:bg-surface flex items-center justify-between group">
                <span className="text-sm">Create New Lesson</span>
                <ChevronRight size={16} className="text-secondary group-hover:text-primary" />
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-surface flex items-center justify-between group">
                <span className="text-sm">Schedule Class</span>
                <ChevronRight size={16} className="text-secondary group-hover:text-primary" />
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-surface flex items-center justify-between group">
                <span className="text-sm">Send Announcement</span>
                <ChevronRight size={16} className="text-secondary group-hover:text-primary" />
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-surface flex items-center justify-between group">
                <span className="text-sm">Grade Assignments</span>
                <ChevronRight size={16} className="text-secondary group-hover:text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;