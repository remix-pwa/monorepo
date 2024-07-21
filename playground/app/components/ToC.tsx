export const ToC = ({
  headings,
}: {
  headings: any[];
  // next?: null | any; // page footer - // page/page header/footer,etc.
  // prev?: null | any;
}) => {
  return (
    <div className="fixed bottom-0 right-[max(0px,calc(50%-45rem))] top-[48px] z-20 hidden w-[19.5rem] overflow-y-auto py-8 xl:block">
      <nav aria-labelledby="table-of-contents" className="px-8 gap-4 flex flex-col overflow-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent">
        <ul className="border-l border-l-gray-400 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} className="flex">
              <a href={`#${heading.id}`} className="flex flex-row items-baseline left-[-1px] relative text-sm py-1 ps-3 hover:text-gray-500 transition-all border-l border-transparent">
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}