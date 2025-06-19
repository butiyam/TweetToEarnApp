"use client";
import { useState } from "react";
import  Button  from "./Button";
import  Input  from "./Input";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TweetForm({ onSuccess }: { onSuccess: () => void }) {
  const [tweetUrl, setTweetUrl] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [points, setPoints] = useState(120);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateTweet = () => {
     if (
       tweetUrl.includes("@ProjectX") &&
       tweetUrl.includes("#ProjectX") &&
       tweetUrl.includes("#Web3Earnings") &&
       tweetUrl.includes("#TweetToEarn")
     ) {
       setStatus("✅ Tweet is valid! You've earned 10 points.");
       setPoints(points + 10);
     } else {
       setStatus("❌ Invalid tweet. Please include the handle and all hashtags.");
     }
   };


  return (
      <div>
        <Input
          placeholder="Paste your tweet URL here..."
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.target.value)}
        />
        <Button onClick={validateTweet}>✅ Validate Tweet</Button>
        <div>      {error && <p className="text-red-500 text-sm">{error}</p>}</div>
      </div>

  );
}

// ✅ Simulated tweet fetcher (mock)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchTweetContent(url: string): Promise<string> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1000));

  // You'd replace this with real scraping later
  const fakeTweet = "@ProjectX We are going viral! #EarnX #Crypto #TweetToEarn";
  return fakeTweet;
}
