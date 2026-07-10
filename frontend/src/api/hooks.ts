import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

// ── Auth ──────────────────────────────────────────────────────────────────────
export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: () => api.get('/auth/me').then((r) => r.data) });
}

// ── Items ─────────────────────────────────────────────────────────────────────
export function useItems() {
  return useQuery({ queryKey: ['items'], queryFn: () => api.get('/items').then((r) => r.data) });
}
export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: object) => api.post('/items', data).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) });
}
export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...data }: { id: number } & object) => api.put(`/items/${id}`, data).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) });
}

// ── Parties ───────────────────────────────────────────────────────────────────
export function useParties() {
  return useQuery({ queryKey: ['parties'], queryFn: () => api.get('/parties').then((r) => r.data) });
}
export function usePartyDetail(id: number) {
  return useQuery({ queryKey: ['party', id], queryFn: () => api.get(`/parties/${id}`).then((r) => r.data), enabled: !!id });
}
export function useCreateParty() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: object) => api.post('/parties', data).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['parties'] }) });
}
export function useUpdateParty() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...data }: { id: number } & object) => api.put(`/parties/${id}`, data).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['parties'] }) });
}
export function usePartyRate(partyId: number, itemId: number) {
  return useQuery({ queryKey: ['rate', partyId, itemId], queryFn: () => api.get(`/parties/${partyId}/rate/${itemId}`).then((r) => r.data), enabled: !!partyId && !!itemId });
}

// ── Inventory ─────────────────────────────────────────────────────────────────
export function useInventoryIn(filters: Record<string, string> = {}) {
  return useQuery({ queryKey: ['inventory-in', filters], queryFn: () => api.get('/inventory', { params: filters }).then((r) => r.data) });
}
export function useCreateInventoryIn() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: object) => api.post('/inventory', data).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory-in'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}
export function useVoidInventoryIn() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.delete(`/inventory/${id}`).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory-in'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}

// ── Sales ─────────────────────────────────────────────────────────────────────
export function useSales(filters: Record<string, string> = {}) {
  return useQuery({ queryKey: ['sales', filters], queryFn: () => api.get('/sales', { params: filters }).then((r) => r.data) });
}
export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      date: string; itemId: string | number; quantity: string | number; unitPrice: string | number;
      partyId: string | number; remarks?: string; fyYear: string;
      carriageAmount?: number; taxPercent?: number; discountAmount?: number; gstType?: string;
    }) => api.post('/sales', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); qc.invalidateQueries({ queryKey: ['reports'] }); }
  });
}
export function useVoidSale() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.delete(`/sales/${id}`).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}

// ── Returns ───────────────────────────────────────────────────────────────────
export function useReturns(filters: Record<string, string> = {}) {
  return useQuery({ queryKey: ['returns', filters], queryFn: () => api.get('/returns', { params: filters }).then((r) => r.data) });
}
export function useCreateReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      date: string; itemId: string | number; quantity: string | number; unitPrice: string | number;
      partyId: string | number; remarks?: string; fyYear: string;
      carriageAmount?: number; taxPercent?: number; discountAmount?: number; gstType?: string;
    }) => api.post('/returns', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['returns'] }); qc.invalidateQueries({ queryKey: ['reports'] }); }
  });
}
export function useVoidReturn() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.delete(`/returns/${id}`).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['returns'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}

// ── Payments ──────────────────────────────────────────────────────────────────
export function usePayments(filters: Record<string, string> = {}) {
  return useQuery({ queryKey: ['payments', filters], queryFn: () => api.get('/payments', { params: filters }).then((r) => r.data) });
}
export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: object) => api.post('/payments', data).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['payments'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}
export function useVoidPayment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.delete(`/payments/${id}`).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['payments'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}

// ── Expenses ──────────────────────────────────────────────────────────────────
export function useExpenses(filters: Record<string, string> = {}) {
  return useQuery({ queryKey: ['expenses', filters], queryFn: () => api.get('/expenses', { params: filters }).then((r) => r.data) });
}
export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: object) => api.post('/expenses', data).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}
export function useVoidExpense() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.delete(`/expenses/${id}`).then((r) => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); qc.invalidateQueries({ queryKey: ['reports'] }); } });
}
export function useExpenseCategories() {
  return useQuery({ queryKey: ['expense-categories'], queryFn: () => api.get('/expenses/categories').then((r) => r.data) });
}

// ── Reports ───────────────────────────────────────────────────────────────────
export function useInventoryStatus(fyYear?: string) {
  return useQuery({ queryKey: ['reports', 'inventory-status', fyYear], queryFn: () => api.get('/reports/inventory-status', { params: { fyYear } }).then((r) => r.data) });
}
export function usePartyBalances(fyYear?: string) {
  return useQuery({ queryKey: ['reports', 'party-balances', fyYear], queryFn: () => api.get('/reports/party-balances', { params: { fyYear } }).then((r) => r.data) });
}
export function usePartyLedger(partyId: number, fyYear?: string) {
  return useQuery({ queryKey: ['reports', 'party-ledger', partyId, fyYear], queryFn: () => api.get(`/reports/party-ledger/${partyId}`, { params: { fyYear } }).then((r) => r.data), enabled: !!partyId });
}
export function useSalesAnalysis(params: Record<string, string> = {}) {
  return useQuery({ queryKey: ['reports', 'sales-analysis', params], queryFn: () => api.get('/reports/sales-analysis', { params }).then((r) => r.data) });
}
export function useExpenseSummary(params: Record<string, string> = {}) {
  return useQuery({ queryKey: ['reports', 'expense-summary', params], queryFn: () => api.get('/reports/expense-summary', { params }).then((r) => r.data) });
}
export function useProductionAnalysis(params: Record<string, string> = {}) {
  return useQuery({ queryKey: ['reports', 'production-analysis', params], queryFn: () => api.get('/reports/production-analysis', { params }).then((r) => r.data) });
}
