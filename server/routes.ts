import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Randevular yüklenirken hata oluştu" });
    }
  });

  // Get appointments by email
  app.get("/api/appointments/email/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const appointments = await storage.getAppointmentsByEmail(email);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Randevular yüklenirken hata oluştu" });
    }
  });

  // Create new appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Geçersiz veri",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Randevu oluşturulurken hata oluştu" });
      }
    }
  });

  // Update appointment
  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, validatedData);
      
      if (!appointment) {
        return res.status(404).json({ message: "Randevu bulunamadı" });
      }
      
      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Geçersiz veri",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Randevu güncellenirken hata oluştu" });
      }
    }
  });

  // Delete appointment
  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAppointment(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Randevu bulunamadı" });
      }
      
      res.json({ message: "Randevu başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ message: "Randevu silinirken hata oluştu" });
    }
  });

  // Get appointment stats for admin
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAppointmentStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "İstatistikler yüklenirken hata oluştu" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password || !user.isAdmin) {
        return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
      }
      
      res.json({ message: "Giriş başarılı", user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Giriş yapılırken hata oluştu" });
    }
  });

  // Get available time slots for a date
  app.get("/api/appointments/available/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const appointments = await storage.getAppointments();
      const bookedTimes = appointments
        .filter(a => a.date === date && a.status !== 'cancelled')
        .map(a => a.time);
      
      const allTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
      const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
      
      res.json(availableTimes);
    } catch (error) {
      res.status(500).json({ message: "Müsait saatler yüklenirken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
