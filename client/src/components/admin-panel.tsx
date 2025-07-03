import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, Clock, XCircle, Users, Eye, Settings, Download, CalendarX, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@shared/schema";

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      toast({
        title: "Başarılı!",
        description: "Admin paneline hoş geldiniz.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata!",
        description: error.message || "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isLoggedIn,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
    enabled: isLoggedIn,
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Randevu durumu güncellendi.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata!",
        description: error.message || "Randevu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-secondary">Onaylandı</Badge>;
      case "pending":
        return <Badge className="bg-accent">Beklemede</Badge>;
      case "cancelled":
        return <Badge variant="destructive">İptal Edildi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Girişi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kullanıcı Adı</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Şifre</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
            <div className="mt-4 text-sm text-muted-foreground">
              Test için: admin / admin123
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Toplam Randevu</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Onaylanan</p>
                <p className="text-2xl font-bold">{stats?.confirmed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Beklemede</p>
                <p className="text-2xl font-bold">{stats?.pending || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-destructive text-white rounded-full w-12 h-12 flex items-center justify-center">
                <XCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">İptal Edildi</p>
                <p className="text-2xl font-bold">{stats?.cancelled || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tüm Randevular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Saat</TableHead>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment: Appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.firstName} {appointment.lastName}</TableCell>
                        <TableCell>{appointment.phone}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Select
                              value={appointment.status}
                              onValueChange={(status) => 
                                updateAppointmentMutation.mutate({ 
                                  id: appointment.id, 
                                  status 
                                })
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Beklemede</SelectItem>
                                <SelectItem value="confirmed">Onayla</SelectItem>
                                <SelectItem value="cancelled">İptal Et</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" onClick={() => window.location.href = "/#randevu"}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Randevu
                </Button>
                <Button className="w-full justify-start bg-secondary hover:bg-secondary/90" disabled>
                  <CalendarX className="mr-2 h-4 w-4" />
                  Haftalık Görünüm
                </Button>
                <Button className="w-full justify-start bg-accent hover:bg-accent/90" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Rapor İndir
                </Button>
                <Button className="w-full justify-start bg-gray-600 hover:bg-gray-700" disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Ayarlar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
