
import { useState } from "react";
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

  return (
    <>
      {currentPage === "opening" && (
        <Opening
          onUnlock={() => setCurrentPage("password")}
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
