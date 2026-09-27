// WebRTC signalling relay via Supabase Realtime Broadcast — replaces
// WS /ws/signal/{room_id}. Same two room-naming conventions as the FastAPI version:
// notification room = target's own supabase_uid, session room =
// `${initiator_uid}-${responder_uid}`. Channels are open (no access control), matching
// the FastAPI WS relay's behavior today.
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import type { SignalMessage } from "./types";

export function openSignalChannel(
  roomId: string,
  onMessage: (msg: SignalMessage) => void,
): { channel: RealtimeChannel; ready: Promise<void> } {
  const supabase = createClient() as SupabaseClient;
  const channel = supabase.channel(`signal:${roomId}`);

  channel.on("broadcast", { event: "signal" }, ({ payload }: { payload: SignalMessage }) => {
    onMessage(payload);
  });

  const ready = new Promise<void>((resolve) => {
    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") resolve();
    });
  });

  return { channel, ready };
}

export function sendSignal(channel: RealtimeChannel, msg: SignalMessage) {
  return channel.send({ type: "broadcast", event: "signal", payload: msg });
}

export function closeSignalChannel(channel: RealtimeChannel) {
  return channel.unsubscribe();
}
