import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
  description: "CrftdWeb Engine security practices — encryption, access controls, and data protection for your business.",
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
