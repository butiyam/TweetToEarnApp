"use client";
import Leaderboard from "../../../components/Leaderboard";
import Navbar from "../Navbar";
//import ProtectedRoute from "../../../components/ProtectedRoute";

export default function leaderboard() {
  return  <>  
          <Navbar />
           <main className="flex-1 mt-15 md:mt-0">
           <Leaderboard />
          </main>
        </>;
}
