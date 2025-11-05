"use client";

import PersonalInfoHeader from "@/components/domain/career/PersonalInfoHeader";
import CareerSummary from "@/components/domain/career/CareerSummary";
import ProjectTimeline from "@/components/domain/career/ProjectTimeline";
import TechStack from "@/components/domain/career/TechStack";
import {
    personalInfoData,
    careerSummaryData,
    projectsData,
    techStackData,
} from "@/data/careerData";

/**
 * CareerPage - 클라이언트 컴포넌트
 *
 * 성찬홍의 경력 정보를 타임라인 그래프 형태로 표시하는 페이지입니다.
 */
export default function CareerPage() {
    return (
        <div className="mx-auto">
            <PersonalInfoHeader personalInfo={personalInfoData} />
            <CareerSummary summaryItems={careerSummaryData} />
            <ProjectTimeline projects={projectsData} />
            <TechStack categories={techStackData} />
        </div>
    );
}
