import Script from "next/script";

const TwitchPlayer = () => {
  return (
    <>
      <Script
        src="https://embed.twitch.tv/embed/v1.js"
        onLoad={() => {
          new (window as any).Twitch.Embed("twitch-embed", {
            width: "100%",
            height: 720,
            channel: "recrent",
            parent: ["jk-cup.vercel.app", "localhost"],
            layout: "video",
          });
        }}
      />
      <div id="twitch-embed"></div>
    </>
  );
};

export default TwitchPlayer;
