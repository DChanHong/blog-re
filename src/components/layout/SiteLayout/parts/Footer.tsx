import TextLink from "@/components/ui/TextLink";
import { personalInfoData } from "@/data/careerData";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div>
                    <p className="footer-name">{personalInfoData.name}</p>
                    <p className="footer-description">{personalInfoData.position}</p>
                </div>
                <nav aria-label="하단 메뉴">
                    <p className="footer-label">사이트</p>
                    <ul className="footer-links">
                        <li>
                            <TextLink href="/work">프로젝트</TextLink>
                        </li>
                        <li>
                            <TextLink href="/writing">글</TextLink>
                        </li>
                        <li>
                            <TextLink href="/resume">이력서</TextLink>
                        </li>
                    </ul>
                </nav>
                <nav aria-label="외부 링크">
                    <p className="footer-label">다른 곳에서</p>
                    <ul className="footer-links">
                        <li>
                            <TextLink
                                href={personalInfoData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </TextLink>
                        </li>
                        <li>
                            <TextLink
                                href={personalInfoData.blog}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Velog
                            </TextLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} {personalInfoData.name}
                </p>
                <p>Next.js로 만들었습니다.</p>
            </div>
        </footer>
    );
}
