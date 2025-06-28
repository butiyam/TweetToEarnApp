"use client";

import { useState, useEffect } from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { Tabs, TabsContent } from "./ui/Tabs";
import Loader from "./Loader";
import Image from "next/image";

export default function Leaderboard() {
  
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ username: string; points: number }[]>([]);


  useEffect(() => {

    
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      }
    };
    load();

  }, []);

  const getRankIcon = (i: number) => {
    switch (i) {
      case 0:
        return <Image src="/r1.svg" width={30} height={35} alt="rank1" />;
      case 1:
        return <Image src="/r2.svg" width={30} height={35} alt="rank2" />;
      case 2:
        return <Image src="/r3.svg" width={30} height={35} alt="rank3" />;
      default:
        return <span>{i + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <Tabs defaultValue="leaderboard">
        <TabsContent value="leaderboard">
          <Image
            src="/leaderboard.png"
            alt="leaderboard-banner"
            width={1200}
            height={300}
            className="w-full h-auto rounded-xl shadow-lg object-contain mb-6 sm:mb-10"
          />
          {loading ?
          <Loader/>
          :
          <Card>
            <CardContent className="p-2 sm:p-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">🏆 Leaderboard</h2>
              <div className="overflow-x-auto rounded-lg border border-gray-700">
                <table className="min-w-full text-sm sm:text-base">
                  <thead className="bg-gray-800 text-yellow-400">
                    <tr>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left border-b border-gray-700">Rank</th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left border-b border-gray-700">Username</th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left border-b border-gray-700">Coins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                      users.map((user, i) => (
                        <tr
                          key={user.username}
                          className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="px-4 sm:px-6 py-3 border-b border-gray-700">
                            {getRankIcon(i)}
                          </td>
                          <td className="px-4 sm:px-6 py-3 border-b border-gray-700 break-all">
                            {user.username || 'NA'}
                          </td>
                          <td className="px-4 sm:px-6 py-3 border-b border-gray-700">
                            {user.points.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-red-400">
                          No leaderboard data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}
