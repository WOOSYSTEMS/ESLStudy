import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Filter,
  Download
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  students: number;
  lessons: number;
  hours: number;
  completionRate: number;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Sample data
  const overviewStats = {
    totalStudents: 0,
    activeStudents: 0,
    totalLessons: 0,
    avgAttendance: 0,
    avgProgress: 0,
    completionRate: 0,
    studentGrowth: '+0%',
    attendanceTrend: '+0%',
    engagementScore: 0
  };

  const weeklyData: AnalyticsData[] = [];

  const studentPerformance: any[] = [];

  const lessonStatistics: any[] = [];

  const skillDistribution: any[] = [];

  const getMaxValue = (data: AnalyticsData[], key: keyof AnalyticsData) => {
    return Math.max(...data.map(d => d[key] as number));
  };

  return (
    <div className="analytics">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Analytics Dashboard</h1>
        <p className="text-secondary">Track performance and insights</p>
      </div>

      {/* Controls */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              className="select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="students">Student Performance</option>
              <option value="lessons">Lesson Analytics</option>
              <option value="skills">Skill Distribution</option>
            </select>
            <select
              className="select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Users size={20} className="text-secondary" />
            <span className="text-xs text-success">{overviewStats.studentGrowth}</span>
          </div>
          <div className="text-2xl font-semibold">{overviewStats.totalStudents}</div>
          <div className="text-sm text-secondary">Total Students</div>
          <div className="text-xs text-muted mt-1">{overviewStats.activeStudents} active</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <BookOpen size={20} className="text-secondary" />
            <Activity size={16} className="text-accent" />
          </div>
          <div className="text-2xl font-semibold">{overviewStats.totalLessons}</div>
          <div className="text-sm text-secondary">Total Lessons</div>
          <div className="text-xs text-muted mt-1">This {timeRange}</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Target size={20} className="text-secondary" />
            <span className="text-xs text-success">{overviewStats.attendanceTrend}</span>
          </div>
          <div className="text-2xl font-semibold">{overviewStats.avgAttendance}%</div>
          <div className="text-sm text-secondary">Avg Attendance</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{ width: `${overviewStats.avgAttendance}%` }} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Award size={20} className="text-secondary" />
            <TrendingUp size={16} className="text-success" />
          </div>
          <div className="text-2xl font-semibold">{overviewStats.engagementScore}/10</div>
          <div className="text-sm text-secondary">Engagement Score</div>
          <div className="text-xs text-muted mt-1">Above average</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="col-span-2 card">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Day</span>
              <div className="flex items-center gap-8 text-xs">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded" />
                  Students
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded" />
                  Lessons
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning rounded" />
                  Completion
                </span>
              </div>
            </div>

            {weeklyData.map((day) => (
              <div key={day.period} className="flex items-center gap-4">
                <span className="text-sm w-12">{day.period}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-surface rounded-full h-6 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-accent rounded-full"
                      style={{ width: `${(day.students / getMaxValue(weeklyData, 'students')) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted w-8">{day.students}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-surface rounded-full h-6 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-success rounded-full"
                      style={{ width: `${(day.lessons / getMaxValue(weeklyData, 'lessons')) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted w-8">{day.lessons}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-surface rounded-full h-6 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-warning rounded-full"
                      style={{ width: `${day.completionRate}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted w-10">{day.completionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Top Performers</h2>
          <div className="space-y-3">
            {studentPerformance.slice(0, 5).map((student, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface border flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted">{student.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{student.progress}%</p>
                  <p className="text-xs text-success">{student.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Lesson Types */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Lesson Type Performance</h2>
          <div className="space-y-3">
            {lessonStatistics.map(lesson => (
              <div key={lesson.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{lesson.type}</span>
                  <div className="flex items-center gap-4 text-xs">
                    <span>{lesson.count} lessons</span>
                    <span className="text-secondary">Avg: {lesson.avgScore}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface rounded-full h-2">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${lesson.popularity}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted">{lesson.popularity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Skill Level Distribution</h2>
          <div className="space-y-3">
            {skillDistribution.map(skill => (
              <div key={skill.skill} className="space-y-2">
                <p className="text-sm font-medium">{skill.skill}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex rounded-full overflow-hidden h-6">
                    <div
                      className="bg-error"
                      style={{ width: `${skill.beginner}%` }}
                      title={`Beginner: ${skill.beginner}%`}
                    />
                    <div
                      className="bg-warning"
                      style={{ width: `${skill.intermediate}%` }}
                      title={`Intermediate: ${skill.intermediate}%`}
                    />
                    <div
                      className="bg-success"
                      style={{ width: `${skill.advanced}%` }}
                      title={`Advanced: ${skill.advanced}%`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>B: {skill.beginner}%</span>
                  <span>I: {skill.intermediate}%</span>
                  <span>A: {skill.advanced}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-around text-xs">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-error rounded" />
                Beginner
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded" />
                Intermediate
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded" />
                Advanced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;