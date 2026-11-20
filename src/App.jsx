
import { useState, useRef } from "react";

import Opening from "./stages/Opening";
import Password from "./stages/Password";
import VideoMessage from "./stages/VideoMessage";
import BirthdayCard from "./stages/BirthdayCard";
import Gallery from "./stages/Gallery";
import MiniGame from "./stages/MiniGame";
import GiftFinder from "./stages/GiftFinder";
import FinalMessage from "./stages/FinalMessage";

function App() {
  const [currentPage, setCurrentPage] = useState("opening");

  // Background music reference
  const audioRef = useRef(null);

  // Opening button click - Start music
  const startMusic = async () => {
    try {
      await audioRef.current.play();
    } catch (error) {
      console.log("Music playback failed:", error);
    }
  };

  // Video start - Pause background music
  const pauseMusic = () => {
    audioRef.current?.pause();
  };

  // Video end - Resume background music
  const resumeMusic = () => {
    audioRef.current?.play().catch(console.error);
  };

  return (
    <>
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/audio/21 minutos de músicas para aumentar sua Aura 🔥.mp3"
        loop
      />

      {currentPage === "opening" && (
        <Opening
          onUnlock={() => {
            startMusic();
            setCurrentPage("password");
          }}
        />
      )}

      {currentPage === "password" && (
        <Password
          onSuccess={() => setCurrentPage("video")}
        />
      )}

      {currentPage === "video" && (
        <VideoMessage
          onNext={() => setCurrentPage("birthday")}
          onVideoStart={pauseMusic}
          onVideoEnd={resumeMusic}
        />
      )}

      {currentPage === "birthday" && (
        <BirthdayCard
          onNext={() => setCurrentPage("gallery")}
        />
      )}

      {currentPage === "gallery" && (
        <Gallery onNext={() => setCurrentPage("game")} />
      )}

      {currentPage === "game" && (
        <MiniGame onNext={() => setCurrentPage("gift")} />
      )}

      {currentPage === "gift" && (
        <GiftFinder onNext={() => setCurrentPage("final")} />
      )}

      {currentPage === "final" && <FinalMessage />}
    </>
  );
}

export default App;
