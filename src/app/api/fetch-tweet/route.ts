import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url }: { url: string } = await req.json();

  if (!url || !url.includes("x.com")) {
    return NextResponse.json({ error: "Invalid Twitter URL" }, { status: 400 });
  }

  try {
    // Get tweet ID from URL
    const match = url.match(/^https?:\/\/(?:www\.)?x\.com\/([a-zA-Z0-9_]+)\/status\/(\d+)/);
    const tweetId = match?.[2];
     const username = match?.[1];
    // console.log(username)
    if (!tweetId) {
      return NextResponse.json({ error: "Invalid tweet URL" }, { status: 400 });
    }

    // Get tweet embed from Twitter oEmbed API
    const res = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    // Extract text from embedded HTML
    const html = data.html as string;
    const textMatch = html.match(/<p[^>]*>(.*?)<\/p>/);
    const tweetHtmlText = textMatch?.[1] || "";
    const tweetText = tweetHtmlText.replace(/<[^>]+>/g, ""); // Remove HTML tags

    // Extract hashtags from tweet text
    const hashtags = [...tweetText.matchAll(/#(\w+)/g)].map((m) => m[1]);

    return NextResponse.json({
      id: tweetId,
      username: username,
      text: tweetText,
      hashtags,
    });
  } catch (err) {
    console.error("Tweet scrape error:", err);
    return NextResponse.json({ error: "Failed to fetch tweet" }, { status: 500 });
  }
}
