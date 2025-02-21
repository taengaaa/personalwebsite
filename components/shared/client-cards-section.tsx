"use client";

import React from "react";
import { Carousel, Card } from "@/components/home/apple-cards-carousel";

export interface Card {
  category: string;
  title: string;
  src: string;
  content: string;
}

interface ClientCardsSectionProps {
  title: string;
  cards: Card[];
}

export default function ClientCardsSection({ title, cards }: ClientCardsSectionProps) {
  const cardComponents = cards.map((card) => (
    <Card key={card.src} card={card} layout={true} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        {title}
      </h2>
      <Carousel items={cardComponents} />
    </div>
  );
}
