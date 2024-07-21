import Markdown from "~/components/Markdown";

export default function Component() {
  return (
    <div>
      <Markdown>
        {`
        # Hello, world!

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, debitis illo minima aspernatur perferendis harum eaque id facere iure cum!
      `}
      </Markdown>
    </div>
  )
}
