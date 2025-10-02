import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

function extractMetadata(content: string): { title: string; date: string; author: string; excerpt: string } {
  let title = 'Untitled';
  let date = '';
  let author = '';
  let excerpt = '';

  // Extract title (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1];
  }

  // Extract metadata
  const dateMatch = content.match(/\*\*Published:\*\*\s+(.+)$/m);
  if (dateMatch) {
    date = dateMatch[1];
  }

  const authorMatch = content.match(/\*\*Author:\*\*\s+(.+)$/m);
  if (authorMatch) {
    author = authorMatch[1];
  }

  // Extract excerpt (first paragraph after metadata)
  const paragraphs = content
    .split('\n\n')
    .filter(p =>
      !p.startsWith('#') &&
      !p.includes('**Published:**') &&
      !p.includes('**Author:**') &&
      p.trim().length > 0
    );

  if (paragraphs.length > 0) {
    excerpt = paragraphs[0].replace(/\n/g, ' ').trim().substring(0, 200) + '...';
  }

  return { title, date, author, excerpt };
}

export async function GET() {
  try {
    const blogDir = path.join(process.cwd(), 'public', 'blog');

    // Check if blog directory exists
    if (!fs.existsSync(blogDir)) {
      return NextResponse.json({ posts: [] });
    }

    const files = fs.readdirSync(blogDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const posts: BlogPost[] = markdownFiles.map(filename => {
      const filePath = path.join(blogDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const slug = filename.replace('.md', '');
      const metadata = extractMetadata(content);

      return {
        slug,
        ...metadata
      };
    });

    // Sort by date (newest first)
    posts.sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01');
      const dateB = new Date(b.date || '1970-01-01');
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error listing blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to list blog posts' },
      { status: 500 }
    );
  }
}
