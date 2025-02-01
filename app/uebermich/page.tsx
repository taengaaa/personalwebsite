"use client";

import { NavBar } from "@/components/ui/navbar";
import { Home, User, BookOpen, Briefcase } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";

const navItems = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "Über mich",
    url: "/uebermich",
    icon: User,
  },
  {
    name: "Blog",
    url: "/blog",
    icon: BookOpen,
  },
  {
    name: "Projekte",
    url: "/projekte",
    icon: Briefcase,
  },
];

const timelineData = [
  {
    title: "2024",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Aktuelle Position als Softwareentwickler mit Fokus auf moderne Webtechnologien.
          Entwicklung innovativer Lösungen und kontinuierliche Weiterbildung.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
            alt="Coding Setup"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <Image
            src="https://images.unsplash.com/photo-1552308995-2baac1ad5490"
            alt="Team Collaboration"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2020-2023",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Berufliche Entwicklung und Spezialisierung auf moderne Webtechnologien.
          Sammlung wertvoller Erfahrungen in verschiedenen Projekten.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Entwicklung von React & Next.js Anwendungen
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Implementation von UI/UX Best Practices
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Agile Entwicklungsmethoden
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Continuous Integration/Deployment
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
            alt="Team Meeting"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <Image
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12"
            alt="Development Process"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2016-2020",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Studium der Informatik mit Fokus auf Softwareentwicklung.
          Erste praktische Erfahrungen durch Praktika und eigene Projekte.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66"
            alt="University Campus"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
            alt="Learning Process"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      </div>
    ),
  },
];

export default function UeberMichPage() {
  return (
    <>
      <NavBar activePage="Über mich" />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-24">
        <section className="container py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Über mich
          </h1>
          <div className="prose prose-invert max-w-none mb-16">
            <p className="text-xl text-muted-foreground">
              Willkommen auf meiner persönlichen Seite! Ich bin ein leidenschaftlicher Softwareentwickler
              mit Fokus auf moderne Webtechnologien. Hier ist ein Einblick in meinen bisherigen Werdegang:
            </p>
          </div>
          <Timeline data={timelineData} />
        </section>
      </main>
    </>
  );
}
