"use client";

import { RichTextProvider } from "reactjs-tiptap-editor";
import { useEditor, EditorContent } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import { Paragraph } from "@tiptap/extension-paragraph";
import {
  Dropcursor,
  Gapcursor,
  Placeholder,
  TrailingNode,
} from "@tiptap/extensions";
import { HardBreak } from "@tiptap/extension-hard-break";
import { TextStyle } from "@tiptap/extension-text-style";
import { ListItem } from "@tiptap/extension-list";

const extensions = [
  StarterKit,
  Text,
  Dropcursor,
  HardBreak,
  Paragraph,
  ListItem,
];

const Tiptap = () => {
  const editor = useEditor({
    extensions,
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default Tiptap;
