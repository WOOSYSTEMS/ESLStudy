import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  BookOpen,
  Zap,
  Trophy,
  ChevronRight,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
}

interface DashboardProps {
  student: Student | null;
  setStudent: (student: Student) => void;
  language: 'en' | 'ko';
}

interface Progress {
  completedLessons: string[];
  scores: Array<{ lessonId: string; score: number; completedAt: Date }>;
}

const Dashboard: React.FC<DashboardProps> = ({ student, setStudent, language }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('beginner');
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      welcome: 'Welcome to Your Learning Journey',
      enterName: 'Enter your name',
      enterEmail: 'Enter your email',
      selectLevel: 'Select your level',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      start: 'Start Learning',
      hello: 'Welcome back',
      overview: 'Learning Overview',
      completedLessons: 'Lessons Completed',
      averageScore: 'Average Score',
      studyStreak: 'Study Streak',
      level: 'Current Level',
      recentActivity: 'Recent Activity',
      achievements: 'Achievements',
      weeklyProgress: 'Weekly Progress',
      dailyGoal: 'Daily Goal',
      continueLesson: 'Continue Learning',
      viewAll: 'View All',
      stats: {
        time: 'Total Study Time',
        words: 'Words Learned',
        accuracy: 'Pronunciation Accuracy'
      }
    },
    ko: {
      welcome: '학습 여정에 오신 것을 환영합니다',
      enterName: '이름을 입력하세요',
      enterEmail: '이메일을 입력하세요',
      selectLevel: '레벨을 선택하세요',
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급',
      start: '학습 시작',
      hello: '다시 오신 것을 환영합니다',
      overview: '학습 개요',
      completedLessons: '완료된 수업',
      averageScore: '평균 점수',
      studyStreak: '연속 학습',
      level: '현재 레벨',
      recentActivity: '최근 활동',
      achievements: '성과',
      weeklyProgress: '주간 진행',
      dailyGoal: '일일 목표',
      continueLesson: '학습 계속하기',
      viewAll: '모두 보기',
      stats: {
        time: '총 학습 시간',
        words: '학습한 단어',
        accuracy: '발음 정확도'
      }
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (student) {
      fetchProgress();
    }
  }, [student]);

  const fetchProgress = async () => {
    if (!student) return;
    try {
      const response = await axios.get(`http://localhost:5001/api/students/${student.id}/progress`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/students', {
        name,
        email,
        level
      });
      setStudent(response.data);
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-2">{t.welcome}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.enterName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.enterEmail}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.selectLevel}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="input-modern"
              >
                <option value="beginner">{t.beginner}</option>
                <option value="intermediate">{t.intermediate}</option>
                <option value="advanced">{t.advanced}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t.start}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  const averageScore = progress && progress.scores.length > 0
    ? Math.round(progress.scores.reduce((sum, s) => sum + s.score, 0) / progress.scores.length)
    : 0;

  // Sample data for charts
  const weeklyData = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 80 },
    { day: 'Wed', score: 85 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: 90 },
    { day: 'Sat', score: 88 },
    { day: 'Sun', score: 92 }
  ];

  const statsCards = [
    {
      icon: BookOpen,
      title: t.completedLessons,
      value: progress?.completedLessons.length || 0,
      color: 'from-blue-500 to-blue-600',
      change: '+2 this week'
    },
    {
      icon: Trophy,
      title: t.averageScore,
      value: `${averageScore}%`,
      color: 'from-purple-500 to-purple-600',
      change: '+5% improvement'
    },
    {
      icon: Zap,
      title: t.studyStreak,
      value: '7 days',
      color: 'from-orange-500 to-orange-600',
      change: 'Keep it up!'
    },
    {
      icon: Target,
      title: t.level,
      value: student.level,
      color: 'from-green-500 to-green-600',
      change: 'Next: Intermediate'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div className="glass rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {t.hello}, <span className="text-gradient">{student.name}</span>! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You're making great progress! Keep up the excellent work.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary mt-4 md:mt-0 flex items-center gap-2"
          >
            {t.continueLesson}
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{t.weeklyProgress}</h2>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{t.recentActivity}</h2>
            <Activity className="text-purple-600" size={24} />
          </div>
          <div className="space-y-4">
            {[
              { lesson: 'Greetings & Introductions', score: 92, time: '2 hours ago' },
              { lesson: 'Daily Conversations', score: 85, time: '1 day ago' },
              { lesson: 'Numbers and Time', score: 78, time: '2 days ago' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.lesson}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gradient">{activity.score}%</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{t.achievements}</h2>
          <Award className="text-yellow-500" size={24} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔥', title: '7 Day Streak', description: 'Study every day for a week' },
            { icon: '🌟', title: 'Perfect Score', description: 'Score 100% on a lesson' },
            { icon: '🚀', title: 'Fast Learner', description: 'Complete 5 lessons in a day' },
            { icon: '🎯', title: 'Accuracy Master', description: '90% pronunciation accuracy' }
          ].map((achievement, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="font-semibold text-gray-900 dark:text-white">{achievement.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;