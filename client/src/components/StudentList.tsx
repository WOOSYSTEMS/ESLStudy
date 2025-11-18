import React, { useState } from 'react';
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  UserPlus,
  Download,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper-Intermediate' | 'Advanced';
  enrollmentDate: string;
  lastActive: string;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  attendance: number;
  completedLessons: number;
  totalLessons: number;
  nextClass: string;
  koreanName: string;
}

const StudentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'attendance'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [students] = useState<Student[]>([]);

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.koreanName.includes(searchTerm) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'attendance':
          comparison = a.attendance - b.attendance;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-error';
      case 'Elementary': return 'text-warning';
      case 'Intermediate': return 'text-accent';
      case 'Upper-Intermediate': return 'text-success';
      case 'Advanced': return 'text-primary';
      default: return 'text-secondary';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} className="text-success" />;
      case 'down': return <TrendingDown size={14} className="text-error" />;
      default: return <Minus size={14} className="text-secondary" />;
    }
  };

  const handleSort = (column: 'name' | 'progress' | 'attendance') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="student-list">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Students</h1>
        <p className="text-secondary">Manage and track your students' progress</p>
      </div>

      {/* Toolbar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-3 text-muted" />
              <input
                type="text"
                placeholder="Search by name, Korean name, or email..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="select"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Elementary">Elementary</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Upper-Intermediate">Upper-Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button className="btn btn-primary">
              <UserPlus size={16} />
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Student
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="text-left p-4">Level</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('progress')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Progress
                    {sortBy === 'progress' && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('attendance')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Attendance
                    {sortBy === 'attendance' && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="text-left p-4">Next Class</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className="border-b hover:bg-surface">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface border flex items-center justify-center text-sm font-medium">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-secondary">{student.koreanName}</div>
                        <div className="text-xs text-muted">{student.lastActive}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${getLevelColor(student.level)}`}>
                      {student.level}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 text-secondary">
                        <Mail size={14} />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-secondary mt-1">
                        <Phone size={14} />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{student.progress}%</span>
                          {getTrendIcon(student.trend)}
                        </div>
                        <div className="progress-bar mt-1">
                          <div className="progress-fill" style={{ width: `${student.progress}%` }} />
                        </div>
                        <div className="text-xs text-muted mt-1">
                          {student.completedLessons}/{student.totalLessons} lessons
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium">{student.attendance}%</div>
                      <div className={`text-xs ${student.attendance >= 90 ? 'text-success' : student.attendance >= 80 ? 'text-warning' : 'text-error'}`}>
                        {student.attendance >= 90 ? 'Excellent' : student.attendance >= 80 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-secondary" />
                      {student.nextClass}
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="tool-btn">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-secondary">No students found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;