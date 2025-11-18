import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Eye,
  MessageSquare,
  Send,
  Filter,
  Search
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

interface AssignmentsProps {
  user: User;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'essay' | 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading';
  level: string;
  dueDate: string;
  createdDate: string;
  points: number;
  submissions?: Submission[];
  totalStudents?: number;
  submittedCount?: number;
  status?: 'pending' | 'submitted' | 'graded' | 'late';
  grade?: number;
  feedback?: string;
  attachments?: string[];
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'on-time' | 'late' | 'graded';
  grade?: number;
  feedback?: string;
  file?: string;
}

const Assignments: React.FC<AssignmentsProps> = ({ user }) => {
  const isTeacher = user.role === 'teacher';
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Teacher view assignments
  const teacherAssignments: Assignment[] = [];

  // Student view assignments
  const studentAssignments: Assignment[] = [];

  const assignments = isTeacher ? teacherAssignments : studentAssignments;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'essay': return '✍️';
      case 'grammar': return '📝';
      case 'vocabulary': return '📚';
      case 'listening': return '👂';
      case 'speaking': return '🎤';
      case 'reading': return '📖';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'on-time':
      case 'graded':
        return 'text-success';
      case 'late':
        return 'text-error';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-secondary';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return `${Math.abs(diff)} days overdue`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return '1 day remaining';
    return `${diff} days remaining`;
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'pending' && (!assignment.status || assignment.status === 'pending')) ||
      (filter === 'submitted' && assignment.status === 'submitted') ||
      (filter === 'graded' && assignment.status === 'graded');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="assignments">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Assignments</h1>
        <p className="text-secondary">
          {isTeacher ? 'Create and manage student assignments' : 'View and submit your assignments'}
        </p>
      </div>

      {/* Toolbar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-3 text-muted" />
              <input
                type="text"
                placeholder="Search assignments..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
          {isTeacher && (
            <button className="btn btn-primary">
              <Plus size={16} />
              Create Assignment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Assignment List */}
        <div className="col-span-2">
          <div className="space-y-4">
            {filteredAssignments.map(assignment => (
              <div
                key={assignment.id}
                onClick={() => setSelectedAssignment(assignment)}
                className={`card cursor-pointer hover:shadow-md ${
                  selectedAssignment?.id === assignment.id ? 'border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getTypeIcon(assignment.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-secondary mt-1">{assignment.description}</p>

                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-secondary flex items-center gap-1">
                            <Calendar size={12} />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-secondary">
                            Level: {assignment.level}
                          </span>
                          <span className="text-xs text-secondary">
                            {assignment.points} points
                          </span>
                        </div>

                        {isTeacher ? (
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-secondary" />
                              <span className="text-sm">
                                {assignment.submittedCount}/{assignment.totalStudents} submitted
                              </span>
                            </div>
                            <div className="progress-bar" style={{ width: '100px' }}>
                              <div
                                className="progress-fill"
                                style={{ width: `${((assignment.submittedCount || 0) / (assignment.totalStudents || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          assignment.status && (
                            <div className="flex items-center gap-4 mt-3">
                              <span className={`text-sm capitalize ${getStatusColor(assignment.status)}`}>
                                {assignment.status === 'graded' && assignment.grade !== undefined
                                  ? `Graded: ${assignment.grade}/${assignment.points}`
                                  : assignment.status}
                              </span>
                              {assignment.status === 'pending' && (
                                <span className="text-xs text-warning">
                                  {getDaysRemaining(assignment.dueDate)}
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {isTeacher ? (
                      <>
                        <button className="tool-btn">
                          <Eye size={18} />
                        </button>
                        <button className="tool-btn">
                          <Download size={18} />
                        </button>
                      </>
                    ) : (
                      assignment.status === 'pending' && (
                        <button className="btn btn-primary">
                          <Upload size={14} />
                          Submit
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Details Sidebar */}
        <div>
          {selectedAssignment ? (
            <div className="card">
              <h3 className="font-semibold mb-4">Assignment Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-secondary">Type</label>
                  <p className="capitalize">{selectedAssignment.type}</p>
                </div>

                <div>
                  <label className="text-xs text-secondary">Due Date</label>
                  <p>{new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p className="text-xs text-warning mt-1">{getDaysRemaining(selectedAssignment.dueDate)}</p>
                </div>

                <div>
                  <label className="text-xs text-secondary">Points</label>
                  <p>{selectedAssignment.points}</p>
                </div>

                {isTeacher && selectedAssignment.submissions && (
                  <div>
                    <label className="text-xs text-secondary mb-2 block">Recent Submissions</label>
                    <div className="space-y-2">
                      {selectedAssignment.submissions.slice(0, 3).map(submission => (
                        <div key={submission.id} className="p-2 border rounded text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{submission.studentName}</span>
                            <span className={`text-xs ${getStatusColor(submission.status)}`}>
                              {submission.status}
                            </span>
                          </div>
                          {submission.grade !== undefined && (
                            <div className="text-xs text-secondary mt-1">
                              Grade: {submission.grade}/{selectedAssignment.points}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isTeacher && selectedAssignment.feedback && (
                  <div>
                    <label className="text-xs text-secondary mb-2 block">Teacher Feedback</label>
                    <div className="p-3 bg-surface rounded">
                      <p className="text-sm">{selectedAssignment.feedback}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  {isTeacher ? (
                    <button className="btn btn-primary w-full">
                      <MessageSquare size={16} />
                      Grade Submissions
                    </button>
                  ) : selectedAssignment.status === 'pending' ? (
                    <button className="btn btn-primary w-full">
                      <Upload size={16} />
                      Upload Submission
                    </button>
                  ) : (
                    <button className="btn btn-secondary w-full">
                      <Eye size={16} />
                      View Submission
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-8">
                <FileText size={48} className="text-muted mx-auto mb-4" />
                <p className="text-secondary">Select an assignment to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;