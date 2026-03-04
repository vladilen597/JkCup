import RichEditor from "../../Shared/RichEditor/RichEditor";

const DescriptionEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return <RichEditor value={value} onChange={onChange} />;
};

export default DescriptionEditor;
