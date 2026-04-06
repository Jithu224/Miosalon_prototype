import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service, ServiceCategory } from '@/types/service';
import { mockServices, mockCategories } from '@/data/mockServices';

interface ServiceStore {
  services: Service[];
  categories: ServiceCategory[];
  addService: (service: Service) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getService: (id: string) => Service | undefined;
  getServicesByCategory: (categoryId: string) => Service[];
  addCategory: (category: ServiceCategory) => void;
  updateCategory: (id: string, data: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;
}

export const useServiceStore = create<ServiceStore>()(
  persist(
    (set, get) => ({
      services: mockServices,
      categories: mockCategories,
      addService: (service) =>
        set((s) => ({ services: [...s.services, service] })),
      updateService: (id, data) =>
        set((s) => ({
          services: s.services.map((svc) =>
            svc.id === id ? { ...svc, ...data } : svc
          ),
        })),
      deleteService: (id) =>
        set((s) => ({ services: s.services.filter((svc) => svc.id !== id) })),
      getService: (id) => get().services.find((svc) => svc.id === id),
      getServicesByCategory: (categoryId) =>
        get().services.filter((svc) => svc.categoryId === categoryId),
      addCategory: (category) =>
        set((s) => ({ categories: [...s.categories, category] })),
      updateCategory: (id, data) =>
        set((s) => ({
          categories: s.categories.map((cat) =>
            cat.id === id ? { ...cat, ...data } : cat
          ),
        })),
      deleteCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((cat) => cat.id !== id),
        })),
    }),
    { name: 'miosalon-services' }
  )
);
