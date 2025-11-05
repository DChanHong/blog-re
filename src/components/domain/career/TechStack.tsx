"use client";

interface TechStackCategory {
    name: string;
    color: string;
    dotColor: string;
    technologies: string[];
}

interface TechStackProps {
    categories: TechStackCategory[];
}

/**
 * TechStack - 기술 스택 컴포넌트
 *
 * 카테고리별 기술 스택을 표시하는 섹션입니다.
 */
export default function TechStack({ categories }: TechStackProps) {
    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🛠️ 기술 스택</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className={`text-xl font-bold ${category.color} mb-4`}>
                            {category.name}
                        </h3>
                        <div className="space-y-2">
                            {category.technologies.map((tech, idx) => (
                                <div key={idx} className="flex items-center">
                                    <span
                                        className={`w-2 h-2 ${category.dotColor} rounded-full mr-3`}
                                    ></span>
                                    <span className="text-gray-700">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export type { TechStackCategory };
