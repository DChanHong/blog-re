export interface BlogCrawl {
    title: string;
    img_src: string;
    created_at: string;
    tags: string[];
    detail_link: string;
    intro: string;
}

// Supabase velog 테이블에 insert 할 때 사용하는 타입
export interface VelogInsertRow {
    title: string;
    img_src: string;
    created_at: string | Date;
    tags: string[];
    detail_link: string;
    intro: string;
}

// API 응답에 사용하는 DTO 타입
export interface VelogPostDto {
    id?: string;
    title: string;
    img_src: string;
    created_at: string; // ISO 문자열
    tags: string[];
    detail_link: string;
    intro: string;
    inserted_at?: string;
}
