import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { ChangeEvent, useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isEditable) fileInputRef.current?.click();
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
    <motion.div
      className={`relative ${sizeMap[size]} rounded-2xl overflow-hidden group cursor-pointer`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
    >
      <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-primary/60 to-primary/20 animate-pulse-glow" />

      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-2 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-bold text-muted-foreground select-none">
            {initials}
          </span>
        )}

        {isEditable && (
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
  );
};

export default ProfileAvatar;
