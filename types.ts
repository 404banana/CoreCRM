
export enum OrderStatus {
  NEGOTIATION = 'Em Negociação',
  CLOSED = 'Fechado',
  LOST = 'Perdido'
}

export enum NegotiationStatus {
  OPEN = 'Aberta',
  WON = 'Ganha',
  LOST = 'Perdida'
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  tradingName: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  address: string;
  industry: string;
  lastPurchaseValue: number;
  lastPurchaseDate: string;
  createdAt: string; // Used to identify new customers
}

export interface Order {
  id: string;
  customerId: string;
  value: number;
  date: string;
  status: OrderStatus;
}

export interface Visit {
  id: string;
  customerId: string;
  date: string;
  notes: string;
  isCompleted: boolean;
}

export interface Negotiation {
  id: string;
  customerId: string;
  estimatedValue: number;
  status: NegotiationStatus;
  notes: string;
  date: string;
}

export interface MonthlyTargets {
  salesValue: number;
  newCustomers: number;
  recoveredCustomers: number;
}

export interface AppData {
  customers: Customer[];
  orders: Order[];
  visits: Visit[];
  negotiations: Negotiation[];
  targets: MonthlyTargets;
}
