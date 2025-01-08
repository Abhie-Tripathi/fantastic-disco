import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Tabs defaultValue="profile" className="w-full border-b">
        <TabsList className="h-auto p-0 bg-transparent rounded-none">
          <TabsTrigger
            value="profile"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href="/widget/settings/profile">Your Profile</Link>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href="/widget/settings/notifications">Notifications</Link>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href="/widget/settings/users">Manage Users</Link>
          </TabsTrigger>
          <TabsTrigger
            value="product"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href="/widget/settings/product">Product settings</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-6">{children}</div>
    </div>
  );
}
