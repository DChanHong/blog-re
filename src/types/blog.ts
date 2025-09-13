export interface BlogCrawl {
  title: string;
  img_src: string;
  created_at: string;
  tags: string[];
  detail_link: string;
  intro: string;
}

export interface BlogListRow {
  title: string;
  img_src: string;
  created_at: string | Date;
  tags: string;
  detail_link: string;
  intro: string;
}
