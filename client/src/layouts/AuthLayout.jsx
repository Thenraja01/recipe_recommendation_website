import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
    
    <div className="flex  min-h-screen">
        <div className="hidden min-w-[400px] md:grid flex-1  min-h-full border border-r-blue-600">
           <div className="grid h-full place-content-center"></div>
        </div>
        <div className="w-[600px]">
            <Outlet/>
        </div>
    </div>
    </>
  )
}
