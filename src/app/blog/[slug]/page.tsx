import React from "react";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { BlogPostViewer } from "@/components/BlogPostViewer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), "public/blog");
  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));

  return files
    .filter((file) => !file.startsWith("_"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogDir = path.join(process.cwd(), "public/blog");
  const filePath = path.join(blogDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return {
      title: "Post Not Found | Principal AI",
    };
  }

  const content = fs.readFileSync(filePath, "utf-8");

  // Extract title
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  // Extract excerpt for description
  const lines = content.split("\n");
  let inContent = false;
  let paragraphLines: string[] = [];

  for (const line of lines) {
    if (line.match(/^#\s+/)) {
      inContent = true;
      continue;
    }
    if (line.match(/\*\*Published:\*\*/)) continue;
    if (line.match(/\*\*Author:\*\*/)) continue;
    if (!inContent) continue;
    if (line.trim() === "") {
      if (paragraphLines.length > 0) break;
      continue;
    }
    if (line.match(/^#+\s+/)) continue;
    paragraphLines.push(line.trim());
  }

  const description = paragraphLines.join(" ").slice(0, 160);

  return {
    title: `${title} | Principal AI Blog`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

async function getBlogPost(slug: string): Promise<string | null> {
  const blogDir = path.join(process.cwd(), "public/blog");
  const filePath = path.join(blogDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf-8");
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getBlogPost(slug);

  if (!content) {
    notFound();
  }

  return <BlogPostViewer slug={slug} content={content} />;
}
