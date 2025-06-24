"use client";
import TweetToEarnApp from "../../../components/TweetToEarnApp";
import Navbar from "../Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function dashboard() {
  return  <> 
       <ProtectedRoute>
          <Navbar/>
          <main className="flex-1 mt-15 md:mt-0">
           <TweetToEarnApp />
          </main>
        </ProtectedRoute>
        </>;
}
