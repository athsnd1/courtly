

interface Props {
    username: string;
    summary: string;
}

export default function GreetingSummary({ username = "User", summary = "Summary" }: Props) {
  return (
    <div className="flex flex-col gap-1 mt-2 mb-2">
        <h1 className="text-2xl text-navy font-sora font-semibold">Hello, {username}</h1>
        <p className="text-sm text-sec-text font-sora">{ summary }</p>
    </div>
  )
}
