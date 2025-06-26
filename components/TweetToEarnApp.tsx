"use client";
import { useParams } from 'next/navigation';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import  CardContent  from "./ui/CardContent";
import  Button  from "./ui/Button";
import  Input  from "./ui/Input";
import Loader from './Loader';

import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

export default function TweetToEarnApp() {
    
    const params = useParams();
    const  notifyErrorMsg = (msg : string) => toast.error(msg);
    const  notifySuccess = (msg : string) => toast.success(msg);
    
   const [copy_url1, setURL1] = useState('/copy.svg');
   const [copy_url2, setURL2] = useState('/copy.svg'); 
   const [loading, setLoading] = useState(true);
   const [processed, setProcessed] = useState(false);
   const[referralURL, setReferralURL] = useState('');
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [referral, setReferralAddress] = useState('');

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
  const [hasJoinedX, setHasJoinedX] = useState(false);
  const [hasJoinedTG, setHasJoinedTG] = useState(false);
  const [hasShared, setHasShared] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [days, setDays] = useState(3);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [seconds, setSeconds] = useState(0);
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

  const handleCopy = () => {
   setURL1('/copied.svg');
      navigator.clipboard.writeText('@dyfusionchain');
     setTimeout(() => {
   setURL1('/copy.svg');
    }, 3000);
  };

  const handleCopy2 = () => {
   setURL2('/copied.svg');
      navigator.clipboard.writeText('#DyfusionLaunch, #TweetToEarn, #Web3RevolutionNow');
   setTimeout(() => {
   setURL2('/copy.svg');
    }, 3000);
  };

  const completeQuest = () => {
  if(!hasJoinedX){
    notifyErrorMsg('Follow us on X first');
    return;
  }

  if(!hasShared){
    notifyErrorMsg("Like, Comment & Share pinned post first");
    return;
  }

  if(!hasJoinedTG){
    notifyErrorMsg("Join our Telegram Channel first");
    return;
  }

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

  const fetchUserStats = async() => {

    try {
       const res = await fetch(`/api/userBuyWallet?wallet_address=${encodeURIComponent(address || '')}`);
       const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch user points");
      setPoints(data.points);
      setUsername(data.username);


       let referral = params.query?.toString();
      if(referral === undefined){
          referral = "0x0000000000000000000000000000000000000000";
      }
  
      setReferralAddress(referral);
      

      const protocol =  window.location.protocol;
      const hostname =  window.location.hostname;
      let url = protocol+hostname;
      if(hostname === 'localhost'){
          url = protocol+hostname+':3000/';
      }
  
      setReferralURL(url+'?referral='+address);

      if(data.x_joined == 1){
        setHasJoinedX(true);
      }

      if(data.has_shared){
        setHasShared(true);
      }

      if(data.telegram_joined){
        setHasJoinedTG(true);
      }

      setLoading(false);

    } catch (error) {
      console.log(error);
      
    }

  }

  const validateClick =  async(media: number) => {
  
      try {
      if(media === 1){

      setHasJoinedX(true);
      
      const tweetRes = await fetch("/api/credit-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 1,
          wallet_address: address,
        }),
      });

      const resData = await tweetRes.json()

      if(resData.error) {
       notifyErrorMsg(resData.error) 
      }

      if(resData.message) {
       notifySuccess(resData.message) 
      }
    if (typeof window !== 'undefined')
    {
      window.open("https://x.com/dyfusionchain?t=I5hv2La_ltJpZ-q3S26UZA&s=09", "_blank", "noopener,noreferrer");
    }
      }
      else if(media === 2){
        setHasShared(true);
        const tweetRes = await fetch("/api/credit-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 2,
          wallet_address: address,
        }),
      });

        const resData = await tweetRes.json()

        if(resData.error) {
        notifyErrorMsg(resData.error) 
        }

        if(resData.message) {
        notifySuccess(resData.message) 
        }

     if (typeof window !== 'undefined')
     {
        window.open("https://x.com/dyfusionchain/status/1936494464832340310", "_blank", "noopener,noreferrer");
     }

      }else{
         setHasJoinedTG(true);

         const tweetRes = await fetch("/api/credit-coins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: 3,
              wallet_address: address,
            }),
          });

          const resData = await tweetRes.json()

          if(resData.error) {
          notifyErrorMsg(resData.error) 
          }

          if(resData.message) {
          notifySuccess(resData.message) 
          }
        if (typeof window !== 'undefined')
    
        {
          window.open("https://t.me/@dyfusionchain_bot", "_blank", "noopener,noreferrer");
        }
    }

     await fetchUserStats();

    } catch (error) {
      console.log(error)
    }
  }
  const validateTweet =  async() => {
    try {

      setProcessed(true);
      const tweetText = await fetchTweetContent(tweetUrl);
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
       notifyErrorMsg(resData.error) 
      }

      if(resData.message) {
       notifySuccess(resData.message) 
      }

      const res = await fetch(`/api/user?username=${encodeURIComponent(tweetText.username)}`);
      const data = await res.json();

      if (!res.ok || !data.points) throw new Error(data.error || "Failed to fetch user coins");
      setPoints(data.points);


      } else {
        notifyErrorMsg("Tweet is missing required handle or hashtags.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifyErrorMsg("Failed to verify tweet. Make sure the URL is public and valid.");
    }

    setProcessed(false);
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
      const seconds = Math.floor((diff / (1000)) % 60);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

    }, 1000);
    
    return () => clearInterval(interval);

  });


   
  return (
    
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 bg-lightning" >
      <div className="flex justify-between items-center mb-6">
        <div>👤 {user}</div>
        <div className="flex items-center gap-2 text-white-600 text-lg font-bold">
          Coins:
          <span className="text-yellow-500">{points.toLocaleString()}</span>
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
         <div className="min-h-screen bg-[#00000000] text-white">
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
            <Image className='rounded-xl mb-5' src="/beta.png" width={2080} height={600}  alt="beta-banner" />
            <div className="min-h-screen bg-[#00000000] text-white flex flex-col">
            <h1 className="text-3xl font-bold mb-5">🧪 Beta Miners</h1>

            {!questComplete ?
                <>
                  <p className="text-xl font-bold mb-2">
                    Earn real tokens for tweeting about Dyfusion
                  </p>
                  <p className="text-lg mb-6 text-gray-300">
                    Complete welcome quest to unlock Tweet to Earn
                  </p>
                </>
                :
                <></>
            }

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
                        <button disabled = {hasJoinedX} onClick={ ()=> validateClick (1)}
                          className= { hasJoinedX ? 'bg-gray-700 ml-2 mr-2  px-6 rounded-xl cursor-not-allowed' 
                                                           : 'bg-blue-600 ml-2 mr-2 hover:bg-blue-400 px-6 rounded-xl cursor-pointer'
                          } >
                           Start
                        </button>
                     +100K coins</li>
                      <li>✅ Like, Comment & Share pinned post 
                        <button disabled={hasShared} onClick={ ()=> validateClick (2)}
                            className= { hasShared ? 'bg-gray-700 ml-2 mr-2  px-6 rounded-xl cursor-not-allowed' 
                                                    : 'bg-blue-600 ml-2 mr-2 hover:bg-blue-400 px-6 rounded-xl cursor-pointer'
                          }
                          >
                         Start
                        </button>
                        +50K coins</li>
                      <li>✅ Join our Telegram Channel 
                        <button disabled={hasJoinedTG} onClick={ ()=> validateClick (3)}
                           className= { hasJoinedTG ? 'bg-gray-700 ml-2 mr-2  px-6 rounded-xl cursor-not-allowed' 
                                                           : 'bg-blue-600 ml-2 mr-2 hover:bg-blue-400 px-6 rounded-xl cursor-pointer'
                          } >
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
                  <div className="bg-blue-400 p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-bold mb-2">✅ Quest Completed!</h2>
                    <p className="text-sm">
                      You&apos;re now eligible for Tweet to Earn.
                    </p>
                  </div>
                )}

                {tweetToEarnUnlocked && (
                  <div className="bg-black rounded-2xl p-5">
                    <h2 className="text-2xl font-semibold mb-4">💰 Tweet to Earn</h2>

                     <div className="bg-[#00000000]">
                      <CardContent className="p-2 space-y-2">
                        <h2 className="text-lg font-bold text-yellow-500">1 Tweet = 200 Coins</h2>
                        <h2 className="text-lg font-semibold">📜 Tweet Guidelines</h2>
                        <ul className="list-disc list-inside">
                          <li className="text-sm">Mention : 
                            <strong> @dyfusionchain</strong>
                          <Image className='inline-flex ml-5' onClick={handleCopy} src={copy_url1} width={30} height={30} alt = "copy" />
                          </li>
                          <li className="text-sm">Include hashtags: 
                            <code> #DyfusionLaunch</code>, 
                            <code> #TweetToEarn</code>, 
                            <code> #Web3RevolutionNow</code>
                            <code><Image className='inline-flex ml-5' onClick={handleCopy2} src={copy_url2} width={30} height={30} alt = "copy" /></code>
                          </li>
                          <li className="text-sm">Do not copy others&apos; tweets</li>
                          <li className="text-sm"> Copy your tweet link and paste it here to validate </li>
                          <li className="text-sm"> Click Validate Tweet button to finish</li>
                        </ul>
                      </CardContent>
                     </div>

                    <div className="bg-[#00000000]">
                      <CardContent className="p-4 space-y-4">
                        <Input
                          placeholder="Paste your tweet URL here..."
                          value={tweetUrl}
                          onChange={(e) => setTweetUrl(e.target.value)}
                        />
                        {isConnected ?
                        <Button 
                        disabled={processed}
                        onClick={ validateTweet }>
                          {processed ?
                          <p className="text-lg animate-pulse">Processing...</p>
                          :
                          "✅ Validate Tweet"
                          }
                        </Button>
                        :
                        <Button 
                        onClick={() =>
                          open(isConnected ? { view: "Account" } : undefined)
                        }>
                          Connect Wallet
                        </Button>
                        }
                        <ul className="list-disc list-inside">
                         <li className="text-sm">
                        🕓 Invite 7 friends in 3 days for +400K coins bonus <br />
                        <li className='text-sm mb-5'>Time Left</li>
                        <span className="text-sm text-gray-400">
                              <div className="flex justify-left items-center gap-3">
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
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 md:w-10 md:h-10 bg-black text-cyan-300 rounded-full border-4 border-cyan-500 flex items-center justify-center text-sm font-mono shadow-lg">
                                    {seconds}
                                  </div>
                                  <div className="text-cyan-400 mt-2 text-sm md:text-sm">Seconds</div>
                                </div>
                              </div>

                        </span>
                        <br />
                        Successful referrals: {referrals} / 7
                         </li>
                        </ul>
                      
                        <div className="mt-4">
                          <p className="bg-gray-700 lex break-all mt-1 p-2 rounded text-sm">Your referral link:
                              {' '+ referralURL.substring(0,25)+'...'+referralURL.substring(38,42)+' '}
                          </p>
                          <button
                            className="mt-2 text-blue-400 underline text-sm cursor-pointer"
                            onClick={() => navigator.clipboard.writeText(referralURL)}
                          >
                            Copy Referral Link
                          </button>
                        </div>
                      </CardContent>
                    </div>
                  </div>

                  
                )}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="gammaminers">
          <Image className='rounded-xl mb-5' src="/gamma.png" width={2080} height={600}  alt="gamma-banner" />
          <div className="min-h-screen bg-[#00000000] text-white flex flex-col items-center justify-center text-center">
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
          <Image className='rounded-xl mb-5' src="/delta.png" width={2080} height={600}  alt="delta-banner" />
          <div className="min-h-screen bg-[#00000000] text-white flex flex-col items-center text-center">
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
