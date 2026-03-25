import { Camera, X } from "lucide-react"; // Добавили X для закрытия
import { motion, AnimatePresence } from "framer-motion";
import { ChangeEvent, useRef, useState } from "react"; // Добавили useState
import { useAppSelector } from "@/app/utils/store/hooks";
import { useParams } from "next/navigation";
import CustomModal from "../../Shared/CustomModal/CustomModal";

interface ProfileAvatarProps {
  imageUrl?: string;
  fullName: string;
  isEditable?: boolean;
  onImageChange?: (file: File) => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-16 h-16 text-xl",
  md: "w-24 h-24 text-3xl",
  lg: "w-32 h-32 text-4xl",
};

const ProfileAvatar = ({
  imageUrl,
  fullName,
  isEditable = false,
  onImageChange,
  size = "lg",
}: ProfileAvatarProps) => {
  const [isOpen, setIsOpen] = useState(false); // Состояние модалки
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, userInfo } = useAppSelector((state) => state.user);
  const { id } = useParams();

  const isMyProfile = currentUser?.id === id;
  const currentImage = userInfo?.imageFile
    ? URL.createObjectURL(userInfo.imageFile)
    : imageUrl;

  const handleClick = () => {
    if (isEditable && isMyProfile) {
      fileInputRef.current?.click();
    } else if (currentImage) {
      setIsOpen(true); // Открываем модалку, если есть фото и это не наш профиль (или просто просмотр)
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой (макс. 2МБ)");
      return;
    }
    onImageChange?.(file);
  };

  const initials =
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      <motion.div
        className={`relative ${sizeMap[size]} rounded-2xl overflow-hidden group cursor-pointer`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
      >
        <div className="absolute -inset-0.5 rounded-2xl bg-card/50 animate-pulse-glow" />

        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-2 flex items-center justify-center">
          {currentImage ? (
            <img
              src={currentImage}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold text-muted-foreground select-none">
              {initials}
            </span>
          )}

          {isMyProfile && (
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Camera className="w-6 h-6 text-foreground" />
            </div>
          )}
        </div>

        {isEditable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        )}
      </motion.div>

      <AnimatePresence>
        <CustomModal
          isOpen={isOpen && !!currentImage}
          onClose={() => setIsOpen(false)}
        >
          <img
            src={currentImage}
            alt={fullName}
            className="w-full h-auto max-h-[80vh] rounded-xl object-contain"
          />
        </CustomModal>
      </AnimatePresence>
    </>
  );
};

export default ProfileAvatar;
