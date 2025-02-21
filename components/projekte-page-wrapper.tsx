'use client';

import { NavBar } from "./shared/navbar";

export function ProjektePageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar activePage="Projekte" />
      {children}
    </>
  );
}
