"use client";

import { Editor } from "@tiptap/react";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Plus,
  Minus,
  Columns,
  Rows
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTableMenu, setShowTableMenu] = useState(false);

  if (!editor) {
    return null;
  }

  const isInTable = editor.isActive("table");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();
      // Insert image using the custom ResizableImage extension
      editor.chain().focus().insertContent({
        type: 'image',
        attrs: { src: url }
      }).run();
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 p-2 flex flex-wrap gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("bold") ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("italic") ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("strike") ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("code") ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Code"
      >
        <Code size={18} />
      </button>

      <div className="w-px h-8 bg-gray-700 mx-1" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px h-8 bg-gray-700 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("bulletList") ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("orderedList") ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("blockquote") ? "bg-gray-700 text-blue-400" : "text-gray-300"
        }`}
        title="Quote"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-8 bg-gray-700 mx-1" />

      {/* Insert */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded hover:bg-gray-700 text-gray-300"
        title="Insert Image"
      >
        <ImageIcon size={18} />
      </button>

      <button
        onClick={addTable}
        className="p-2 rounded hover:bg-gray-700 text-gray-300"
        title="Insert Table"
      >
        <TableIcon size={18} />
      </button>

      {/* Table Controls - Only show when cursor is in a table */}
      {isInTable && (
        <>
          <button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="p-2 rounded hover:bg-gray-700 text-gray-300"
            title="Add Column Before"
          >
            <Columns size={16} />
            <Plus size={10} className="absolute top-0 right-0" />
          </button>

          <button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-2 rounded hover:bg-gray-700 text-gray-300"
            title="Delete Column"
          >
            <Columns size={16} />
            <Minus size={10} className="absolute top-0 right-0" />
          </button>

          <button
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="p-2 rounded hover:bg-gray-700 text-gray-300"
            title="Add Row Before"
          >
            <Rows size={16} />
            <Plus size={10} className="absolute top-0 right-0" />
          </button>

          <button
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-2 rounded hover:bg-gray-700 text-gray-300"
            title="Delete Row"
          >
            <Rows size={16} />
            <Minus size={10} className="absolute top-0 right-0" />
          </button>

          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-2 rounded hover:bg-gray-700 text-red-400"
            title="Delete Table"
          >
            <TableIcon size={16} />
            <Minus size={10} className="absolute top-0 right-0" />
          </button>
        </>
      )}

      <div className="w-px h-8 bg-gray-700 mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
}
