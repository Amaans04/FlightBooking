const axios = require("axios");

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await axios.post(
      "http://localhost:8001/ai/query",
      { question }
    );

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("AI Service Error:", error.message);

    return res.status(500).json({
      error: "AI service failed",
      details: error.response?.data || error.message
    });
  }
};