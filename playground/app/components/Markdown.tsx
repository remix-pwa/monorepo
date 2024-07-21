import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Markdown = ({ children }: { children: string }) => {
  const formatted = children
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <p style={{ whiteSpace: 'pre-line' }} {...props} />
      }}
    >
      {formatted}
    </ReactMarkdown>
  );
};

export default Markdown;