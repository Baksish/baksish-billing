import SideBar from "./Components/Navigation/SideBar";
import UserNavigation from "./Components/Navigation/UserNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-h-screen overflow-hidden">
      {/* Sidebar */}

      <aside className="w-[4.5rem] bg-slate-100">
        {/* You can use your existing SideBar component here */}
        {/* Or directly add Sidebar items */}
        <SideBar />
      </aside>

      {/* Main content */}

      <main className="flex-1 bg-white  py-2">{children}</main>
      <UserNavigation/>
      </div>
     

  );
}
