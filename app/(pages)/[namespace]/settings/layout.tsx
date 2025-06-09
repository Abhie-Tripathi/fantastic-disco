"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { namespace: string };
}) {
  const { namespace } = params;
  const pathname = usePathname();
  const urlName = pathname.split("/").slice(-1)[0];
  const router = useRouter();
  useEffect(() => {
    if(urlName==="users" || urlName ==="notifications" || urlName==="rolesandpermission"){
      router.push(`/${namespace}/settings/profile`);
    }
  }, [router]);
  return (
    <div className="w-full p-3">
      <Tabs value={urlName} className="w-full border-b">
        <TabsList className="h-auto p-0 bg-transparent rounded-none">
          <TabsTrigger
            value="profile"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href={`/${namespace}/settings/profile`}>Your Profile</Link>
          </TabsTrigger>
          {/* <TabsTrigger
            value="notifications"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href="/widget/settings/notifications">Notifications</Link>
          </TabsTrigger> */}
          {/* <TabsTrigger
            value="users"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href="/widget/settings/users">Manage Users</Link>
          </TabsTrigger> */}
          {namespace === "internal" ? (
            <TabsTrigger
              value="product"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              asChild
            >
              <Link href={`/${namespace}/settings/product`}>
                Product Settings
              </Link>
            </TabsTrigger>
          ) : (
            ""
          )}
          {/* <TabsTrigger
            value="product"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href={`/${namespace}/settings/product`}>
              Product settings
            </Link>
          </TabsTrigger> */}
            {/* <TabsTrigger
            value="rolesandpermission"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href={`/${namespace}/settings/rolesandpermission`}>Roles & Permissions</Link>
          </TabsTrigger> */}

          <TabsTrigger
            value="subscription"
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2  text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            asChild
          >
            <Link href={`/${namespace}/settings/subscription`}>Subscription</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-6">{children}</div>
    </div>
  );
}
