import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateEducationalResponse, generateQuizQuestions, analyzeStudentProgress } from "./services/gemini";
import { insertUserSchema, insertCourseSchema, insertLessonSchema, insertEnrollmentSchema, insertLeadSchema, insertQuizSchema, insertQuizAttemptSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to check if user is teacher or admin
const requireTeacher = (req: any, res: any, next: any) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Teacher access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Failed to login' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImageUrl: user.profileImageUrl
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user' });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ message: 'Failed to get courses' });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json({ message: 'Failed to get course' });
    }
  });

  app.post('/api/courses', authenticateToken, requireTeacher, async (req: any, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse({
        ...courseData,
        teacherId: req.user.id
      });
      res.status(201).json(course);
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  });

  // Lesson routes
  app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
      const lessons = await storage.getLessonsByCourse(req.params.courseId);
      res.json(lessons);
    } catch (error) {
      console.error('Get lessons error:', error);
      res.status(500).json({ message: 'Failed to get lessons' });
    }
  });

  app.get('/api/lessons/:id', async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      res.json(lesson);
    } catch (error) {
      console.error('Get lesson error:', error);
      res.status(500).json({ message: 'Failed to get lesson' });
    }
  });

  app.post('/api/lessons', authenticateToken, requireTeacher, async (req: any, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      console.error('Create lesson error:', error);
      res.status(500).json({ message: 'Failed to create lesson' });
    }
  });

  // Enrollment routes
  app.get('/api/my-enrollments', authenticateToken, async (req: any, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByUser(req.user.id);
      res.json(enrollments);
    } catch (error) {
      console.error('Get enrollments error:', error);
      res.status(500).json({ message: 'Failed to get enrollments' });
    }
  });

  app.post('/api/enrollments', authenticateToken, async (req: any, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(req.user.id, enrollmentData.courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      const enrollment = await storage.createEnrollment({
        ...enrollmentData,
        userId: req.user.id
      });
      res.status(201).json(enrollment);
    } catch (error) {
      console.error('Create enrollment error:', error);
      res.status(500).json({ message: 'Failed to create enrollment' });
    }
  });

  // Lesson progress routes
  app.post('/api/lessons/:lessonId/progress', authenticateToken, async (req: any, res) => {
    try {
      const { watchTime, isCompleted } = req.body;
      
      const progress = await storage.updateLessonProgress(req.user.id, req.params.lessonId, {
        watchTime,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined
      });
      
      res.json(progress);
    } catch (error) {
      console.error('Update lesson progress error:', error);
      res.status(500).json({ message: 'Failed to update lesson progress' });
    }
  });

  // Quiz routes
  app.get('/api/lessons/:lessonId/quizzes', async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByLesson(req.params.lessonId);
      res.json(quizzes);
    } catch (error) {
      console.error('Get quizzes error:', error);
      res.status(500).json({ message: 'Failed to get quizzes' });
    }
  });

  app.post('/api/quizzes', authenticateToken, requireTeacher, async (req: any, res) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      console.error('Create quiz error:', error);
      res.status(500).json({ message: 'Failed to create quiz' });
    }
  });

  app.post('/api/quizzes/:quizId/attempts', authenticateToken, async (req: any, res) => {
    try {
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt({
        ...attemptData,
        userId: req.user.id,
        quizId: req.params.quizId
      });
      res.status(201).json(attempt);
    } catch (error) {
      console.error('Create quiz attempt error:', error);
      res.status(500).json({ message: 'Failed to create quiz attempt' });
    }
  });

  // AI Chat routes
  app.post('/api/ai/chat', authenticateToken, async (req: any, res) => {
    try {
      const { message, context } = req.body;
      
      const aiResponse = await generateEducationalResponse(message, context);
      
      // Save chat session
      const chatSession = await storage.createAiChatSession({
        userId: req.user.id,
        messages: [
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: aiResponse.response, timestamp: new Date() }
        ]
      });
      
      res.json({
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions,
        sessionId: chatSession.id
      });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ message: 'Failed to process AI request' });
    }
  });

  app.post('/api/ai/generate-quiz', authenticateToken, requireTeacher, async (req: any, res) => {
    try {
      const { topic, difficulty, questionCount } = req.body;
      
      const quiz = await generateQuizQuestions(topic, difficulty, questionCount);
      
      res.json(quiz);
    } catch (error) {
      console.error('Generate quiz error:', error);
      res.status(500).json({ message: 'Failed to generate quiz' });
    }
  });

  app.post('/api/ai/analyze-progress', authenticateToken, async (req: any, res) => {
    try {
      const { completedLessons, totalLessons, quizScores, timeSpent } = req.body;
      
      const analysis = await analyzeStudentProgress(completedLessons, totalLessons, quizScores, timeSpent);
      
      res.json(analysis);
    } catch (error) {
      console.error('Analyze progress error:', error);
      res.status(500).json({ message: 'Failed to analyze progress' });
    }
  });

  // Lead generation routes
  app.post('/api/leads', async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      console.error('Create lead error:', error);
      res.status(500).json({ message: 'Failed to create lead' });
    }
  });

  app.get('/api/leads', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error('Get leads error:', error);
      res.status(500).json({ message: 'Failed to get leads' });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      // This would implement comprehensive admin statistics
      res.json({
        totalUsers: 0,
        totalCourses: 0,
        totalLessons: 0,
        totalEnrollments: 0,
        recentLeads: []
      });
    } catch (error) {
      console.error('Get admin stats error:', error);
      res.status(500).json({ message: 'Failed to get admin stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
