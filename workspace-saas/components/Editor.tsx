"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { useLiveblocksExtension, FloatingToolbar } from "@liveblocks/react-tiptap";
import { Threads } from "./Threads";

interface EditorProps {
  documentId: string;
  initialContent?: any;
  onUpdate?: (content: any) => void;
}

export default function Editor({ documentId, initialContent, onUpdate }: EditorProps) {
  const liveblocks = useLiveblocksExtension({
    offlineSupport_experimental: true,
  });

  const editor = useEditor({
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      TextStyle,
    ],
    editorProps: {
      attributes: {
        class: "tiptap min-h-screen p-12 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON());
      }
    },
  });

  return (
    <div className="relative flex-1 bg-black">
      <EditorContent editor={editor} />
      <Threads editor={editor} />
      <FloatingToolbar editor={editor} />
    </div>
  );
}
