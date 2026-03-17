import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export const useTournamentStats = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchInitialCount = async () => {
      const { count } = await supabase
        .from("tournament_registrations")
        .select("*", { count: "exact", head: true });
      setCount(count || 0);
    };

    fetchInitialCount();

    const channel = supabase
      .channel(`stats`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tournament_registrations",
        },
        () => {
          fetchInitialCount();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { count };
};
