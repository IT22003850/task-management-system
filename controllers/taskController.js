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
    const { search, status } = req.query;
    let query = { userId: req.user.id };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }
    const tasks = await Task.find(query).sort({ deadline: 1 });
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
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Task Report', { align: 'center' });
    doc.moveDown();
    tasks.forEach((task, index) => {
      doc.fontSize(12).text(`${index + 1}. ${task.title}`);
      doc.text(`Description: ${task.description}`);
      doc.text(`Deadline: ${new Date(task.deadline).toLocaleDateString()}`);
      doc.text(`Assigned To: ${task.assignedTo}`);
      doc.text(`Status: ${task.status}`);
      doc.moveDown();
    });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};