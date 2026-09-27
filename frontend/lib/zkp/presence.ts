// Peer discovery via Supabase Realtime Presence — replaces FastAPI's
// POST /p2p/register, GET /p2p/peers, POST /p2p/heartbeat, POST /p2p/leave.
// Presence tracks who's actually subscribed right now; no polling, no DB table.
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import type { PresencePeer } from "./types";

const PEERS_CHANNEL = "trace4magnet-peers";

export function joinPeersChannel(
  self: PresencePeer,
  onSync: (peers: PresencePeer[]) => void,
): RealtimeChannel {
  const supabase = createClient() as SupabaseClient;
  const channel = supabase.channel(PEERS_CHANNEL, {
    config: { presence: { key: self.supabaseUid } },
  });

  channel.on("presence", { event: "sync" }, () => {
    const state = channel.presenceState<PresencePeer>();
    const peers = Object.values(state).flatMap((entries: PresencePeer[]) =>
      entries.map((entry) => entry as unknown as PresencePeer),
    );
    onSync(peers.filter((p) => p.supabaseUid !== self.supabaseUid));
  });

  channel.subscribe(async (status: string) => {
    if (status === "SUBSCRIBED") {
      await channel.track(self);
    }
  });

  return channel;
}

export async function setPresenceStatus(
  channel: RealtimeChannel,
  self: PresencePeer,
  status: PresencePeer["status"],
) {
  await channel.track({ ...self, status });
}

export async function leavePeersChannel(channel: RealtimeChannel) {
  await channel.untrack();
  await channel.unsubscribe();
}
