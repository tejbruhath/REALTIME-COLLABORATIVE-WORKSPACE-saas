"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { useLiveblocksExtension, FloatingToolbar } from "@liveblocks/react-tiptap";
import { ResizableImage } from "@/lib/extensions/ResizableImage";
import EditorToolbar from "./EditorToolbar";

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
      ResizableImage,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      TextStyle,
    ],
    editorProps: {
      attributes: {
        class: "tiptap min-h-screen p-12 focus:outline-none text-white",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        const content = editor.getJSON();
        onUpdate(content);
      }
    },
  });

  // Set initial content when editor is ready
  useEffect(() => {
    if (editor && initialContent && !editor.isDestroyed) {
      // Only set content if editor is empty
      if (editor.isEmpty) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  return (
    <div className="relative flex-1 bg-black flex flex-col">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
      <FloatingToolbar editor={editor} />
    </div>
  );
}
