import RichEditor from "../../Shared/RichEditor/RichEditor";

const DescriptionEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <label>
      <RichEditor value={value} onChange={onChange} />
    </label>
  );
};

export default DescriptionEditor;
