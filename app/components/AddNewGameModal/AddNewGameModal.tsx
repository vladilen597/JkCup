import { useAppDispatch } from "@/app/utils/store/hooks";
import { addDoc, collection } from "firebase/firestore";
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

interface IAddNewGameModalProps {
  onClose: () => void;
}

const AddNewGameModal = ({ onClose }: IAddNewGameModalProps) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file.size > 1048487) {
        alert("Файл слишком большой");
        return;
      }
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL("image/png", 0.7);

          setImage(compressedBase64);
        };
      };
    }
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const id = uuidv4();
    try {
      await addDoc(collection(db, "games"), {
        id,
        name,
        image,
      });
      dispatch(addGame({ id, name, image }));
      onClose();
    } catch (error) {
      console.log(error);
      setError(error);
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
          {image && (
            <Image
              width={64}
              height={64}
              className="w-16 h-16 object-cover"
              src={image as string}
              alt="Profile picture"
            />
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
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
