import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Scan Instagram (mock MVP)
app.post("/api/scan-instagram", async (req, res) => {
  const { username } = req.body;

  res.json({
    instagram: username,
    fake_score: 72,
    risk: "HIGH",
    compliance: "3/10 posts non-compliant"
  });
});

// Fetch influencers
app.get("/api/influencers", async (req, res) => {
  const { data, error } = await supabase
    .from("influencers")
    .select("*");

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
