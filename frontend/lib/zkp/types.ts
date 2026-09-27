export interface PresencePeer {
  supabaseUid: string;
  email: string;
  role: string; // "MANUFACTURER" | "RECYCLER" | "AUDITOR" | "REGULATOR" | "ADMIN"
  status: "online" | "busy";
}

export type SignalMessage =
  | { type: "zkp_offer"; recycler_uid: string; recycler_name: string; sdp: string }
  | { type: "zkp_answer"; sdp: string }
  | { type: "ice_candidate"; candidate: RTCIceCandidateInit };

export type DataChannelMessage =
  | {
      type: "zkp_request";
      passport_id: string;
      element: string;
      operator: "gt" | "lt";
      threshold: number;
    }
  | {
      type: "zkp_result";
      proof: Record<string, unknown>;
      publicSignals: string[];
    };

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
