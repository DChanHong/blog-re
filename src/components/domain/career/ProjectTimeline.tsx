"use client";

interface ProjectData {
    title: string;
    period: string;
    role: string;
    description: string;
    contributions: string[];
    achievements: string[];
    techStack: string[];
    status: "current" | "completed";
}

interface ProjectTimelineProps {
    projects: ProjectData[];
}

/**
 * ProjectTimeline - 프로젝트 타임라인 컴포넌트
 *
 * 프로젝트별 경력을 타임라인 형태로 표시하는 섹션입니다.
 */
export default function ProjectTimeline({ projects }: ProjectTimelineProps) {
    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
                🚀 프로젝트 타임라인
            </h2>
            <div className="relative">
                {/* 타임라인 라인 */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>

                {projects.map((project, index) => (
                    <div key={index} className="relative mb-12 ml-16">
                        {/* 타임라인 도트 */}
                        <div
                            className={`absolute -left-10 top-6 w-4 h-4 rounded-full border-4 border-gray-900 shadow-lg ${
                                project.status === "current"
                                    ? "bg-green-500 animate-pulse"
                                    : "bg-blue-500"
                            }`}
                        ></div>

                        {/* 프로젝트 카드 */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
                            <div
                                className={`p-6 ${
                                    project.status === "current"
                                        ? "bg-gradient-to-r from-green-500/10 to-blue-500/10"
                                        : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                                }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white mb-2 md:mb-0">
                                        {project.title}
                                        {project.status === "current" && (
                                            <span className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                                                진행중
                                            </span>
                                        )}
                                    </h3>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-blue-400">
                                            {project.period}
                                        </p>
                                        <p className="text-sm text-gray-400">{project.role}</p>
                                    </div>
                                </div>

                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-white mb-3">
                                            주요 기여
                                        </h4>
                                        <ul className="space-y-2">
                                            {project.contributions.map((contribution, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start text-sm text-gray-300"
                                                >
                                                    <span className="text-blue-400 mr-2 mt-1">
                                                        •
                                                    </span>
                                                    <span>{contribution}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-white mb-3">성과</h4>
                                        <ul className="space-y-2">
                                            {project.achievements.map((achievement, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start text-sm text-gray-300"
                                                >
                                                    <span className="text-green-400 mr-2 mt-1">
                                                        ✓
                                                    </span>
                                                    <span>{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-white mb-3">사용 기술</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export type { ProjectData };
