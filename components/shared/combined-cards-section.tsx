"use server";

import React from "react";
import dynamic from "next/dynamic";
import { getCardsSection } from "@/lib/cards";

// Import client components
const ClientCardsSection = dynamic(
  () => import("@/components/shared/client-cards-section"),
  { ssr: true }
);

export async function CombinedCardsSection() {
  const data = await getCardsSection();

  if (!data) {
    return null;
  }

  return <ClientCardsSection title={data.title} cards={data.cards} />;
}
