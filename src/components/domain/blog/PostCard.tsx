import type { VelogPostDto } from "@/types/blog";

interface PostCardProps {
    post: VelogPostDto;
}

// 블로그 포스트 카드 컴포넌트 (전체 박스 클릭 가능)
export default function PostCard({ post }: PostCardProps) {
    return (
        <a
            href={post.detail_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-900/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none"
            aria-label={post.title}
        >
            {/* 썸네일 */}
            <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {post.img_src ? (
                    <>
                        <img
                            src={post.img_src}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-60" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <svg
                            className="w-12 h-12 text-gray-600 group-hover:text-purple-400 transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* 콘텐츠 */}
            <div className="p-6">
                {/* 카테고리(첫 태그) & 날짜 */}
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">
                        {(post.tags && post.tags[0]) || "Blog"}
                    </span>
                    <time className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </time>
                </div>

                {/* 제목 */}
                <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {post.title}
                </h2>

                {/* 요약 */}
                {post.intro && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-5 leading-relaxed">{post.intro}</p>
                )}

                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tagItem) => (
                        <span
                            key={tagItem}
                            className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded hover:bg-white/10 transition-colors border border-white/5"
                        >
                            #{tagItem}
                        </span>
                    ))}
                    {post.tags && post.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                            +{post.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}
