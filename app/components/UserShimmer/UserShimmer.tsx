import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {};

const UserShimmer = (props: Props) => {
  return (
    <Skeleton
      baseColor="#1a1c23"
      highlightColor="#363d49"
      className="border border-border"
      borderRadius={12}
      width={"100%"}
      height={66}
      count={10}
    ></Skeleton>
  );
};

export default UserShimmer;
