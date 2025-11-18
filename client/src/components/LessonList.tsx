import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Lesson {
  id: string;
  title: string;
  titleKo: string;
  level: string;
}

interface LessonListProps {
  language: 'en' | 'ko';
}

const LessonList: React.FC<LessonListProps> = ({ language }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const translations = {
    en: {
      allLessons: 'All Lessons',
      filterBy: 'Filter by level',
      all: 'All',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      startLesson: 'Start Lesson'
    },
    ko: {
      allLessons: '모든 수업',
      filterBy: '레벨로 필터링',
      all: '전체',
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급',
      startLesson: '수업 시작'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lessons');
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const filteredLessons = filter === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.level === filter);

  return (
    <div className="lesson-list">
      <h2>{t.allLessons}</h2>
      <div className="filter-bar">
        <label>{t.filterBy}: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">{t.all}</option>
          <option value="beginner">{t.beginner}</option>
          <option value="intermediate">{t.intermediate}</option>
          <option value="advanced">{t.advanced}</option>
        </select>
      </div>
      <div className="lessons-grid">
        {filteredLessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <h3>{language === 'en' ? lesson.title : lesson.titleKo}</h3>
            <p className="level-badge">{lesson.level}</p>
            <Link to={`/lessons/${lesson.id}`}>
              <button>{t.startLesson}</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;
