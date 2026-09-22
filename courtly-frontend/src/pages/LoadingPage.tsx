import { RotatingLines } from "react-loader-spinner";

export default function LoadingPage() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-bgcol -mt-20 sm:mt-0">
        <RotatingLines
            visible={true}
            height="48"
            width="48"
            color="#0a2540"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    </div>
  )
}
