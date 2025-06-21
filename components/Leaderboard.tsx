"use client";

import { useState, useEffect } from "react";
import  Card from "./ui/Card";
import  CardContent  from "./ui/CardContent";
import { Tabs, TabsContent } from "./ui/Tabs";

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
    <div className="min-h-screen bg-black text-white p-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        &nbsp;
      </div>

      <Tabs defaultValue="leaderboard">
        <TabsContent value="leaderboard">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">🏆 Leaderboard</h2>
              <ol className="space-y-1">
                 {Array.isArray(users) ? (
                  users.map((user, i) => (
                     <li key={user.username} className="border-b py-2 flex justify-between">  
                      <span>#{i + 1} @{user.username}</span>
                      <span>{user.points} Conis</span>
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
   </>  
  );
}
