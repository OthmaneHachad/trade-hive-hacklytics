import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
    content: string; // Markdown content must be a string
  }


const MarkdownRenderer: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
