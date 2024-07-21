import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import slug from 'rehype-slug'
import toc from '~/remark/toc'

const Markdown = ({ children }: { children: string }) => {
  const formatted = children
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm, toc]}
      rehypePlugins={[slug]}
      components={{
        p: ({ node, ...props }) => <p style={{ whiteSpace: 'pre-line' }} {...props} />,
        // h1: 'h2',
        // h2: ({ node, ...props }) => <p style={{ whiteSpace: 'pre-line' }} {...props} />
      }}
    >
      {formatted}
    </ReactMarkdown>
  );
};

export default Markdown;