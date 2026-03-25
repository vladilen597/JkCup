import Discord from "@/app/components/Icons/Discord";
import CustomButton from "@/app/components/Shared/CustomButton/CustomButton";
import { supabase } from "@/app/utils/supabase";
import { toast } from "react-toastify";

const ConnectDiscord = ({ user_id }: { user_id: string }) => {
  const linkDiscord = async () => {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/users/${user_id}/integrations`,
        scopes: "identify guilds",
      },
    });

    if (error) {
      toast.error("Ошибка привязки: " + error.message);
    }
  };

  return (
    <CustomButton
      className="bg-[#6266ec] text-white hover:bg-[#6266ec]/80 w-full justify-center"
      label="Подключить"
      icon={<Discord fill="white" />}
      onClick={linkDiscord}
    />
  );
};

export default ConnectDiscord;
