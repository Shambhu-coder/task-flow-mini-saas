const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getStats,
} = require('../controllers/taskController');

// All routes protected by verifyToken
router.use(verifyToken);

router.get('/', getTasks);
router.get('/stats', getStats);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;
