import Clock from "@/components/Clock";
import LiveCounter from "@/components/LiveCounter";
import Player from "@/components/Player";

export default function Home() {
  return (
    <>
      {/* BACKGROUND & OVERLAYS */}
      <div className="bg-wrapper">
        <div className="bg-image"></div>
      </div>

      {/* TOP BADGES */}
      <div className="top-badges fade-in delay-2">
        <LiveCounter />
        <Clock />
      </div>

      {/* Animated Particles / Lamp Glows */}
      <div className="lamp-glow lg-1"></div>
      <div className="lamp-glow lg-2"></div>

      <span className="particle p-1"></span>
      <span className="particle p-2"></span>
      <span className="particle p-3"></span>

      {/* Main Content */}
      <main className="main-content">
      </main>

      {/* Player Component */}
      <Player />
    </>
  );
}
