"use client"

import Image from "next/image";
import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  // Added for new menu items
  IconMapPin,
  IconCloudRain,
  IconBell,
  IconLifebuoy,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/section/admin/nav-documents"
import { NavMain } from "@/components/section/admin/nav-main"
import { NavSecondary } from "@/components/section/admin/nav-secondary"
import { NavUser } from "@/components/section/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Peta Lokasi",
      url: "#",
      icon: IconMapPin,
    },
    {
      title: "Data Curah Hujan",
      url: "#",
      icon: IconCloudRain,
    },
    {
      title: "Laporan Masyarakat",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Notifikasi / Peringatan Dini",
      url: "#",
      icon: IconBell,
    },
    {
      title: "Posko & Kontak Darurat",
      url: "#",
      icon: IconLifebuoy,
    },
    {
      title: "Statistik & Analisis",
      url: "#",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Cari",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Pustaka Data",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Laporan",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Asisten Dokumen",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image className="!size-8"
                  src="/favicon.ico" 
                  alt="Logo BANJAY" 
                  width={20}
                  height={20}
                />
                <span className="text-base font-semibold">BANJAY</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
