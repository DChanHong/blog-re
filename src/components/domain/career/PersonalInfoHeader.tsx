"use client";

interface PersonalInfo {
    name: string;
    position: string;
    company: string;
    period: string;
    university: string;
    phone: string;
    email: string;
    github: string;
    blog: string;
}

interface PersonalInfoHeaderProps {
    personalInfo: PersonalInfo;
}

/**
 * PersonalInfoHeader - 개인정보 헤더 컴포넌트
 *
 * 이름, 포지션, 연락처 등 개인 정보를 표시하는 헤더 섹션입니다.
 */
export default function PersonalInfoHeader({ personalInfo }: PersonalInfoHeaderProps) {
    return (
        <header className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
                <h1 className="text-5xl font-bold mb-4">{personalInfo.name}</h1>
                <p className="text-2xl mb-2">{personalInfo.position}</p>
                <p className="text-lg opacity-90">
                    {personalInfo.company} • {personalInfo.period}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 shadow-md">
                    <p className="text-gray-600">대학교</p>
                    <p className="font-semibold">{personalInfo.university}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                    <p className="text-gray-600">연락처</p>
                    <p className="font-semibold">{personalInfo.phone}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                    <p className="text-gray-600">이메일</p>
                    <p className="font-semibold text-blue-600">{personalInfo.email}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                    <p className="text-gray-600">GitHub</p>
                    <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        GitHub 프로필
                    </a>
                </div>
            </div>
        </header>
    );
}

export type { PersonalInfo };
