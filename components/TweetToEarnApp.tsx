"use client";
import Image from 'next/image';
import { useState, useEffect } from "react";
import  Card from "./ui/Card";
import  CardContent  from "./ui/CardContent";
import  Button  from "./ui/Button";
import  Input  from "./ui/Input";
import Loader from './Loader';


import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

export default function TweetToEarnApp() {

   const [loading, setLoading] = useState(false);

  // for alpha miners tab
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedCoinAmount, setSelectedCoinAmount] = useState<number | null>(null);
  const [isInGodmode, setIsInGodmode] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  
  const priceList = [
    { usd: 1, coins: 10000 },
    { usd: 10, coins: 100000 },
    { usd: 100, coins: 1000000 },
    { usd: 500, coins: 5000000 },
    { usd: 1000, coins: 10000000 },
    { usd: 5000, coins: 50000000 },
    { usd: 10000, coins: 100000000 },
    { usd: 100000, coins: 1000000000 },
  ];

    const handleBuyClick = () => {
      switchTab();
    setShowPaymentStep(true);
  };

   const handleBuyMoreClick = () => {
    switchTab();
    setShowPaymentStep(true);
    setIsInGodmode(false);
  };

  const handlePaymentSuccess = () => {
    setIsInGodmode(true);
    setShowPaymentStep(false);
  };

   // for beta miners tab
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasJoined, setHasJoined] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [days, setDays] = useState(3);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [questComplete, setQuestComplete] = useState(false);
  const [tweetToEarnUnlocked, setTweetToEarnUnlocked] = useState(false);

  // Simulate referral success
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const successfulReferral = () => {
    setReferrals((prev) => prev + 1);
  };

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setTimeout(() => {
      setHasJoined(true);
      setStartTime(Date.now());
    }, 1000);
  };

  const completeQuest = () => {
    switchTab();
    setQuestComplete(true);
    setTweetToEarnUnlocked(true);
  
        setTimeout(() => {
      setHasJoined(true);
      setStartTime(Date.now());
    }, 1000);

  };

  // usestate for wallet connect and connected
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const [tweetUrl, setTweetUrl] = useState("");
  const [user, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("");



  const fetchUserStats = async() => {

    try {
       const res = await fetch(`/api/userBuyWallet?wallet_address=${encodeURIComponent(address || '')}`);
       const data = await res.json();

      if (!res.ok || !data.points) throw new Error(data.error || "Failed to fetch user points");
      setPoints(data.points);
      setUsername(data.username);

    } catch (error) {
      console.log(error);
      
    }

  }

  const validateTweet =  async() => {
    try {
      const tweetText = await fetchTweetContent(tweetUrl);
      console.log(tweetText.hashtags);
      //setUsername(tweetText.username)
      const hasMention = tweetText.text.includes("@dyfusionchain");
      const hasAllHashtags = ["DyfusionLaunch", "Web3RevolutionNow", "TweetToEarn"].every(tag => tweetText.hashtags.includes(tag));

      if (hasMention && hasAllHashtags) {
       // call on success;

      const tweetRes = await fetch("/api/submit-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tweetId: tweetText.id,
          username: tweetText.username,
          text: tweetText.text,
          hashtags: tweetText.hashtags,
          wallet_address: address,
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

async function switchTab() {

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds
   return () => clearTimeout(timer);
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

  fetchUserStats();

   if (!startTime) return;

    const interval = setInterval(() => {
      const diff = 3 * 24 * 60 * 60 * 1000 - (Date.now() - startTime);
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);

    }, 60000);
    
    return () => clearInterval(interval);

  });


   
  return (
    
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 bg-lightning" >
      <div className="flex justify-between items-center mb-6">
        <div>👤 {user}</div>
        <div className="flex items-center gap-2 text-white-600 text-lg font-bold">
          Coins:
          <span className="text-yellow-500">{points}</span>
          <Image src="/coin.png" width={40} height={40}  alt="coin"  />
        </div>

        <Button onClick={() =>
                open(isConnected ? { view: "Account" } : undefined)
              }> { isConnected ? '🌐 Connected' :'🌐 Connect Wallet'}</Button>
      </div>

      <Tabs defaultValue="betaminers">
        <TabsList>
       
          <TabsTrigger value="alphaminers"><span onClick={()=> switchTab() }>Alpha Miners</span></TabsTrigger>
          <TabsTrigger value="betaminers"><span onClick={()=> switchTab() }>Beta Miners(Tweet to Earn)</span></TabsTrigger>
          <TabsTrigger value="gammaminers"><span onClick={()=> switchTab() }>Gamma Miners</span></TabsTrigger>
          <TabsTrigger value="deltaminers"><span onClick={()=> switchTab() }>Delta Miners</span></TabsTrigger>
        </TabsList>

      { loading ?
       <Loader/>
       :
       <>
        <TabsContent value="alphaminers">
          <Image className='rounded-xl' src="/alpha.png" width={2080} height={600}  alt="alpha-banner" />
         <div className="min-h-screen bg-[#00000000] text-white p-8">
            <div className="flex items-center gap-2 text-white-600 text-lg font-bold">
              <Image src="/rocket.png" width={50} height={50}  alt="rocket"  />
              <h1 className="text-3xl font-bold mb-4">   
                Alpha Miners
                </h1>
            </div>             
          {!isInGodmode && (
            <>
              <p className="text-lg text-gray-300 mb-6">
                Boost your coins by buying more coins
              </p>
              <button
                onClick={ handleBuyClick}
                className="bg-blue-400 hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-lg"
              >
                Buy now
              </button>
            </>
          )}

          {showPaymentStep && (
            <div className="mt-8 bg-gray-800 p-6 rounded-2xl" style={{maxWidth: 'max-content'}}>
              <h2 className="text-2xl font-semibold mb-4">Choose your package:</h2>
              <div className="custom-grid gap-4">
                {priceList.map((item) => (
                  <button
                    key={item.usd}
                    onClick={() => {
                      setSelectedAmount(item.usd);
                      setSelectedCoinAmount(item.coins);
                      setTimeout(handlePaymentSuccess, 2000); // Simulate payment
                    }}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-left"
                  >
                    ${item.usd} = {item.coins.toLocaleString()} coins
                  </button>
                ))}
              </div>
            </div>
          )}

          {isInGodmode && (
            <div className="mt-10 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-2">🎉 Congratulations!</h2>
              <p className="text-lg ">
                You&apos;re in GODMODE and your Alpha mining allocation qualifies to receive reflections at launch.
              </p>
            </div>
            
          )}

          {selectedAmount && isInGodmode && (
            <div className="mt-4 text-yellow-500 text-lg">
              You purchased ${selectedAmount} worth of coins.<br />
              Your total Alpha allocation now is {selectedCoinAmount?.toLocaleString()} coins.
             <br/>
             <button
                onClick={handleBuyMoreClick}
                className="bg-blue-400 mt-5 hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-lg"
              >
                Buy More
              </button>
            </div>

            
          )}
          
            
        </div>    
        </TabsContent>
        
        <TabsContent value="betaminers">
            <Image className='rounded-xl' src="/beta.png" width={2080} height={600}  alt="beta-banner" />
            <div className="min-h-screen bg-[#00000000] text-white p-8 flex flex-col">
            <h1 className="text-3xl font-bold mb-4">🧪 Beta Miners</h1>

            <p className="text-xl font-bold mb-2">
              Earn real tokens for tweeting about Dyfusion
            </p>
            <p className="text-lg mb-6 text-gray-300">
              Complete welcome quest to unlock Tweet to Earn
            </p>

            {!isConnected ? (
                <Button 
                onClick={() =>
                  open(isConnected ? { view: "Account" } : undefined)
                }>
                  Connect Wallet
                </Button>
            ) : (
              <div className="space-y-6" style={{width: '-webkit-fill-available'}}>
                {!questComplete ? (
                  <div className="bg-gray-800 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">🎯 Welcome Quest</h2>
                    <ul className="space-y-2">
                      <li>✅ Follow us on X  
                        <button
                          onClick={completeQuest}
                           className="bg-blue-600 ml-2 mr-2 hover:bg-blue-400 px-6 rounded-xl" >
                          Start
                        </button>
                     +100K coins</li>
                      <li>✅ Like, Comment & Share pinned post 
                        <button
                          onClick={completeQuest}
                           className="bg-blue-600 ml-2 mr-2 hover:bg-blue-400 px-6 rounded-xl" >
                          Start
                        </button>
                        +50K coins</li>
                      <li>✅ Join our Telegram Channel <button
                          onClick={completeQuest}
                           className="bg-blue-600 ml-2 mr-2 hover:bg-blue-400 px-6 rounded-xl" >
                          Start
                        </button>
                        +100K coins</li>
                     
                    </ul>

                    <button
                      onClick={completeQuest}
                      className="mt-4 bg-blue-400 hover:bg-blue-600 px-6 py-2 rounded-xl"
                    >
                      Mark Quest as Complete
                    </button>
                    
                  </div>
                ) : (
                  <div className="bg-green-700 p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-2">✅ Quest Completed!</h2>
                    <p className="text-lg">
                      You&apos;re now eligible for Tweet to Earn. You&apos;ve earned up to 1M coins.
                    </p>
                  </div>
                )}

                {tweetToEarnUnlocked && (
                  <div className="bg-black border border-yellow-500 mt-8 p-6 rounded">
                    <h2 className="text-2xl font-semibold mb-4">💰 Tweet to Earn</h2>

                     <Card>
                      <CardContent className="p-4 space-y-2">
                        <h2 className="text-xl font-semibold">📜 Tweet Guidelines</h2>
                        <ul className="list-disc list-inside">
                          <li>Mention : 
                            <strong> @dyfusionchain</strong>
                          <Image className='inline-flex ml-5' src="/copy.svg" width={30} height={30} alt = "copy" />
                          </li>
                          <li>Include hashtags: 
                            <code> #DyfusionLaunch</code>, 
                            <code> #TweetToEarn</code>, 
                            <code> #Web3RevolutionNow</code>
                            <code><Image className='inline-flex ml-5' src="/copy.svg" width={30} height={30} alt = "copy" /></code>
                          </li>
                          <li>Do not copy others&apos; tweets</li>
                          <li>1 Tweet = 200 Coins</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <br/>
                     <li>
                        🕓 Invite 7 friends in 3 days for +400K coins bonus <br />
                        <span className="text-sm text-gray-400">Time left: 
                              <div className="flex justify-left items-center gap-6">
                                 <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 md:w-10 md:h-10 bg-black text-cyan-300 rounded-full border-4 border-cyan-500 flex items-center justify-center text-sm font-mono shadow-lg">
                                    {days}
                                  </div>
                                  <div className="text-cyan-400 mt-2 text-sm md:text-sm">Days</div>
                                </div>
                                 <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 md:w-10 md:h-10 bg-black text-cyan-300 rounded-full border-4 border-cyan-500 flex items-center justify-center text-sm font-mono shadow-lg">
                                    {hours}
                                  </div>
                                  <div className="text-cyan-400 mt-2 text-sm md:text-sm">Hours</div>
                                </div>
                                 <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 md:w-10 md:h-10 bg-black text-cyan-300 rounded-full border-4 border-cyan-500 flex items-center justify-center text-sm font-mono shadow-lg">
                                    {minutes}
                                  </div>
                                  <div className="text-cyan-400 mt-2 text-sm md:text-sm">Minutes</div>
                                </div>
                              </div>

                        </span>
                        <br />
                        Successful referrals: {referrals} / 7
                      </li>
                    <p className="hidden text-green-400 text-sm">Twitter username is auto-synced ✅</p>
                    <br/>
                     <Card>
                      <CardContent className="p-4 space-y-4">
                        <Input
                          placeholder="Paste your tweet URL here..."
                          value={tweetUrl}
                          onChange={(e) => setTweetUrl(e.target.value)}
                        />
                        {isConnected ?
                        <Button 
                        onClick={ validateTweet }>
                          ✅ Validate Tweet
                        </Button>
                        :
                        <Button 
                        onClick={() =>
                          open(isConnected ? { view: "Account" } : undefined)
                        }>
                          Connect Wallet
                        </Button>
                        }
                        <div className="text-red-400">{status}</div>
                        <div className="mt-4">
                          <p className="text-sm">Your referral link:</p>
                          <div className="bg-gray-700 p-2 rounded mt-1 text-sm break-all">
                            https://dyfusion.app/ref/your-user-id
                          </div>
                          <button
                            className="mt-2 text-blue-400 underline text-sm"
                            onClick={() => navigator.clipboard.writeText('https://dyfusion.app/ref/your-user-id')}
                          >
                            Copy Referral Link
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  
                )}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="gammaminers">
          <Image className='rounded-xl' src="/gamma.png" width={2080} height={600}  alt="gamma-banner" />
          <div className="min-h-screen bg-[#00000000] text-white p-8 flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-yellow-500 mb-8">COMING SOON</h1>

              {/* Placeholder 3D NFT pass image */}
              <div className="w-full max-w-md mb-6">
                <Image
                  src="/nftpass.png" // Replace with actual 3D render or animation if available
                  alt="OG NFT Pass"
                  width={500}
                  height={500}
                  className="rounded-xl shadow-lg object-contain"
                />
              </div>

              <p className="text-lg max-w-xl text-gray-300">
                Secure your OG NFT & Membership Pass for reflections at launch, future airdrops,
                early access to opportunities, cool apps, gated channels and more.
                <br /><br />
                <span className="font-semibold text-white">COMING SOON.</span>
              </p>
            </div>
        </TabsContent>
        <TabsContent value="deltaminers">
          <Image className='rounded-xl' src="/delta.png" width={2080} height={600}  alt="delta-banner" />
          <div className="min-h-screen bg-[#00000000] text-white p-8 flex flex-col items-center text-center">
                <h1 className="text-4xl font-bold text-yellow-500 mb-8">COMING SOON</h1>

                {/* Placeholder images section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">
                       <Image
                        src="/1.png" // Replace with actual 3D render or animation if available
                        alt="OG NFT Pass"
                        width={200}
                        height={200}
                        className="rounded-xl shadow-lg object-contain"
                      />
                    </span>
                  </div>
                  <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">
                       <Image
                        src="/2.png" // Replace with actual 3D render or animation if available
                        alt="OG NFT Pass"
                        width={200}
                        height={200}
                        className="rounded-xl shadow-lg object-contain"
                      />
                    </span>
                  </div>
                  <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">
                       <Image
                          src="/3.png" // Replace with actual 3D render or animation if available
                          alt="OG NFT Pass"
                          width={200}
                          height={200}
                          className="rounded-xl shadow-lg object-contain"
                        />
                    </span>
                  </div>
                </div>

                <p className="text-lg max-w-3xl text-gray-300">
                  <strong className="text-white text-xl block mb-4">
                    Buy cool devices that run validator nodes, contribute to the community and receive a share of token allocation when you scan your device&apos;s QR code on our app.
                  </strong>
                  The devices envisioned include routers, Dyfusion box validator systems and Smart Phones.
                  <br /><br />
                  <span className="font-semibold text-white">COMING SOON</span>
                </p>
              </div>
        </TabsContent>
      </>
        }
      </Tabs>
      
    </div>
  );
}
