import { appointments, users, type Appointment, type InsertAppointment, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  getAppointmentsByEmail(email: string): Promise<Appointment[]>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stats
  getAppointmentStats(): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  }>;
}

export class MemStorage implements IStorage {
  private appointments: Map<number, Appointment>;
  private users: Map<number, User>;
  private currentAppointmentId: number;
  private currentUserId: number;

  constructor() {
    this.appointments = new Map();
    this.users = new Map();
    this.currentAppointmentId = 1;
    this.currentUserId = 1;
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true
    });
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    const updatedAppointment = { ...appointment, ...updateData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  async getAppointmentsByEmail(email: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.email === email)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAppointmentStats(): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  }> {
    const appointments = Array.from(this.appointments.values());
    return {
      total: appointments.length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };
  }
}

export const storage = new MemStorage();
