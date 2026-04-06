import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client } from '@/types/client';
import { mockClients } from '@/data/mockClients';

interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: mockClients,
      addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
      updateClient: (id, data) =>
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteClient: (id) =>
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
      getClient: (id) => get().clients.find((c) => c.id === id),
    }),
    { name: 'miosalon-clients' }
  )
);
