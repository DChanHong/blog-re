"use client";

interface CareerSummaryItem {
    id: string;
    content: string;
    highlight?: string[];
}

interface CareerSummaryProps {
    summaryItems: CareerSummaryItem[];
}

/**
 * CareerSummary - 경력 요약 컴포넌트
 *
 * 주요 경력 사항과 강점을 요약하여 표시하는 섹션입니다.
 */
export default function CareerSummary({ summaryItems }: CareerSummaryProps) {
    const renderContentWithHighlight = (content: string, highlights?: string[]) => {
        if (!highlights || highlights.length === 0) {
            return <span>{content}</span>;
        }

        let result = content;
        highlights.forEach((highlight) => {
            result = result.replace(highlight, `<strong>${highlight}</strong>`);
        });

        return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">💼 경력 요약</h2>
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8">
                <ul className="space-y-4 text-gray-300">
                    {summaryItems.map((item) => (
                        <li key={item.id} className="flex items-center">
                            <span className="text-blue-400 mr-3 mt-1">▶</span>
                            {renderContentWithHighlight(item.content, item.highlight)}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export type { CareerSummaryItem };
