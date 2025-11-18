import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Target,
  FileText,
  Video,
  Mic,
  Edit,
  Trash2,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  level: string;
  duration: number;
  objectives: string[];
  materials: string[];
  activities: Activity[];
  homework: string;
  notes: string;
  createdDate: string;
  lastUsed: string;
  timesUsed: number;
}

interface Activity {
  id: string;
  name: string;
  type: 'speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'vocabulary';
  duration: number;
  description: string;
}

const LessonPlanner: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [lessons] = useState<Lesson[]>([]);

  const lessonTemplates = [
    { name: 'Grammar Focus', icon: BookOpen, description: 'Structure-based lesson plan' },
    { name: 'Conversation Practice', icon: Mic, description: 'Speaking-focused activities' },
    { name: 'TOEFL Preparation', icon: Target, description: 'Test prep strategies' },
    { name: 'Business English', icon: FileText, description: 'Professional communication' },
    { name: 'Pronunciation Lab', icon: Mic, description: 'Sound and intonation practice' },
    { name: 'Cultural Topics', icon: Users, description: 'Cross-cultural discussions' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'speaking': return <Mic size={14} />;
      case 'listening': return '👂';
      case 'reading': return <BookOpen size={14} />;
      case 'writing': return <Edit size={14} />;
      case 'grammar': return <FileText size={14} />;
      case 'vocabulary': return '📝';
      default: return <BookOpen size={14} />;
    }
  };

  return (
    <div className="lesson-planner">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Lesson Planner</h1>
        <p className="text-secondary">Create and organize your teaching materials</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel - Lesson List */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">My Lessons</h2>
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                New
              </button>
            </div>

            <div className="space-y-2">
              {lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-surface ${
                    selectedLesson?.id === lesson.id ? 'bg-surface border-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{lesson.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-secondary">{lesson.level}</span>
                        <span className="text-xs text-muted">•</span>
                        <span className="text-xs text-secondary">{lesson.duration} min</span>
                      </div>
                      <div className="text-xs text-muted mt-1">
                        Used {lesson.timesUsed} times • {lesson.lastUsed}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="card">
            <h3 className="font-semibold mb-3">Templates</h3>
            <div className="space-y-2">
              {lessonTemplates.map((template, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 border rounded-lg hover:bg-surface flex items-center gap-3"
                >
                  <template.icon size={18} className="text-secondary" />
                  <div>
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="text-xs text-muted">{template.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right - Lesson Details */}
        <div className="col-span-2">
          {selectedLesson ? (
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{selectedLesson.title}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-secondary flex items-center gap-1">
                      <Users size={14} />
                      {selectedLesson.level}
                    </span>
                    <span className="text-sm text-secondary flex items-center gap-1">
                      <Clock size={14} />
                      {selectedLesson.duration} minutes
                    </span>
                    <span className="text-sm text-secondary flex items-center gap-1">
                      <Calendar size={14} />
                      Created {selectedLesson.createdDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="tool-btn">
                    <Edit size={18} />
                  </button>
                  <button className="tool-btn">
                    <Copy size={18} />
                  </button>
                  <button className="tool-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Objectives */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {selectedLesson.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={16} className="text-success mt-0.5" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Materials Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.materials.map((material, idx) => (
                    <span key={idx} className="px-3 py-1 bg-surface border rounded-full text-sm">
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Lesson Activities</h3>
                <div className="space-y-3">
                  {selectedLesson.activities.map((activity, idx) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.name}</h4>
                          <span className="text-sm text-secondary">{activity.duration} min</span>
                        </div>
                        <p className="text-sm text-secondary mt-1">{activity.description}</p>
                        <span className="text-xs text-muted capitalize mt-2 inline-block">
                          {activity.type} activity
                        </span>
                      </div>
                      <div className="text-sm text-muted">
                        {idx + 1}/{selectedLesson.activities.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Homework Assignment</h3>
                <div className="p-3 bg-surface rounded-lg">
                  <p className="text-sm">{selectedLesson.homework}</p>
                </div>
              </div>

              {/* Teacher Notes */}
              <div>
                <h3 className="font-semibold mb-3">Teaching Notes</h3>
                <div className="p-3 bg-surface rounded-lg">
                  <p className="text-sm text-secondary">{selectedLesson.notes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                <button className="btn btn-primary">
                  <Video size={16} />
                  Start Teaching
                </button>
                <button className="btn btn-secondary">
                  <FileText size={16} />
                  Print Lesson Plan
                </button>
                <button className="btn btn-secondary">
                  Share with Team
                </button>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center">
              <div className="text-center">
                <BookOpen size={48} className="text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Lesson</h3>
                <p className="text-secondary mb-4">Choose a lesson from the list to view details</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  Create New Lesson
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;