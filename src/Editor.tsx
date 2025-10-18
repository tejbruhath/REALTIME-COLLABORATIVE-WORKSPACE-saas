import { useLiveblocksExtension, FloatingToolbar } from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Threads } from "./Threads";

export function Editor() {
  const liveblocks = useLiveblocksExtension();

  const editor = useEditor({
    extensions: [
      liveblocks,
      StarterKit.configure({
        // The Liveblocks extension comes with its own history handling
        history: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: "editor-content",
      },
    },
  });

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1>Realtime Collaborative Text Editor</h1>
        <p>Start typing and open this page in another tab to see real-time collaboration!</p>
      </div>
      <div className="editor-wrapper">
        <EditorContent editor={editor} className="editor" />
        <Threads editor={editor} />
        <FloatingToolbar editor={editor} />
      </div>
    </div>
  );
}
