interface Props {
    page_name: string;
    page_summary: string;
}

export default function PageInfo ({ page_name = "Page", page_summary = "Summary" }: Props) {
  return (
    <div className="flex flex-col gap-1 mt-2 mb-2">
        <h1 className="text-2xl text-navy font-sora font-semibold">{page_name}</h1>
        <p className="text-sm text-sec-text font-sora">{ page_summary }</p>
    </div>
  )
}
