export type ProjectStatus = "운영 중" | "완료" | "출시 보류";

export interface CareerMetric {
    value: string;
    label: string;
    caption: string;
}

export interface GrowthStep {
    year: string;
    title: string;
    description: string;
    keywords: string[];
}

export interface ProjectChallenge {
    title: string;
    problem: string;
    action: string;
    result: string;
}

export interface CareerProject {
    id: string;
    title: string;
    subtitle: string;
    period: string;
    role: string;
    status: ProjectStatus;
    featured: boolean;
    summary: string;
    background: string;
    metrics: Array<{ value: string; label: string }>;
    responsibilities: string[];
    architecture?: string[];
    challenges: ProjectChallenge[];
    achievements: string[];
    techStack: string[];
    retrospective?: string;
    scopeNote?: string;
}

export interface Capability {
    title: string;
    description: string;
    evidence: string[];
    technologies: string[];
}
