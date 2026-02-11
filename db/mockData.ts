
import { AppData, OrderStatus, NegotiationStatus } from '../types';

const now = new Date();
const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM

export const INITIAL_DATA: AppData = {
  customers: [
    {
      id: '1',
      code: 'C001',
      name: 'Indústria Têxtil Silva Ltda',
      tradingName: 'Silva Têxtil',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 98888-7777',
      whatsapp: '11988887777',
      address: 'Rua das Flores, 123, São Paulo - SP',
      industry: 'Têxtil',
      lastPurchaseValue: 15400.50,
      lastPurchaseDate: '2023-10-15',
      createdAt: '2023-01-10'
    },
    {
      id: '2',
      code: 'C002',
      name: 'Comércio de Alimentos Oliveira',
      tradingName: 'Oliveira Foods',
      cnpj: '98.765.432/0001-21',
      phone: '(11) 97777-6666',
      whatsapp: '11977776666',
      address: 'Av. Brasil, 500, São Bernardo do Campo - SP',
      industry: 'Alimentos',
      lastPurchaseValue: 8200.00,
      lastPurchaseDate: `${currentMonthStr}-05`,
      createdAt: '2023-05-20'
    },
    {
      id: '3',
      code: 'C003',
      name: 'Tecnologia Avançada S.A.',
      tradingName: 'TechAdv',
      cnpj: '11.222.333/0001-44',
      phone: '(11) 96666-5555',
      whatsapp: '11966665555',
      address: 'Rua Inovação, 45, Campinas - SP',
      industry: 'Tecnologia',
      lastPurchaseValue: 0,
      lastPurchaseDate: 'Nunca',
      createdAt: `${currentMonthStr}-01`
    }
  ],
  orders: [
    {
      id: 'o1',
      customerId: '1',
      value: 15400.50,
      date: '2023-10-15',
      status: OrderStatus.CLOSED
    },
    {
      id: 'o2',
      customerId: '2',
      value: 8200.00,
      date: `${currentMonthStr}-05`,
      status: OrderStatus.CLOSED
    }
  ],
  visits: [
    {
      id: 'v1',
      customerId: '1',
      date: '2024-05-20',
      notes: 'Cliente interessado em nova linha de tecidos.',
      isCompleted: true
    },
    {
      id: 'v2',
      customerId: '3',
      date: '2024-06-15',
      notes: 'Apresentação institucional.',
      isCompleted: false
    }
  ],
  negotiations: [
    {
      id: 'n1',
      customerId: '3',
      estimatedValue: 50000.00,
      status: NegotiationStatus.OPEN,
      notes: 'Projeto de renovação de hardware.',
      date: '2024-05-12'
    }
  ],
  targets: {
    salesValue: 50000,
    newCustomers: 5,
    recoveredCustomers: 3
  }
};
