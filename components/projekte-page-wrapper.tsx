'use client';

import { NavBar } from "./ui/navbar";

export function ProjektePageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar activePage="Projekte" />
      {children}
    </>
  );
}
