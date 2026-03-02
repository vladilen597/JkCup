import React, { useRef, useState } from "react";
import RichEditor from "../../Shared/RichEditor/RichEditor";

type Props = {};

const DescriptionEditor = (props: Props) => {
  const [text, setText] = useState("");

  const handleChangeHtml = (value: string) => {
    setText(value);
  };

  return (
    <label>
      <RichEditor />
    </label>
  );
};

export default DescriptionEditor;
