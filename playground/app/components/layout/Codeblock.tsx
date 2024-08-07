import { copyTextToClipboard } from '@remix-pwa/client';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism-plus';
import { cn } from '~/utils';
import { Icon } from '../core/Icon';
import { useState } from 'react';

export const Codeblock = ({
  children,
  lang = 'plain',
  className = '',
  onCodeSwitch = () => {},
}: {
  children: string;
  lang: string;
  className?: string;
  onCodeSwitch?: () => void;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const formatted = children
    // .split('\n')
    // .map(line => line.trim())
    // .join('\n')
    .trim();

    const handleCopy = () => {
      copyTextToClipboard(
        formatted
          .split('\n')
          .slice(1, -1)
          .join('\n')
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

  return (
    <div className={cn("relative h-full rounded-lg", className)}>
      <ReactMarkdown
        className={cn('border h-full relative flex flex-col border-gray-200 dark:border-gray-800 rounded-lg bg-white text-dark dark:bg-dark dark:text-white')}
        // @ts-ignore
        rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
      >
        {formatted}
      </ReactMarkdown>
      <div className='absolute top-1 right-3 text-sm text-gray-600 dark:text-gray-400 select-none'>{lang}</div>
      <div className='absolute top-0 right-0 size-32 sm:h-28 sm:w-48 lg:h-16 lg:w-28 bg-transparent group flex gap-2 justify-end'>
        <button
          onClick={onCodeSwitch}
          className="mt-2 p-2 h-min bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md transition-opacity opacity-0 group-hover:opacity-70 hover:!opacity-100 group-hover:text-slate-950/85 hover:!text-slate-950 dark:group-hover:text-white/85 dark:hover:!text-white"
        >
          <Icon name="code" className="size-5" />
        </button>
        <button
          onClick={handleCopy}
          className="mt-2 mr-2.5 p-2 h-min bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md transition-opacity opacity-0 group-hover:opacity-90 hover:!opacity-100 group-hover:text-slate-950/50 hover:!text-slate-950 dark:group-hover:text-white/50 dark:hover:!text-white"
        >
          <Icon name={isCopied ? 'copy-check' : 'copy'} className="size-5" />
        </button>
      </div>
    </div>
  )
}
