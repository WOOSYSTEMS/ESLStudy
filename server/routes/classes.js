const router = require('express').Router();
const Class = require('../models/Class');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a new class (teachers only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    const user = await User.findById(req.user.id);
    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create classes' });
    }

    const newClass = new Class({
      ...req.body,
      teacher: req.user.id
    });

    await newClass.save();
    await newClass.populate('teacher', 'name email');

    res.json(newClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all classes for a teacher
router.get('/teacher', auth, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id })
      .populate('students', 'name email level')
      .populate('teacher', 'name email');

    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all classes for a student
router.get('/student', auth, async (req, res) => {
  try {
    const classes = await Class.find({ students: req.user.id })
      .populate('teacher', 'name email')
      .populate('students', 'name email level');

    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join a class using enrollment code (students only)
router.post('/join', auth, async (req, res) => {
  try {
    const { enrollmentCode } = req.body;

    // Check if user is a student
    const user = await User.findById(req.user.id);
    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can join classes' });
    }

    // Find class by enrollment code
    const classToJoin = await Class.findOne({ enrollmentCode: enrollmentCode.toUpperCase() });
    if (!classToJoin) {
      return res.status(404).json({ error: 'Invalid enrollment code' });
    }

    // Check if student is already enrolled
    if (classToJoin.students.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already enrolled in this class' });
    }

    // Check if class is full
    if (classToJoin.students.length >= classToJoin.maxStudents) {
      return res.status(400).json({ error: 'Class is full' });
    }

    // Add student to class
    classToJoin.students.push(req.user.id);
    await classToJoin.save();

    await classToJoin.populate('teacher', 'name email');
    await classToJoin.populate('students', 'name email level');

    res.json(classToJoin);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get class details
router.get('/:id', auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email level lastActive');

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if user has access to this class
    const hasAccess =
      classData.teacher._id.toString() === req.user.id ||
      classData.students.some(s => s._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(classData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove student from class (teacher only)
router.delete('/:classId/students/:studentId', auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId);

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if user is the teacher
    if (classData.teacher.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the teacher can remove students' });
    }

    // Remove student
    classData.students = classData.students.filter(
      s => s.toString() !== req.params.studentId
    );

    await classData.save();
    res.json({ message: 'Student removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;