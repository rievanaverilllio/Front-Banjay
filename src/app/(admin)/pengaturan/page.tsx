"use client"

import * as React from "react"
import { IconDotsVertical, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"

import { AppSidebar } from "@/components/section/admin/app-sidebar"
import { SiteHeader } from "@/components/section/admin/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Role = "User" | "Admin"
type Status = "aktif" | "non-aktif"

type User = {
  id: number
  name: string
  email: string
  role: Role
  status: Status
  createdAt: string
  lastLogin?: string
}

const initialUsers: User[] = [
  { id: 1, name: "Admin Utama", email: "admin@bpbd.go.id", role: "Admin", status: "aktif", createdAt: "2025-06-01", lastLogin: "2025-09-10 08:33" },
  { id: 2, name: "Operator Posko", email: "operator@bpbd.go.id", role: "User", status: "aktif", createdAt: "2025-07-14", lastLogin: "2025-09-11 17:21" },
  { id: 3, name: "Staf BPBD", email: "staff@bpbd.go.id", role: "User", status: "non-aktif", createdAt: "2025-07-28" },
]

type RolePerm = {
  role: Role
  tambah_sensor: boolean
  kelola_posko: boolean
  kelola_notifikasi: boolean
  kelola_menu: boolean
  kelola_user: boolean
}

const initialPerms: RolePerm[] = [
  { role: "User", tambah_sensor: true, kelola_posko: false, kelola_notifikasi: true, kelola_menu: false, kelola_user: false },
  { role: "Admin", tambah_sensor: true, kelola_posko: true, kelola_notifikasi: true, kelola_menu: true, kelola_user: true },
]

const loginHistory = [
  { device: "Chrome on Windows", location: "Jakarta", time: "2025-09-11 17:21" },
  { device: "Safari on iPhone", location: "Depok", time: "2025-09-10 08:33" },
  { device: "Edge on Windows", location: "Bogor", time: "2025-09-08 12:05" },
]

const auditLogs = [
  { time: "2025-09-11 17:24", user: "Admin Utama", action: "Ubah data posko #32" },
  { time: "2025-09-11 17:21", user: "Operator Posko", action: "Login" },
  { time: "2025-09-10 14:08", user: "Admin Utama", action: "Tambah user 'Staf BPBD'" },
  { time: "2025-09-09 09:40", user: "Operator Posko", action: "Buat laporan kejadian" },
]

export default function Page() {
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [editing, setEditing] = React.useState<User | null>(null)
  const [openForm, setOpenForm] = React.useState(false)
  const [perms, setPerms] = React.useState<RolePerm[]>(initialPerms)
  const [logSortBy, setLogSortBy] = React.useState<"time" | "user">("time")
  const [logUserFilter, setLogUserFilter] = React.useState<string>("all")

  function upsertUser(partial: Omit<User, "id" | "createdAt"> & { id?: number }) {
    if (partial.id) {
      setUsers((prev) => prev.map((u) => (u.id === partial.id ? { ...u, ...partial } as User : u)))
    } else {
      const id = Math.max(0, ...users.map((u) => u.id)) + 1
      setUsers((prev) => [
        ...prev,
        { id, name: partial.name, email: partial.email, role: partial.role, status: partial.status, createdAt: new Date().toISOString().slice(0, 10) },
      ])
    }
  }

  function removeUser(id: number) {
    if (confirm("Hapus user ini?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
    }
  }

  function togglePerm(role: Role, key: keyof RolePerm) {
    if (key === "role") return
    setPerms((prev) =>
      prev.map((r) =>
        r.role === role ? { ...r, [key]: !(r as any)[key] } : r
      )
    )
  }

  const sortedFilteredLogs = React.useMemo(() => {
    let data = [...auditLogs]
    if (logUserFilter !== "all") data = data.filter((l) => l.user === logUserFilter)
    data.sort((a, b) => {
      if (logSortBy === "time") return a.time < b.time ? 1 : -1
      return a.user.localeCompare(b.user)
    })
    return data
  }, [logSortBy, logUserFilter])

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
                <h1 className="text-2xl font-semibold">Pengaturan</h1>
                <p className="text-muted-foreground mt-1">Kelola pengguna, role, keamanan akun, dan log aktivitas.</p>
              </div>
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="users" className="w-full">
                  <TabsList>
                    <TabsTrigger value="users">Manajemen Pengguna</TabsTrigger>
                    <TabsTrigger value="roles">Hak Akses</TabsTrigger>
                    <TabsTrigger value="security">Keamanan Akun</TabsTrigger>
                    <TabsTrigger value="audit">Log Aktivitas</TabsTrigger>
                  </TabsList>

                  {/* Manajemen Pengguna */}
                  <TabsContent value="users" className="mt-4">
                    <Card>
                      <CardHeader className="flex-row items-center justify-between">
                        <div>
                          <CardTitle>Manajemen Pengguna</CardTitle>
                          <CardDescription>
                            Hanya untuk Admin <Badge variant="outline">Admin only</Badge>
                          </CardDescription>
                        </div>
                        <Drawer open={openForm} onOpenChange={setOpenForm}>
                          <DrawerTrigger asChild>
                            <Button size="sm">
                              <IconPlus /> Tambah User
                            </Button>
                          </DrawerTrigger>
                          <UserForm
                            user={editing}
                            onCancel={() => { setEditing(null); setOpenForm(false) }}
                            onSubmit={(payload) => {
                              upsertUser(payload)
                              setEditing(null)
                              setOpenForm(false)
                            }}
                          />
                        </Drawer>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead>Login Terakhir</TableHead>
                                <TableHead className="w-12"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {users.map((u) => (
                                <TableRow key={u.id}>
                                  <TableCell>{u.name}</TableCell>
                                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                  <TableCell>
                                    <Select
                                      value={u.role}
                                      onValueChange={(val) => setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, role: val as Role } : x))}
                                    >
                                      <SelectTrigger size="sm" className="w-28">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="User">User</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={u.status}
                                      onValueChange={(val) => setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: val as Status } : x))}
                                    >
                                      <SelectTrigger size="sm" className="w-28">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="non-aktif">Non-aktif</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>{new Date(u.createdAt).toLocaleDateString("id-ID")}</TableCell>
                                  <TableCell>{u.lastLogin ?? "-"}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                          <IconDotsVertical />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-36">
                                        <DropdownMenuItem onClick={() => { setEditing(u); setOpenForm(true) }}>
                                          <IconEdit /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem variant="destructive" onClick={() => removeUser(u.id)}>
                                          <IconTrash /> Hapus
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Role Management */}
                  <TabsContent value="roles" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Hak Akses / Role Management</CardTitle>
                        <CardDescription>Atur hak akses per role</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="overflow-hidden rounded-lg border">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead>Permission</TableHead>
                                {perms.map((p) => (
                                  <TableHead key={p.role} className="text-center">{p.role}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(["tambah_sensor","kelola_posko","kelola_notifikasi","kelola_menu","kelola_user"] as (keyof RolePerm)[]).map((permKey) => (
                                <TableRow key={permKey}>
                                  <TableCell className="capitalize">{permKey.replace(/_/g, " ")}</TableCell>
                                  {perms.map((p) => (
                                    <TableCell key={p.role} className="text-center">
                                      <input
                                        type="checkbox"
                                        checked={(p as any)[permKey] as boolean}
                                        onChange={() => togglePerm(p.role, permKey)}
                                      />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline">Simpan Perubahan</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Account Security */}
                  <TabsContent value="security" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ganti Password</CardTitle>
                        <CardDescription>Ubah password akun Anda</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          className="grid gap-4"
                          onSubmit={(e) => {
                            e.preventDefault()
                            alert("Password berhasil diubah (mock)")
                          }}
                        >
                          <div className="grid gap-2">
                            <Label htmlFor="current">Password Saat Ini</Label>
                            <Input id="current" type="password" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="new">Password Baru</Label>
                            <Input id="new" type="password" minLength={8} required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="confirm">Konfirmasi Password</Label>
                            <Input id="confirm" type="password" minLength={8} required />
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Simpan</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Kirim link reset via email</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          className="grid gap-4"
                          onSubmit={(e) => {
                            e.preventDefault()
                            alert("Link reset terkirim (mock)")
                          }}
                        >
                          <div className="grid gap-2">
                            <Label htmlFor="email-reset">Email</Label>
                            <Input id="email-reset" type="email" required placeholder="nama@bpbd.go.id" />
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit" variant="outline">Kirim</Button>
                          </div>
                        </form>
                        <Separator className="my-4" />
                        <div>
                          <h3 className="mb-2 text-sm font-medium">Riwayat Login</h3>
                          <div className="overflow-hidden rounded-lg border">
                            <Table>
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  <TableHead>Device</TableHead>
                                  <TableHead>Lokasi</TableHead>
                                  <TableHead>Waktu</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {loginHistory.map((l, i) => (
                                  <TableRow key={i}>
                                    <TableCell>{l.device}</TableCell>
                                    <TableCell>{l.location}</TableCell>
                                    <TableCell>{l.time}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Audit Log */}
                  <TabsContent value="audit" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Log Aktivitas (Audit Trail)</CardTitle>
                        <CardDescription>Monitoring aktivitas user</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Label className="mr-2">Urutkan:</Label>
                          <Select value={logSortBy} onValueChange={(v) => setLogSortBy(v as any)}>
                            <SelectTrigger className="w-40" size="sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="time">Tanggal/Waktu</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                          <Label className="ml-4 mr-2">Filter user:</Label>
                          <Select value={logUserFilter} onValueChange={setLogUserFilter}>
                            <SelectTrigger className="w-44" size="sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua</SelectItem>
                              {Array.from(new Set(auditLogs.map((l) => l.user))).map((u) => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="overflow-hidden rounded-lg border">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead>Waktu</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedFilteredLogs.map((l, i) => (
                                <TableRow key={i}>
                                  <TableCell>{l.time}</TableCell>
                                  <TableCell>{l.user}</TableCell>
                                  <TableCell>{l.action}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function UserForm({
  user,
  onSubmit,
  onCancel,
}: {
  user: User | null
  onSubmit: (payload: Omit<User, "id" | "createdAt"> & { id?: number }) => void
  onCancel: () => void
}) {
  const [name, setName] = React.useState(user?.name ?? "")
  const [email, setEmail] = React.useState(user?.email ?? "")
  const [role, setRole] = React.useState<Role>(user?.role ?? "User")
  const [status, setStatus] = React.useState<Status>(user?.status ?? "aktif")

  React.useEffect(() => {
    setName(user?.name ?? "")
    setEmail(user?.email ?? "")
    setRole(user?.role ?? "User")
    setStatus(user?.status ?? "aktif")
  }, [user])

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{user ? "Edit User" : "Tambah User"}</DrawerTitle>
      </DrawerHeader>
      <div className="px-4 pb-4">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit({ id: user?.id, name, email, role, status })
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="non-aktif">Non-aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit">Simpan</Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button" onClick={onCancel}>Batal</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </div>
    </DrawerContent>
  )
}
