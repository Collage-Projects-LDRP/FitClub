import Link from "next/link";
import { ArrowLeft, Clock, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
          Challenges Coming Soon!
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto">
          We're working hard to bring you exciting challenges with amazing prizes. 
          Get ready to compete, win, and earn rewards!
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center text-amber-400">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Launching Soon</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50"></div>
          <div className="flex items-center text-amber-400">
            <Zap className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Exciting Prizes</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800/50">
            <Link href="/qr-landing" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
            <Link href="#" className="flex items-center">
              Notify Me When Live
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
