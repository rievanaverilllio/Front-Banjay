"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Row = {
  date: string
  location: string
  levelCm: number
  durationH: number
  impact: string
}

const rows: Row[] = [
  { date: "2025-08-04", location: "Kebon Jeruk", levelCm: 145, durationH: 3.5, impact: "Rumah" },
  { date: "2025-07-22", location: "Cawang", levelCm: 170, durationH: 2.0, impact: "Jalan" },
  { date: "2025-07-09", location: "Kemayoran", levelCm: 120, durationH: 1.2, impact: "Fasum" },
  { date: "2025-06-18", location: "Senen", levelCm: 135, durationH: 4.1, impact: "Rumah" },
  { date: "2025-06-02", location: "Tanah Abang", levelCm: 160, durationH: 2.7, impact: "Jalan" },
]

export function TableHistoricalFlood() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Historis</CardTitle>
        <CardDescription>Catatan banjir sebelumnya</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Ketinggian (cm)</TableHead>
                <TableHead>Durasi (jam)</TableHead>
                <TableHead>Dampak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(r.date).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell>{r.levelCm}</TableCell>
                  <TableCell>{r.durationH}</TableCell>
                  <TableCell>{r.impact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
