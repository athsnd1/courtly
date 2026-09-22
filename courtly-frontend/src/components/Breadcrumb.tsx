

interface Props {
    firstPage: string;
    secondPage: string;
}

export default function Breadcrumb({ firstPage, secondPage }: Props) {
  return (
    <div className="flex items-center gap-1">
        <p className="text-sec-text text-xs">{firstPage}</p>
        <span className="text-sec-text text-xs">{">"}</span>
        <p className="text-prim-text text-xs">{secondPage}</p>
    </div>
  )
}
