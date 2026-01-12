import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check (Railway needs this)
app.get("/", (req, res) => {
  res.status(200).send("Backend is running 🚀");
});

// Scan Instagram (FAKE FOLLOWER SCORING)
app.post("/api/scan-instagram", async (req, res) => {
  const { username } = req.body;

  // Mock Instagram metrics (MVP)
  const followers = 54000;
  const avgLikes = 320;
  const avgComments = 8;

  const engagementRate = ((avgLikes + avgComments) / followers) * 100;

  let fakeScore = 0;
  let reasons = [];

  if (engagementRate < 0.5) {
    fakeScore += 30;
    reasons.push("Very low engagement rate");
  }

  const suddenSpike = true;
  if (suddenSpike) {
    fakeScore += 25;
    reasons.push("Sudden follower growth spike");
  }

  const repeatedComments = true;
  if (repeatedComments) {
    fakeScore += 20;
    reasons.push("Repeated comments from same accounts");
  }

  if (fakeScore > 100) fakeScore = 100;

  let risk = "LOW";
  if (fakeScore > 70) risk = "HIGH";
  else if (fakeScore > 40) risk = "MEDIUM";

  res.json({
    instagram_handle: username,
    followers,
    engagement_rate: engagementRate.toFixed(2),
    fake_score: fakeScore,
    risk,
    reasons
  });
});

// Fetch influencers from Supabase
app.get("/api/influencers", async (req, res) => {
  const { data, error } = await supabase
    .from("influencers")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

// START SERVER (ALWAYS LAST)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

