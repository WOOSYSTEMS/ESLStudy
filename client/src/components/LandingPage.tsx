import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  BookOpen,
  Mic,
  Video,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import axios from 'axios';

interface LandingPageProps {
  setStudent: (student: any) => void;
  language: 'en' | 'ko';
}

const LandingPage: React.FC<LandingPageProps> = ({ setStudent, language }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      hero: {
        title: 'Master English with',
        highlight: 'ESL Academy',
        subtitle: 'Interactive lessons, real-time pronunciation practice, and personalized learning paths designed for Korean students',
        cta: 'Start Learning Free',
        demo: 'Watch Demo'
      },
      features: {
        title: 'Everything You Need to',
        highlight: 'Succeed',
        items: [
          {
            icon: BookOpen,
            title: 'Interactive Lessons',
            description: 'Engaging content with Korean translations and cultural context'
          },
          {
            icon: Mic,
            title: 'AI Pronunciation',
            description: 'Real-time speech recognition with instant feedback'
          },
          {
            icon: Video,
            title: 'Video Practice',
            description: 'Record yourself and practice with partners online'
          },
          {
            icon: Sparkles,
            title: 'Smart Flashcards',
            description: 'Adaptive learning system that remembers your progress'
          }
        ]
      },
      stats: [
        { value: '10,000+', label: 'Active Students' },
        { value: '95%', label: 'Success Rate' },
        { value: '500+', label: 'Lessons' },
        { value: '24/7', label: 'Support' }
      ],
      register: {
        title: 'Create Your Free Account',
        name: 'Full Name',
        email: 'Email Address',
        level: 'Select Your Level',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        submit: 'Start Learning',
        terms: 'By signing up, you agree to our Terms and Privacy Policy'
      }
    },
    ko: {
      hero: {
        title: '영어 마스터하기',
        highlight: 'ESL 아카데미',
        subtitle: '한국 학생을 위한 대화형 수업, 실시간 발음 연습, 맞춤형 학습 경로',
        cta: '무료로 시작하기',
        demo: '데모 보기'
      },
      features: {
        title: '성공을 위한',
        highlight: '모든 것',
        items: [
          {
            icon: BookOpen,
            title: '대화형 수업',
            description: '한국어 번역과 문화적 맥락이 포함된 흥미로운 콘텐츠'
          },
          {
            icon: Mic,
            title: 'AI 발음',
            description: '즉각적인 피드백을 제공하는 실시간 음성 인식'
          },
          {
            icon: Video,
            title: '비디오 연습',
            description: '자신을 녹화하고 온라인으로 파트너와 연습'
          },
          {
            icon: Sparkles,
            title: '스마트 플래시카드',
            description: '진행 상황을 기억하는 적응형 학습 시스템'
          }
        ]
      },
      stats: [
        { value: '10,000+', label: '활성 학생' },
        { value: '95%', label: '성공률' },
        { value: '500+', label: '수업' },
        { value: '24/7', label: '지원' }
      ],
      register: {
        title: '무료 계정 만들기',
        name: '이름',
        email: '이메일 주소',
        level: '레벨 선택',
        beginner: '초급',
        intermediate: '중급',
        advanced: '고급',
        submit: '학습 시작',
        terms: '가입하면 이용 약관 및 개인정보 보호정책에 동의하게 됩니다'
      }
    }
  };

  const t = translations[language];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="px-6 py-20 lg:py-32"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-8"
              >
                <GraduationCap className="text-white" size={40} />
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
                {t.hero.title}{' '}
                <span className="text-gradient">{t.hero.highlight}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                {t.hero.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  {t.hero.cta}
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20"
                >
                  {t.hero.demo}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {t.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                {t.features.title} <span className="text-gradient">{t.features.highlight}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.features.items.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Registration Modal */}
      {showRegister && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t.register.title}
              </h2>
              <button
                onClick={() => setShowRegister(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.register.name}
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
                  {t.register.email}
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
                  {t.register.level}
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="input-modern"
                >
                  <option value="beginner">{t.register.beginner}</option>
                  <option value="intermediate">{t.register.intermediate}</option>
                  <option value="advanced">{t.register.advanced}</option>
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
                    {t.register.submit}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t.register.terms}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;