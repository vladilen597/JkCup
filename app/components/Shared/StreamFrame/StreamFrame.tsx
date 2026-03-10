import Script from "next/script";
import { useEffect } from "react";

const TwitchPlayer = () => {
  const initPlayer = () => {
    const container = document.getElementById("twitch-embed");
    if ((window as any).Twitch && container && container.innerHTML === "") {
      new (window as any).Twitch.Embed("twitch-embed", {
        width: "100%",
        height: 720,
        channel: "araysee",
        parent: ["jk-cup.vercel.app", "localhost"],
        layout: "video",
      });
    }
  };

  useEffect(() => {
    initPlayer();
  }, []);

  return (
    <div>
      <Script src="https://embed.twitch.tv/embed/v1.js" onLoad={initPlayer} />
      <div id="twitch-embed"></div>
    </div>
  );
};

export default TwitchPlayer;
