import { prisma } from "@/lib/prisma";
import AppLayout from "../components/AppLayout/AppLayout";

export default async function RootLayout({ children }) {
  const messages = await prisma.message.findMany({
    where: { created_at: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    include: { profile: { select: { full_name: true, image_url: true } } },
    orderBy: { created_at: "asc" },
  });

  const initialData = JSON.parse(JSON.stringify(messages));
  console.log(initialData);
  return (
    <html>
      <body>
        <AppLayout messages={initialData}>{children}</AppLayout>
      </body>
    </html>
  );
}
