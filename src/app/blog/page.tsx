import React from "react";
import { Footer } from "../../components/Footer";
import { BlogList } from "../../components/BlogList";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Principal AI",
  description: "Insights on AI-powered software development, agent-driven systems, and the future of code.",
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags?: string[];
}

// Server-side function to read blog posts
async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), "public/blog");
  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));

  const posts = files
    .filter((file) => !file.startsWith("_")) // Exclude files starting with _
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      // Extract title (first # heading)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : slug;

      // Extract date
      const dateMatch = content.match(/\*\*Published:\*\*\s+(.+)$/m);
      const date = dateMatch ? dateMatch[1].trim() : "";

      // Extract author
      const authorMatch = content.match(/\*\*Author:\*\*\s+(.+)$/m);
      let author = authorMatch ? authorMatch[1].trim() : "";
      if (author.toLowerCase().includes("principal team")) {
        author = "";
      }

      // Extract tags
      const tagsMatch = content.match(/\*\*Tags:\*\*\s+(.+)$/m);
      let tags: string[] = [];
      if (tagsMatch) {
        tags = tagsMatch[1]
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      // Extract excerpt from first paragraph after metadata
      let excerpt = "";
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
        if (line.match(/\*\*Tags:\*\*/)) continue;
        if (!inContent) continue;
        if (line.match(/^#+\s+/)) {
          // Stop at second heading
          if (paragraphLines.length > 0) break;
          continue;
        }
        if (line.trim() === "") {
          // Continue collecting paragraphs until we have enough content
          if (paragraphLines.join(" ").length > 150) break;
          if (paragraphLines.length > 0) paragraphLines.push(" ");
          continue;
        }
        paragraphLines.push(line.trim());
      }

      excerpt = paragraphLines.join(" ");

      // Strip markdown formatting from excerpt
      excerpt = excerpt
        .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.+?)\*/g, "$1")     // Remove italic
        .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links, keep text
        .replace(/`(.+?)`/g, "$1")       // Remove inline code
        .slice(0, 200);

      if (excerpt.length === 200) excerpt += "...";

      return { slug, title, excerpt, date, author, tags };
    });

  // Sort by date (newest first)
  posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return posts;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "100%",
          overflow: "auto",
          backgroundColor: "#f7fcfd",
        }}
      >
        <BlogList posts={posts} />
        <Footer />
      </div>
    </div>
  );
}
