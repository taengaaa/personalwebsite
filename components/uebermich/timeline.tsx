"use client";

import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineEntry[];
}

export const Timeline = ({ items }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(element);
      return () => {
        resizeObserver.unobserve(element);
        resizeObserver.disconnect();
      };
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 70%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-20 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">Keine Timeline-Einträge gefunden</p>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10 rounded-2xl"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex justify-start pt-10 md:pt-20 md:gap-6"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-48">
              <motion.div 
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center shadow-[0_0_24px_rgba(34,_42,_53,_0.06)]"
                whileInView={{ scale: [0.8, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </motion.div>
              <motion.h3 
                className="hidden md:block text-xl md:pl-12 md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 break-words hyphens-auto"
                style={{ wordBreak: 'break-word', hyphens: 'auto' }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {item.title}
              </motion.h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-2 w-full">
              <motion.h3 
                className="md:hidden block text-xl mb-4 text-left font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 whitespace-nowrap"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {item.title}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: (index * 0.2) + 0.2 }}
                className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_24px_rgba(34,_42,_53,_0.06)]"
              >
                {item.content}
              </motion.div>
            </div>
          </motion.div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
