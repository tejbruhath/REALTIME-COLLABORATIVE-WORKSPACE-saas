import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { Editor } from "./Editor";

export default function App() {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_rQppdnVzSzZ9EfiMFaCdneAhPMrt1SgHGp3GuoYhOBcJ_Tf_UeBiZJxXr_v4o32v">
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<div className="loading">Loading…</div>}>
          <Editor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
