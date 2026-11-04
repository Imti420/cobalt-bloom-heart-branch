export type Track =
  | "general"
  | "engineering"
  | "medical"
  | "agricultural"
  | "science-technology"
  | "specialized"
  | "national"
  | "private"
  | "system";

export type AdmissionSystem =
  | "own"
  | "gst"
  | "agricultural"
  | "engineering"
  | "medical"
  | "specialized"
  | "national"
  | "private";

/** How far a circular itself has been issued — not how sure a date is. */
export type Publication = "none" | "decision" | "notice" | "circular";

/**
 * notice — a report cites a university notice, press release or signed decision.
 * reported — a newsroom states the fact without quoting a document stored here.
 * preliminary — the source itself says proposed, probable, provisional or tentative.
 * not-announced — this archive does not have the fact.
 */
export type Confidence = "notice" | "reported" | "preliminary" | "not-announced";

export type AppStatus = "not_announced" | "upcoming" | "open" | "closed";

export type Progress =
  | "planning"
  | "applied"
  | "admit"
  | "appeared"
  | "result"
  | "admitted"
  | "not-selected";

export interface University {
  id: string;
  kind: "university" | "system";
  name: string;
  shortName: string;
  nameBn: string;
  track: Track;
  tags: string[];
  city: string;
  website: string | null;
  admissionUrl: string | null;
  directoryNote: string;
}

export interface UnitPlan {
  code: string;
  detail: string;
  examDate: string | null;
  examTime: string | null;
  centre: string;
}

export interface SourceRef {
  label: string;
  url: string;
  published: string;
}

export interface Circular {
  id: string;
  universityId: string;
  session: string;
  title: string;
  summary: string;
  system: AdmissionSystem;
  publication: Publication;
  confidence: Confidence;
  confidenceNote: string;
  sources: SourceRef[];
  updatedOn: string;
  pdfUrl: string | null;
  applicationOpens: string | null;
  opensAt: string | null;
  applicationCloses: string | null;
  closesAt: string | null;
  admitCardOn: string | null;
  examDate: string | null;
  examTime: string | null;
  resultOn: string | null;
  classesBegin: string | null;
  feeBdt: number | null;
  feeNote: string;
  seats: number | null;
  eligibility: string[];
  units: UnitPlan[];
  notes: string[];
}

export interface WatchItem {
  id: string;
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
  published: string;
}

export const TRACK_LABEL: Record<Track, string> = {
  general: "General public",
  engineering: "Engineering",
  medical: "Medical & dental",
  agricultural: "Agricultural",
  "science-technology": "Science & technology",
  specialized: "Specialized",
  national: "National & open",
  private: "Private",
  system: "Admission system",
};

export const SYSTEM_LABEL: Record<AdmissionSystem, string> = {
  own: "Own test",
  gst: "GST cluster",
  agricultural: "Agricultural cluster",
  engineering: "Engineering",
  medical: "Medical & dental",
  specialized: "Specialized",
  national: "National & open",
  private: "Private",
};

export const PROGRESS_LABEL: Record<Progress, string> = {
  planning: "Planning",
  applied: "Applied",
  admit: "Admit card",
  appeared: "Appeared",
  result: "Awaiting result",
  admitted: "Admitted",
  "not-selected": "Not selected",
};

export const ARCHIVE_STAMP = "2026-11-04";
