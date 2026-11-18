"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import DiscoverTab from "@/components/DiscoverTab";
import HomeTab from "@/components/HomeTab";
import TabBar from "@/components/TabBar";

export default function Page() {
  const [tab, setTab] = useState("discover");

  return (
    <AppShell>
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === "home" ? <HomeTab /> : <DiscoverTab />}
      </div>
      <TabBar active={tab} onChange={setTab} />
    </AppShell>
  );
}
