import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertAppointmentSchema, type InsertAppointment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AppointmentForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const form = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      notes: "",
      status: "pending",
    },
  });

  // Get available times for selected date
  const { data: availableTimes = [] } = useQuery({
    queryKey: ["/api/appointments/available", selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const response = await fetch(`/api/appointments/available/${selectedDate}`);
      if (!response.ok) throw new Error("Failed to fetch available times");
      return response.json();
    },
    enabled: !!selectedDate,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Randevunuz başarıyla oluşturuldu.",
      });
      form.reset();
      setSelectedDate("");
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata!",
        description: error.message || "Randevu oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAppointment) => {
    createAppointmentMutation.mutate(data);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="randevu" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Randevu Al
          </h2>
          <p className="text-lg text-muted-foreground">
            Bilgilerinizi doldurun ve randevunuzu hemen alın
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              Randevu Formu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad</FormLabel>
                        <FormControl>
                          <Input placeholder="Adınızı girin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Soyad</FormLabel>
                        <FormControl>
                          <Input placeholder="Soyadınızı girin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="0555 123 45 67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Randevu Tarihi</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={today}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setSelectedDate(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Randevu Saati</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Saat seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTimes.map((time: string) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notlar (İsteğe Bağlı)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Randevu ile ilgili özel notlarınızı yazın..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={createAppointmentMutation.isPending}
                    className="px-8 py-3 text-lg font-semibold"
                  >
                    {createAppointmentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Randevu Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Randevu Al
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
