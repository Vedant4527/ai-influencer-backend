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

  // -------- MOCK INSTAGRAM METRICS (MVP) --------
  const followers = 54000;
  const avgLikes = 320;
  const avgComments = 8;

  const engagementRate =
    ((avgLikes + avgComments) / followers) * 100;

  let fakeScore = 0;
  let reasons = [];

  // Rule 1: Low engagement
  if (engagementRate < 0.5) {
    fakeScore += 30;
    reasons.push("Low engagement compared to follower count");
  }

  // Rule 2: Sudden follower spike (mock)
  const suddenFollowerSpike = true;
  if (suddenFollowerSpike) {
    fakeScore += 25;
    reasons.push("Sudden follower growth spike detected");
  }

  // Rule 3: Repeated comments (mock)
  const repeatedComments = true;
  if (repeatedComments) {
    fakeScore += 20;
    reasons.push("Repeated comments from same accounts");
  }

  // Rule 4: Follow–unfollow behaviour (mock)
  const followUnfollowPattern = false;
  if (followUnfollowPattern) {
    fakeScore += 15;
    reasons.push("Suspicious follow-unfollow behaviour");
  }

  if (fakeScore > 100) fakeScore = 100;

  let risk = "LOW";
  if (fakeScore >= 70) risk = "HIGH";
  else if (fakeScore >= 40) risk = "MEDIUM";

  res.status(200).json({
    instagram_handle: username,
    followers,
    engagement_rate: engagementRate.toFixed(2) + "%",
    fake_score: fakeScore,
    risk_level: risk,
    reasons
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


