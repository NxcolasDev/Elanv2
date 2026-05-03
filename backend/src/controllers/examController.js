exports.generateExam = async (req, res) => {
  const { type, task, mode } = req.body;

  return res.json({
    type,
    task,
    mode,
    question:
      task === "writing"
        ? "Discuss the impact of technology in education."
        : "Sample question generated."
  });
};