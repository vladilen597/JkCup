"use client";
import Script from "next/script";
import { ChangeEvent, useEffect, useState } from "react";
import CustomInput from "../CustomInput/CustomInput";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import CustomButton from "../CustomButton/CustomButton";
import { updateTournamentStreamLink } from "@/app/utils/store/tournamentsSlice";

const TwitchPlayer = ({
  tournamentId,
  link,
}: {
  tournamentId: string;
  link: string;
}) => {
  const [twitchLink, setTwitchLink] = useState(link);
  const { user: currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleChangeTwitchLink = (e: ChangeEvent<HTMLInputElement>) => {
    setTwitchLink(e.target.value);
  };

  const handleUpdateLink = async () => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      await updateDoc(tournamentRef, {
        stream_link: twitchLink,
      });
      dispatch(updateTournamentStreamLink({ tournamentId, link: twitchLink }));
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className="shadow-xl shadow-[#6441a5]">
        <Script src="https://embed.twitch.tv/embed/v1.js" onLoad={initPlayer} />
        <div id="twitch-embed" key={link}></div>
      </div>
      {(currentUser.role === "admin" || currentUser.role === "superadmin") && (
        <div className="mt-8 flex items-stretch gap-2 max-w-md">
          <CustomInput value={twitchLink} onChange={handleChangeTwitchLink} />
          <CustomButton label="Обновить" onClick={handleUpdateLink} />
        </div>
      )}
    </div>
  );
};

export default TwitchPlayer;
