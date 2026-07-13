import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function isMarkdown(text: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s/m, // Headers
    /\*\*|__/m, // Bold
    /\*|_/m, // Italic
    /^\s*[-*+]\s/m, // Lists
    /^\s*\d+\.\s/m, // Ordered lists
    /\[.*?\]\(.*?\)/m, // Links
    /!\[.*?\]\(.*?\)/m, // Images
    /^\s*```/m, // Code blocks
    /^\s*>\s/m, // Blockquotes
    /\|.*\|/m, // Tables
    /^---\s*$/m, // Horizontal rules
    /^\s*[-*]{3,}\s*$/m, // Horizontal rules
    /`[^`]+`/m, // Inline code
    /~~.*?~~/m, // Strikethrough
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!isMarkdown(content)) {
    return (
      <div className={`whitespace-pre-wrap text-foreground ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`prose prose-sm max-w-none text-foreground ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            />
          ),
          table: ({ node, ...props }) => (
            <table
              {...props}
              className="w-full border-collapse border border-border text-sm"
            />
          ),
          thead: ({ node, ...props }) => (
            <thead {...props} className="bg-muted" />
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="border border-border px-3 py-2 text-left font-semibold"
            />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="border border-border px-3 py-2" />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} className="even:bg-muted/50" />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !className;
            return isInline ? (
              <code
                {...props}
                className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground"
              >
                {children}
              </code>
            ) : (
              <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                <code {...props} className={`text-sm font-mono ${className || ""}`}>
                  {children}
                </code>
              </pre>
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-border pl-4 italic text-muted-foreground"
            />
          ),
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-4 border-border" />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc pl-6" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal pl-6" />
          ),
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-xl font-bold mt-5 mb-3" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-lg font-semibold mt-4 mb-2" />
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="text-base font-semibold mt-3 mb-2" />
          ),
          h5: ({ node, ...props }) => (
            <h5 {...props} className="text-sm font-semibold mt-3 mb-1" />
          ),
          h6: ({ node, ...props }) => (
            <h6 {...props} className="text-xs font-semibold mt-3 mb-1" />
          ),
          p: ({ node, ...props }) => <p {...props} className="mb-4 leading-relaxed" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
