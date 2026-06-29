import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <Outlet />
    </div>
  )
}
