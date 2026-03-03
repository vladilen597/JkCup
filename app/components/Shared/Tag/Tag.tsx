import { ITag } from "@/app/lib/types";

const Tag = ({ id, value, bgColor, textColor }: ITag) => {
  return (
    <div
      className="px-2.5 py-0.5 rounded-full text-[13px] font-bold tracking-wider font-mono"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {value}
    </div>
  );
};

export default Tag;
