import ClientPage from "./ClientPage";

// ISR 1일 (86400초)
export const revalidate = 86400;

export default async function Home() {
    return <ClientPage />;
}
