import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";

interface ErrorPageProp {
  errorText?: string;
};

export default function ErrorPage({ errorText }: ErrorPageProp) {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return(
        <div className="h-dvh w-screen flex flex-col items-center justify-center gap-2 bg-bgcol">
            
            <HiExclamationCircle className="text-navy text-4xl"/>

            <p className="text-2xl text-sec-navy font-sora">
            {error.status} {error.statusText}
            </p>

            <p className="text-sec-navy text-2xl font-sora">
            {error.data}
            </p>

        </div>
    )
  }

  return(
    <div className="h-dvh w-screen flex flex-col items-center justify-center gap-2 bg-bgcol">

        <HiExclamationCircle className="text-navy text-4xl"/>

        <p className="text-2xl text-sec-navy font-sora">{errorText || "Something went wrong"}</p>

    </div>
  )
}
