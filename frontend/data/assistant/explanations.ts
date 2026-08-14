export type AssistantPromptId =
  | "explain-provenance"
  | "why-restricted"
  | "explain-composition"
  | "recycling-assistant"
  | "risk-summary";

export const assistantPrompts = [
  {
    id: "explain-provenance",
    title: "Explain Provenance",
    question: "Explain the provenance of this magnet.",
  },
  {
    id: "why-restricted",
    title: "Why Is This Data Restricted?",
    question: "Why can I not see the exact supplier or composition data?",
  },
  {
    id: "explain-composition",
    title: "Explain Composition",
    question: "Why is dysprosium important in this magnet?",
  },
  {
    id: "recycling-assistant",
    title: "Recycling Assistant",
    question: "How should this magnet be recycled?",
  },
  {
    id: "risk-summary",
    title: "Supply Chain Risk Summary",
    question: "Summarise the key supply-chain risks.",
  },
] as const;

export function generateAssistantExplanation(promptId: AssistantPromptId) {
  switch (promptId) {
    case "explain-provenance":
      return {
        title: "Provenance Explanation",
        response:
          "This magnet is represented as passing through recognised supply-chain stages from mining, alloy production and magnet manufacturing to integration in an EV application. The provenance view helps stakeholders understand where the material came from and which supply-chain stages are involved, without exposing unnecessary commercial details.",
      };

    case "why-restricted":
      return {
        title: "Restricted Data Explanation",
        response:
          "Exact composition, supplier identities and commercial relationships can be sensitive because they may reveal manufacturing know-how or strategic sourcing information. The platform therefore uses role-based disclosure, where public users receive verified claims while authorised users can see more detailed information.",
      };

    case "explain-composition":
      return {
        title: "Composition Explanation",
        response:
          "Dysprosium is important because it improves high-temperature performance in NdFeB magnets, especially in demanding applications such as electric vehicle traction motors. However, it is also a constrained rare-earth element, so its presence is valuable for recycling and sensitive for manufacturers.",
      };

    case "recycling-assistant":
      return {
        title: "Recycling Recommendation",
        response:
          "Based on the current demonstrator data, this magnet is suitable for short-loop recycling. The presence of Nd, Pr and Dy makes it valuable for material recovery, and the circularity dashboard estimates recoverable material and recovery confidence.",
      };

    case "risk-summary":
      return {
        title: "Supply-Chain Risk Summary",
        response:
          "The main risks are dependency on rare-earth supply chains, limited refining capacity, and the presence of commercially sensitive supplier relationships. The demonstrator addresses this by combining provenance visibility with selective disclosure and verification claims.",
      };

    default:
      return {
        title: "Assistant Response",
        response:
          "No explanation is available for this prompt.",
      };
  }
}