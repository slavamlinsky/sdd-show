export type TestLevel = "basic" | "advanced" | "pro";

export type QuestionTag =
  | "ai-first"
  | "sdd"
  | "ide"
  | "glossary"
  | "ecosystem-lite";

export type InnerQuestion = {
  id: string;
  stem: string;
  correct: string;
  /** 5 or 6 wrong answers; three are shown with the correct option. */
  distractors: string[];
  explain: string;
  glossarySlug?: string;
  tags: QuestionTag[];
};

export type InnerTest = {
  slug: string;
  title: string;
  level: TestLevel;
  blurb: string;
  topic: string;
  sampleRatio: number;
  passPercent: number;
  published: boolean;
  estimatedMinutes?: string;
  bank: InnerQuestion[];
};

export type OuterTest = {
  name: string;
  publisher: string;
  kind: "course" | "exam" | "quiz" | "guide";
  blurb: string;
  href: string;
};

export type SittingState = {
  testSlug: string;
  questionIds: string[];
  /** Four option strings in display order, keyed by question id. */
  optionsById: Record<string, string[]>;
  answers: Record<string, string>;
  startedAt: number;
  finishedAt?: number;
};
