// // In task router (src/router/task.ts or src/router/task/index.ts)
// import express from 'express';
// import { isAuthenticated, hasRole } from '../middleware';
// import { getTasks, createTask, deleteTask, editTask } from '../controllers/taskcontroller';

// const router = express.Router();

// // Routes for task management
// router.get('/tasks', isAuthenticated, hasRole('worker', 'get'), getTasks);
// router.post('/tasks', isAuthenticated, hasRole('worker', 'post'), createTask);
// router.delete('/tasks/:id', isAuthenticated, hasRole('manager', 'delete'), deleteTask);
// router.patch('/tasks/:id', isAuthenticated, hasRole('manager', 'patch'), editTask);

// // Exporting router as a named export
// export { router as tasksRouter };
