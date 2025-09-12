"use client"

import { AppSidebar } from "@/components/section/admin/app-sidebar"
import { ChartLineWater } from "@/components/section/admin/chart-line-water"
import { ChartPieReports } from "@/components/section/admin/chart-pie-reports"
import { MapHeatFlood } from "@/components/section/admin/map-heat-flood"
import { TableHistoricalFlood } from "@/components/section/admin/table-historical-flood"
import { SiteHeader } from "@/components/section/admin/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
	return (
		<SidebarProvider
			style={{
				"--sidebar-width": "calc(var(--spacing) * 72)",
				"--header-height": "calc(var(--spacing) * 12)",
			} as React.CSSProperties}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<div className="px-4 lg:px-6">
								<h1 className="text-2xl font-semibold">Statistik & Analisis</h1>
								<p className="text-muted-foreground mt-1">
									Analisis data banjir untuk pemerintah/instansi
								</p>
							</div>
							<div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:gap-6 lg:px-6">
								<div className="lg:col-span-2">
									<ChartLineWater />
								</div>
								<div className="lg:col-span-1">
									<ChartPieReports />
								</div>
							</div>
							<div className="px-4 lg:px-6">
								<MapHeatFlood />
							</div>
							<div className="px-4 lg:px-6">
								<TableHistoricalFlood />
							</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

