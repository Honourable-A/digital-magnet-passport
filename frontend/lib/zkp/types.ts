export interface PresencePeer {
  supabaseUid: string;
  email: string;
  role: string; // "MANUFACTURER" | "RECYCLER" | "AUDITOR" | "REGULATOR" | "ADMIN"
  status: "online" | "busy";
}

// request_id scopes every signalling message to one logical request, so a stale
// message from a previous (or concurrent, same-pair) request can never be mistaken
// for one belonging to the current session.
export type SignalMessage =
  | { type: "zkp_offer"; recycler_uid: string; recycler_name: string; sdp: string; request_id: string }
  | { type: "zkp_answer"; sdp: string; request_id: string }
  | { type: "ice_candidate"; candidate: RTCIceCandidateInit; request_id: string };

export type DataChannelMessage =
  | {
      type: "zkp_request";
      passport_id: string;
      element: string;
      operator: "gt" | "lt";
      threshold: number;
      request_id: string;
    }
  | {
      type: "zkp_result";
      proof: Record<string, unknown>;
      publicSignals: string[];
      request_id: string;
    }
  | {
      // Sent by the Recycler once it has finished processing (not necessarily
      // "the claim was true") the zkp_result — tells the Manufacturer it's safe to
      // proceed to ledger submission and eventually close the session.
      type: "zkp_result_ack";
      success: boolean;
      request_id: string;
    };

// Plain `Omit` over a discriminated union collapses it to only the members' common
// keys (Omit is Pick<T, Exclude<keyof T, K>>, and keyof a union is only its shared
// keys) — this distributes Omit across each member instead, preserving the union.
export type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;

export interface LedgerEntry {
  id: number;
  passport_id: string;
  manufacturer_uid: string;
  recycler_uid: string;
  element: string;
  operator: "gt" | "lt";
  threshold: number;
  commitment: string;
  payload_2: string;
  zk_proof: Record<string, unknown>;
  public_signals: string[];
  zk_valid: boolean | null;
  tampered: boolean;
  submitted_at: string;
}
