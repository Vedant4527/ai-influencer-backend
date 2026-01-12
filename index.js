app.post("/api/scan-instagram", async (req, res) => {
  const { username } = req.body;

  // Mock Instagram metrics (MVP)
  const followers = 54000;
  const avgLikes = 320;
  const avgComments = 8;

  const engagementRate = ((avgLikes + avgComments) / followers) * 100;

  let fakeScore = 0;
  let reasons = [];

  // Rule 1: Low engagement
  if (engagementRate < 0.5) {
    fakeScore += 30;
    reasons.push("Very low engagement rate");
  }

  // Rule 2: Sudden follower spike (mock)
  const suddenSpike = true;
  if (suddenSpike) {
    fakeScore += 25;
    reasons.push("Sudden follower growth spike");
  }

  // Rule 3: Repeated comments (mock)
  const repeatedComments = true;
  if (repeatedComments) {
    fakeScore += 20;
    reasons.push("Repeated comments from same accounts");
  }

  // Rule 4: Follow/Unfollow (mock)
  const followUnfollow = false;
  if (followUnfollow) {
    fakeScore += 15;
    reasons.push("Mass follow-unfollow behavior");
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
