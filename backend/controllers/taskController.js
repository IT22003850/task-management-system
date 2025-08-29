const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, assignedTo, status } = req.body;
    const task = new Task({
      title,
      description,
      deadline,
      assignedTo,
      status,
      userId: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    Object.assign(task, req.body, { updatedAt: Date.now() });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.deleteOne();
    res.status(204).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

