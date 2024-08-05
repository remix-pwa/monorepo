import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism-plus';
import { cn } from '~/utils';

export const Codeblock = ({
  children
}: {
  children: string
}) => {
  const formatted = children
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();

  return (
    <ReactMarkdown
      className={cn('border h-[400px] max-h-[400px] flex flex-col border-gray-200 dark:border-gray-800 dark:shadow-gray-900 rounded-lg shadow-lg bg-white text-dark dark:bg-dark dark:text-white')}
      // @ts-ignore
      rehypePlugins={[rehypePrism]}
    >
      {formatted}
    </ReactMarkdown>
  )
}