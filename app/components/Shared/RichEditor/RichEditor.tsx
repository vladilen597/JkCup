import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { cn } from "@/lib/utils";

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) =>
              attributes.fontSize
                ? { style: `font-size: ${attributes.fontSize}` }
                : {},
          },
        },
      },
    ];
  },
});

const Tiptap = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [, setSelectionTick] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TextStyle,
      FontSize,
    ],
    content: value,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => setSelectionTick((s) => s + 1),
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[100px] prose prose-sm max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";

  console.log(value);

  return (
    <div className="rounded-lg bg-muted border border-border overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border bg-muted">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={cn(
            "rounded-lg bg-primary/10 w-10 h-10",
            editor.isActive("bold") && "bg-primary/40",
          )}
        >
          {" "}
          B{" "}
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={cn(
            "rounded-lg bg-primary/10 w-10 h-10 italic font-serif",
            editor.isActive("italic") && "bg-primary/40",
          )}
        >
          {" "}
          I{" "}
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={cn(
            "rounded-lg bg-primary/10 px-2 h-10",
            editor.isActive("bulletList") && "bg-primary/40",
          )}
        >
          {" "}
          • • •{" "}
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={cn(
            "rounded-lg bg-primary/10 px-2 h-10",
            editor.isActive("orderedList") && "bg-primary/40",
          )}
        >
          {" "}
          1. 2. 3.{" "}
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setHardBreak().run();
          }}
          className={cn("rounded-lg bg-primary/10 px-2 h-10")}
        >
          BR
        </button>

        <select
          className="bg-background border rounded-md px-2 h-10 text-sm ml-auto"
          value={currentFontSize}
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontSize: e.target.value })
              .run()
          }
        >
          <option value="12px">12px</option>
          <option value="16px">16px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>
      </div>
      <style>{`
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin: 10px 0; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin: 10px 0; }
      `}</style>
      <div
        className="p-3 cursor-text bg-background min-h-[120px]"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
