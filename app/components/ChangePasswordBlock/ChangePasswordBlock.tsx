import { Lock } from "lucide-react";
import { motion } from "motion/react";
import CustomButton, {
  BUTTON_STYLES,
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { ChangeEvent, SubmitEvent, useState } from "react";
import CustomPasswordInput from "../Shared/CustomPasswordInput/CustomPasswordInput";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "next/navigation";

const ChangePasswordBlock = () => {
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [data, setData] = useState({
    old_password: "",
    new_password: "",
    new_password_repeat: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTogglePasswordChanging = () => {
    setIsPasswordChanging((prevState) => !prevState);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.new_password !== data.new_password_repeat) {
      toast.error("Пароли не совпадают");
    }

    setIsLoading(true);
    try {
      await axios.post(`/api/users/${id}/reset-password`, data);
      toast.success("Пароль успешно изменен");
      handleTogglePasswordChanging();
      window.location.href = "/tournaments";
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка смены пароля");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-2 grid grid-cols-2 gap-2 w-full h-full max-h-55"
    >
      <div className="rounded-xl bg-background border border-border">
        <div className="px-5 py-4 flex items-center gap-3">
          <Lock className="w-6 h-6" />
          <h2 className="text-white font-semibold text-base tracking-tight">
            Пароль
          </h2>
        </div>
        {isPasswordChanging ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="border-t border-border px-4 py-5 space-y-2 bg-card"
            onSubmit={handleSubmit}
          >
            <CustomPasswordInput
              label="Старый пароль"
              name="old_password"
              required
              value={data.old_password}
              onChange={handleChangeInput}
            />
            <CustomPasswordInput
              label="Новый пароль"
              name="new_password"
              required
              value={data.new_password}
              onChange={handleChangeInput}
            />
            <CustomPasswordInput
              label="Повторите новый пароль"
              name="new_password_repeat"
              required
              value={data.new_password_repeat}
              onChange={handleChangeInput}
            />
            <div className="flex items-center gap-2">
              <CustomButton
                className="w-full justify-center"
                buttonType={BUTTON_TYPES.CANCEL}
                label="Отмена"
                onClick={handleTogglePasswordChanging}
              />
              <CustomButton
                label="Сменить пароль"
                className="w-full justify-center"
                type="submit"
                isLoading={isLoading}
              />
            </div>
          </motion.form>
        ) : (
          <div className="border-t border-border px-5 py-5 bg-card">
            <p className="text-xs text-neutral-400">
              Нажмите кнопку ниже, чтобы начать смену пароля
            </p>
            <CustomButton
              className="mt-2"
              label="Сменить пароль"
              onClick={handleTogglePasswordChanging}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChangePasswordBlock;
