"use client";

import { useState, useEffect } from "react";
import  Card from "./ui/Card";
import  CardContent  from "./ui/CardContent";
import { Tabs, TabsContent } from "./ui/Tabs";
import Image from "next/image";

export default  function Leaderboard() {

  const [users, setUsers] = useState<{ username: string; points: number }[]>([]);


 useEffect(  () => {

 const load = async ()=> { 
    await   fetch("/api/leaderboard")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
 }
 load();

  }, [users]);

  return (
   <> 
    <div className="min-h-screen bg-black text-white p-6 bg-lightning">
      <div className="flex justify-between items-center mb-6">
        &nbsp;
      </div>

      <Tabs defaultValue="leaderboard">
        <TabsContent value="leaderboard">
            <Image
                  src="/leaderboard.png" 
                  alt="leaderboard-banner"
                  width={2080} 
                  height={600} 
                  className="rounded-xl shadow-lg object-contain mb-10"
                />
          <Card>
            <CardContent className="p-2">
              <h2 className="text-xl font-semibold mb-2">🏆 Leaderboard</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg">
                    <thead className="bg-gray-800 text-yellow-400">
                    <tr>
                        <th className="px-6 py-3 text-left border-b border-gray-700">Rank</th>
                        <th className="px-6 py-3 text-left border-b border-gray-700">Username</th>
                        <th className="px-6 py-3 text-left border-b border-gray-700">Coins</th>
                    </tr>
                    </thead>
                    <tbody>

                {Array.isArray(users) ? (
                  users.map((user, i) => (
                  
                    <tr key={user.username} className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition-colors duration-200">
                          {i == 0 ?
                        <td className="px-6 py-4 border-b border-gray-700">
                            <Image src="/r1.svg" width={30} height={35} alt={"rank"+i} />
                        </td>
                         :<></>
                          }

                        {i == 1 ?
                        <td className="px-6 py-4 border-b border-gray-700">
                            <Image src="/r2.svg" width={35} height={35} alt={"rank"+i} />
                        </td>
                         :<></>
                          }

                        {i == 2 ?
                        <td className="px-6 py-4 border-b border-gray-700">
                            <Image src="/r3.svg" width={35} height={35} alt={"rank"+i} />
                        </td>
                         :<></>
                          }

                        {i >2 ?
                        <td className="px-6 py-4 border-b border-gray-700">
                            {i+1} 
                        </td>
                         :<></>
                          }

                        <td className="px-6 py-4 border-b border-gray-700">{user.username}</td>
                        <td className="px-6 py-4 border-b border-gray-700">{user.points}</td>
                    </tr>
                 

                  ))
                ) : (
                  <tr  className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition-colors duration-200">
                    <td colSpan={3} className="px-6 py-4 border-b border-gray-700">Error loading leaderboard</td>
                  </tr>

                )}

             
                    </tbody>
                </table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
    </div>
   </>  
  );
}
