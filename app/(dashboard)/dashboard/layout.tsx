import Navbar from "@/components/navbar";

export const metadata = {
  title: "Dashboard",
  // themeColor: [
  //   { media: "(prefers-color-scheme: dark)", color: "#000000" },
  //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  // ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
