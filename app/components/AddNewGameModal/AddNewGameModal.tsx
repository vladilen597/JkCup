import { useAppDispatch } from "@/app/utils/store/hooks";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { AlertCircle, Camera, Gamepad2 } from "lucide-react";
import { ChangeEvent, SubmitEvent, useState } from "react";
import { db } from "@/app/utils/firebase";
import { motion } from "motion/react";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import Image from "next/image";
import { addGame } from "@/app/utils/store/gamesSlice";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ErrorBlock from "../Shared/ErrorBlock/ErrorBlock";

interface IAddNewGameModalProps {
  onClose: () => void;
}

const AddNewGameModal = ({ onClose }: IAddNewGameModalProps) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !file) {
      setError("Заполните все поля");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const { data } = await axios.post("/api/games", formData);

      if (data) {
        dispatch(addGame(data));
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Gamepad2 className="h-5 w-5" />
        Добавить игру
      </h3>

      <div>
        <label className="block text-sm font-medium mb-1">Название</label>
        <input
          value={name}
          onChange={handleChangeName}
          className="w-full p-2 rounded-lg bg-muted border border-border"
          required
        />
      </div>
      <div className="mt-2">
        <span className="text-sm font-medium">Изображение</span>
        <div className="mt-1 relative ring-2 w-16 h-16 ring-primary/30 shadow-xl rounded overflow-hidden">
          <div className="absolute flex items-center justify-center w-full h-full z-10 hover:opacity-100 bg-black/50 transition-all">
            <input
              type="file"
              className="absolute opacity-0 z-10 w-full h-full cursor-pointer"
              onChange={handleChangeImage}
            />
            <Camera />
          </div>
          {file && (
            <Image
              width={64}
              height={64}
              className="w-16 h-16 object-cover"
              src={URL.createObjectURL(file)}
              alt="Profile picture"
            />
          )}
        </div>
      </div>

      {error && <ErrorBlock error={error} />}
      <div className="flex justify-end gap-3 mt-4">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton type="submit" label="Создать" isLoading={isLoading} />
      </div>
    </form>
  );
};

export default AddNewGameModal;
