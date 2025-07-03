import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@shared/schema";

export default function AppointmentList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [email, setEmail] = useState("");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments/email", email],
    queryFn: async () => {
      if (!email) return [];
      const response = await fetch(`/api/appointments/email/${email}`);
      if (!response.ok) throw new Error("Randevular yüklenemedi");
      return response.json();
    },
    enabled: !!email,
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/appointments/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Randevu başarıyla silindi.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/email", email] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata!",
        description: error.message || "Randevu silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Randevu durumu güncellendi.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/email", email] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata!",
        description: error.message || "Randevu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    const matchesSearch = 
      appointment.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-8">
      {/* Email Input */}
      <Card>
        <CardHeader>
          <CardTitle>Randevularınızı Görüntüleyin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Email adresinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setEmail("")} variant="outline">
              Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      {email && (
        <>
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Randevu ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Durum filtrele" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Durumlar</SelectItem>
                      <SelectItem value="confirmed">Onaylandı</SelectItem>
                      <SelectItem value="pending">Beklemede</SelectItem>
                      <SelectItem value="cancelled">İptal Edildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Randevularım ({filteredAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Yükleniyor...</div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Henüz randevunuz bulunmamaktadır.
                </div>
              ) : (
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
                      {filteredAppointments.map((appointment: Appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.firstName} {appointment.lastName}</TableCell>
                          <TableCell>{appointment.phone}</TableCell>
                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {appointment.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateStatusMutation.mutate({ 
                                    id: appointment.id, 
                                    status: "cancelled" 
                                  })}
                                >
                                  İptal Et
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Randevu Silinsin Mi?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteAppointmentMutation.mutate(appointment.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Sil
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
