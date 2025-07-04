import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateEducationalResponse, generateQuizQuestions, analyzeStudentProgress } from "./services/gemini";
import { insertUserSchema, insertCourseSchema, insertLessonSchema, insertEnrollmentSchema, insertLeadSchema, insertQuizSchema, insertQuizAttemptSchema } from "@shared/schema";

// Middleware to check if user is admin
const requireAdmin = (req: any, res: any, next: any) => {
  const userRole = req.user?.claims?.role;
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to check if user is teacher or admin
const requireTeacher = (req: any, res: any, next: any) => {
  const userRole = req.user?.claims?.role;
  if (userRole !== 'teacher' && userRole !== 'admin') {
    return res.status(403).json({ message: 'Teacher access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Courses routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
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
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Failed to fetch course' });
    }
  });

  app.post('/api/courses', isAuthenticated, requireTeacher, async (req: any, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse({
        ...courseData,
        teacherId: req.user.claims.sub
      });
      res.status(201).json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  });

  app.put('/api/courses/:id', isAuthenticated, requireTeacher, async (req: any, res) => {
    try {
      const courseData = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(req.params.id, courseData);
      res.json(course);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Failed to update course' });
    }
  });

  app.delete('/api/courses/:id', isAuthenticated, requireTeacher, async (req, res) => {
    try {
      await storage.deleteCourse(req.params.id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Failed to delete course' });
    }
  });

  // Lessons routes
  app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
      const lessons = await storage.getLessonsByCourse(req.params.courseId);
      res.json(lessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ message: 'Failed to fetch lessons' });
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
      console.error('Error fetching lesson:', error);
      res.status(500).json({ message: 'Failed to fetch lesson' });
    }
  });

  app.post('/api/lessons', isAuthenticated, requireTeacher, async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      console.error('Error creating lesson:', error);
      res.status(500).json({ message: 'Failed to create lesson' });
    }
  });

  app.put('/api/lessons/:id', isAuthenticated, requireTeacher, async (req, res) => {
    try {
      const lessonData = insertLessonSchema.partial().parse(req.body);
      const lesson = await storage.updateLesson(req.params.id, lessonData);
      res.json(lesson);
    } catch (error) {
      console.error('Error updating lesson:', error);
      res.status(500).json({ message: 'Failed to update lesson' });
    }
  });

  app.delete('/api/lessons/:id', isAuthenticated, requireTeacher, async (req, res) => {
    try {
      await storage.deleteLesson(req.params.id);
      res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      res.status(500).json({ message: 'Failed to delete lesson' });
    }
  });

  // Enrollments routes
  app.get('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByUser(req.user.claims.sub);
      res.json(enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      res.status(500).json({ message: 'Failed to fetch enrollments' });
    }
  });

  app.post('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(req.user.claims.sub, enrollmentData.courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      const enrollment = await storage.createEnrollment({
        ...enrollmentData,
        userId: req.user.claims.sub
      });
      res.status(201).json(enrollment);
    } catch (error) {
      console.error('Error creating enrollment:', error);
      res.status(500).json({ message: 'Failed to create enrollment' });
    }
  });

  // Progress tracking routes
  app.get('/api/progress/lesson/:lessonId', isAuthenticated, async (req: any, res) => {
    try {
      const progress = await storage.getLessonProgress(req.user.claims.sub, req.params.lessonId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      res.status(500).json({ message: 'Failed to fetch lesson progress' });
    }
  });

  app.post('/api/progress/lesson/:lessonId', isAuthenticated, async (req: any, res) => {
    try {
      const progressData = req.body;
      const progress = await storage.updateLessonProgress(req.user.claims.sub, req.params.lessonId, progressData);
      res.json(progress);
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      res.status(500).json({ message: 'Failed to update lesson progress' });
    }
  });

  // Quiz routes
  app.get('/api/lessons/:lessonId/quizzes', async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByLesson(req.params.lessonId);
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
  });

  app.post('/api/quizzes', isAuthenticated, requireTeacher, async (req, res) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ message: 'Failed to create quiz' });
    }
  });

  app.post('/api/quiz-attempts', isAuthenticated, async (req: any, res) => {
    try {
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt({
        ...attemptData,
        userId: req.user.claims.sub
      });
      res.status(201).json(attempt);
    } catch (error) {
      console.error('Error creating quiz attempt:', error);
      res.status(500).json({ message: 'Failed to create quiz attempt' });
    }
  });

  // AI Chat routes
  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, sessionId } = req.body;
      
      // Generate AI response
      const aiResponse = await generateEducationalResponse(message);
      
      // Save or update chat session
      if (sessionId) {
        await storage.updateAiChatSession(sessionId, {
          lastMessage: message,
          lastResponse: aiResponse.response
        });
      } else {
        const session = await storage.createAiChatSession({
          userId: req.user.claims.sub,
          lastMessage: message,
          lastResponse: aiResponse.response,
          subject: aiResponse.subject || 'general'
        });
        aiResponse.sessionId = session.id;
      }
      
      res.json(aiResponse);
    } catch (error) {
      console.error('Error in AI chat:', error);
      res.status(500).json({ message: 'Failed to process AI request' });
    }
  });

  app.get('/api/ai/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const sessions = await storage.getAiChatSessions(req.user.claims.sub);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching AI sessions:', error);
      res.status(500).json({ message: 'Failed to fetch AI sessions' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      // For now, return empty array - would need to implement getUsers method
      res.json([]);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get('/api/admin/leads', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });

  app.put('/api/admin/leads/:id', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const leadData = req.body;
      const lead = await storage.updateLead(req.params.id, leadData);
      res.json(lead);
    } catch (error) {
      console.error('Error updating lead:', error);
      res.status(500).json({ message: 'Failed to update lead' });
    }
  });

  // Lead form submission (public)
  app.post('/api/leads', async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      console.error('Error creating lead:', error);
      res.status(500).json({ message: 'Failed to create lead' });
    }
  });

  // Placeholder image endpoint
  app.get('/api/placeholder/:width/:height', (req, res) => {
    const { width, height } = req.params;
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#666">
          ${width}x${height}
        </text>
      </svg>
    `;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  const httpServer = createServer(app);
  return httpServer;
}