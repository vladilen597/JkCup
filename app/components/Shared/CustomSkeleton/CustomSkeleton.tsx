import { cn } from "@/lib/utils";
import Skeleton, { SkeletonProps } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

const CustomSkeleton = ({
  count = 1,
  width,
  height,
  className,
  borderRadius = 12,
}: SkeletonProps) => {
  return (
    <Skeleton
      className={cn("relative leading-0 block", className)}
      baseColor="#1a1c23"
      highlightColor="#363d49"
      width={width}
      height={height}
      count={count}
      borderRadius={borderRadius}
    />
  );
};

export default CustomSkeleton;
