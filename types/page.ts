import { Metadata } from 'next';

export type PageParams = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type PageProps<P = {}, SP = {}> = {
  params: P;
  searchParams: SP;
};
