
import { useState, useEffect, useCallback } from 'react';
import { AppData, Customer, Order, Visit, Negotiation, OrderStatus, NegotiationStatus, MonthlyTargets } from '../types';
import { INITIAL_DATA } from '../db/mockData';

const STORAGE_KEY = 'corecrm_data';

export function useCoreStore() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addCustomer = useCallback((customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer = { 
      ...customer, 
      id: crypto.randomUUID(), 
      createdAt: new Date().toISOString().split('T')[0] 
    };
    setData(prev => ({ ...prev, customers: [...prev.customers, newCustomer] }));
  }, []);

  const addOrder = useCallback((order: Omit<Order, 'id'>) => {
    const newOrder = { ...order, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, orders: [...prev.orders, newOrder] }));
  }, []);

  const updateTargets = useCallback((targets: MonthlyTargets) => {
    setData(prev => ({ ...prev, targets }));
  }, []);

  const addVisit = useCallback((visit: Omit<Visit, 'id'>) => {
    const newVisit = { ...visit, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, visits: [...prev.visits, newVisit] }));
  }, []);

  const addNegotiation = useCallback((negotiation: Omit<Negotiation, 'id'>) => {
    const newNegotiation = { ...negotiation, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, negotiations: [...prev.negotiations, newNegotiation] }));
  }, []);

  const closeNegotiation = useCallback((id: string, value: number) => {
    setData(prev => {
      const negotiation = prev.negotiations.find(n => n.id === id);
      if (!negotiation) return prev;

      const updatedNegotiations = prev.negotiations.map(n => 
        n.id === id ? { ...n, status: NegotiationStatus.WON } : n
      );

      const newOrder: Order = {
        id: crypto.randomUUID(),
        customerId: negotiation.customerId,
        value: value,
        date: new Date().toISOString().split('T')[0],
        status: OrderStatus.CLOSED
      };

      const updatedCustomers = prev.customers.map(c => 
        c.id === negotiation.customerId 
          ? { ...c, lastPurchaseDate: newOrder.date, lastPurchaseValue: value } 
          : c
      );

      return {
        ...prev,
        negotiations: updatedNegotiations,
        orders: [...prev.orders, newOrder],
        customers: updatedCustomers
      };
    });
  }, []);

  return {
    data,
    addCustomer,
    addOrder,
    addVisit,
    addNegotiation,
    closeNegotiation,
    updateTargets
  };
}
