"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSearch, Home, PersonStanding, ScanLine } from "lucide-react";

const externalLinks = [
  {
    href: "https://yolo-yoga-sim.vercel.app/",
    title: "Yoga Simulator",
    icon: PersonStanding,
  },
  {
    href: "https://rag-local-samarth-shuklas-projects-ea712626.vercel.app/",
    title: "Local Inference of Medical Reports",
    icon: FileSearch,
  },
  {
    href: "https://github.com/samarthshukla6/Image_Processing_MedVit",
    title: "Medical Imaging",
    icon: ScanLine,
  },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = pathname === "/";

  const linkClassName = (active: boolean) =>
    `p-2 rounded-xl transition-colors ${
      active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-16 md:w-20 h-screen bg-white border-r border-gray-200 flex flex-col items-center py-6">
      <div className="w-10 h-10 rounded-full bg-indigo-600 mb-8 flex items-center justify-center text-white font-bold text-sm">
        HX
      </div>
      <nav className="flex flex-col items-center gap-2">
        <Link href="/" className={linkClassName(isActive)} title="Consultation">
          <Home className="w-6 h-6" />
          <span className="sr-only">Consultation</span>
        </Link>
        {externalLinks.map(({ href, title, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName(false)}
            title={title}
          >
            <Icon className="w-6 h-6" />
            <span className="sr-only">{title}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
