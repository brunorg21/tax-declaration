import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-8 md:p-10 bg-white rounded-xl shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
