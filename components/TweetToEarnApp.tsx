"use client";

import { useState, useEffect } from "react";
import  Card from "./ui/Card";
import  CardContent  from "./ui/CardContent";
import  Button  from "./ui/Button";
import  Input  from "./ui/Input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

export default function TweetToEarnApp() {
  const [users, setUsers] = useState<{ username: string; points: number }[]>([]);

  const [tweetUrl, setTweetUrl] = useState("");
  const [user, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("");


  const validateTweet =  async() => {
    try {
      const tweetText = await fetchTweetContent(tweetUrl);
      console.log(tweetText.hashtags);
      setUsername(tweetText.username)
      const hasMention = tweetText.text.includes("@ProjectX");
      const hasAllHashtags = ["ProjectX", "Web3Earnings", "TweetToEarn"].every(tag => tweetText.hashtags.includes(tag));


      if (hasMention && hasAllHashtags) {
       // call on success;

      const tweetRes = await fetch("/api/submit-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tweetId: tweetText.id,
          username: tweetText.username,
          text: tweetText.text,
          hashtags: tweetText.hashtags
        }),
      });

      const resData = await tweetRes.json()

      if(resData.error) {
       setStatus(resData.error) 
      }

      if(resData.message) {
       setStatus(resData.message) 
      }

      const res = await fetch(`/api/user?username=${encodeURIComponent(tweetText.username)}`);
      const data = await res.json();

      if (!res.ok || !data.points) throw new Error(data.error || "Failed to fetch user points");
      setPoints(data.points);


      } else {
        setStatus("Tweet is missing required handle or hashtags.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setStatus("Failed to verify tweet. Make sure the URL is public and valid.");
    }
  };

 interface TweetData {
  id: string;
  text: string;
  username: string;
  hashtags: string[];
}

async function fetchTweetContent(url: string): Promise<TweetData> {
  const res = await fetch("/api/fetch-tweet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data: TweetData & { error?: string } = await res.json();

  if (!res.ok || !data.text) {
    throw new Error(data.error || "Tweet content fetch failed.");
  }

  return data;
}

 useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);


  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🚀 Project X - Tweet to Earn</h1>

      <div className="flex justify-between items-center mb-6">
        <div>👤 {user}</div>
        <div>Points: {points}</div>
        <Button>🌐 Connect Wallet</Button>
      </div>

      <Tabs defaultValue="submit">
        <TabsList>
          <TabsTrigger value="submit">Submit Tweet</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Input
                placeholder="Paste your tweet URL here..."
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
              />
              <Button onClick={validateTweet}>✅ Validate Tweet</Button>
              <div>{status}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines">
          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">📜 Tweet Guidelines</h2>
              <ul className="list-disc list-inside">
                <li>Mention <strong>@ProjectX</strong></li>
                <li>Include hashtags: <code>#ProjectX</code>, <code>#Web3Earnings</code>, <code>#TweetToEarn</code></li>
                <li>Do not copy others&apos; tweets</li>
                <li>1 Tweet = 10 Points</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">🏆 Leaderboard</h2>
              <ol className="space-y-1">
                 {Array.isArray(users) ? (
                  users.map((user, i) => (
                     <li key={user.username} className="border-b py-2 flex justify-between">  
                      <span>#{i + 1} @{user.username}</span>
                      <span>{user.points} pts</span>
                    </li>
                  ))
                ) : (
                  <div>Error loading leaderboard</div>
                )}

              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
