import PDFDocument from "pdfkit";
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
app.post("/api/compliance-scan", async (req, res) => {
  const { username } = req.body;

  // Mock last 10 Instagram captions (MVP)
  const captions = [
    "Loved working with this skincare brand!",
    "Daily routine upgrade 💙",
    "Sponsored post for new hair serum",
    "Weekend vibes only ✨",
    "Paid partnership with fitness brand",
    "Trying out new cafe in town",
    "Ad for my favorite shoes",
    "Gym session done right",
    "Collaboration with fashion label",
    "Morning skincare routine"
  ];

  const promoKeywords = [
    "ad",
    "sponsored",
    "paid",
    "partnership",
    "collaboration",
    "collab"
  ];

  const disclosureTags = [
    "#ad",
    "#sponsored",
    "#paid",
    "#paidpartnership"
  ];

  let violations = [];

  captions.forEach((caption, index) => {
    const text = caption.toLowerCase();

    const isPromotional = promoKeywords.some(word =>
      text.includes(word)
    );

    const hasDisclosure = disclosureTags.some(tag =>
      text.includes(tag)
    );

    if (isPromotional && !hasDisclosure) {
      violations.push({
        post_number: index + 1,
        caption: caption,
        issue: "Promotional content without disclosure"
      });
    }
  });

  res.status(200).json({
    instagram_handle: username,
    total_posts_checked: captions.length,
    non_compliant_posts: violations.length,
    compliance_score: `${captions.length - violations.length}/${captions.length}`,
    violations
  });
});
app.get("/api/download-report/:username", (req, res) => {
  const { username } = req.params;

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${username}-influencer-report.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text("AI Influencer Verification Report", {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(12).text(`Instagram Handle: @${username}`);
  doc.text("Market: India");
  doc.moveDown();

  doc.fontSize(14).text("Fake Follower Analysis");
  doc.fontSize(12).text("Fake Score: 75%");
  doc.text("Risk Level: HIGH");
  doc.text("Reason: Sudden follower spike, repeated comments");

  doc.moveDown();
  doc.fontSize(14).text("Compliance Analysis (ASCI)");
  doc.fontSize(12).text("Compliance Score: 6/10");
  doc.text("Non-compliant promotional posts detected");

  doc.moveDown();
  doc.fontSize(10).text(
    "Disclaimer: This report provides risk estimates based on engagement signals and content analysis.",
    { align: "left" }
  );

  doc.end();
});
app.post("/api/match-influencers", async (req, res) => {
  const { niche, city } = req.body;

  const { data, error } = await supabase
    .from("influencers")
    .select("*")
    .eq("niche", niche)
    .eq("city", city)
    .limit(5);

  if (error) return res.status(500).json(error);

  res.json(data);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


