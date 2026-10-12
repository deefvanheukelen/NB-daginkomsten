// Kopieer hier de PUBLIEKE Supabase-configuratie uit de bestaande NailBooker-app.
export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';
// Pas deze mapping aan de bestaande NailBooker-tabellen aan (zie README).
export const SCHEMA = {
  table: 'appointments',
  date: 'date',
  time: 'time',
  service: 'service_name',
  customer: 'customer_name',
  amount: 'price',
  payment: 'payment_method',
  private: 'is_private',
  deleted: 'deleted_at',
  user: 'user_id',
  // Waarden die NIET in het overzicht horen:
  excludedServices: ['Andere'],
  // Eventueel aanvullende waarden voor privéafspraken:
  privateServiceNames: ['Privé', 'Prive']
};
