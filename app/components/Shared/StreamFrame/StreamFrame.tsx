"use client";

import Script from "next/script";
import { useEffect } from "react";

const TwitchPlayer = ({ link }: { link: string }) => {
  const initPlayer = () => {
    const container = document.getElementById("twitch-embed");
    if ((window as any).Twitch && container) {
      container.innerHTML = "";

      new (window as any).Twitch.Embed("twitch-embed", {
        width: "100%",
        height: 720,
        channel: link,
        parent: ["jk-cup.vercel.app", "localhost"],
        layout: "video",
        autoplay: true,
      });
    }
  };

  useEffect(() => {
    initPlayer();
  }, [link]);

  return (
    <div>
      {link && (
        <div className="shadow-xl shadow-neon">
          <Script
            src="https://embed.twitch.tv/embed/v1.js"
            onLoad={initPlayer}
          />
          <div id="twitch-embed" key={link}></div>
        </div>
      )}
    </div>
  );
};

export default TwitchPlayer;
