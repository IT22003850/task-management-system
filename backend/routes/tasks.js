const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const taskController = require('../controllers/taskController');

router.use(ensureAuthenticated);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/pdf', taskController.generatePDF);

module.exports = router;