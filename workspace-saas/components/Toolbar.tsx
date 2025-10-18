"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Table,
  Image as ImageIcon,
  Link as LinkIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 transition-colors ${
        active
          ? "bg-[#3B82F6] text-white"
          : "text-[#A3A3A3] hover:bg-[#1F1F1F] hover:text-white"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-10 bg-black border-b border-[#1F1F1F] p-2 flex items-center gap-1 overflow-x-auto">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      >
        <Strikethrough size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
      >
        <Code size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#1F1F1F] mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
      >
        <Heading1 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#1F1F1F] mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#1F1F1F] mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
      >
        <AlignLeft size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
      >
        <AlignCenter size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
      >
        <AlignRight size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-[#1F1F1F] mx-1" />

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
        <Undo size={18} />
      </ToolbarButton>

      <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
        <Redo size={18} />
      </ToolbarButton>
    </div>
  );
}
