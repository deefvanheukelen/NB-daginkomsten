// Publieke configuratie uit NailBooker/supabase-client.js (geen geheime sleutel).
export const SUPABASE_URL = 'https://lqrdawkmiqdojenouill.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_CooJe-_05o0_DnryGaj9ng_OAX_46EL';
export const SCHEMA = {
  table: 'appointments', date: 'appointment_date', time: 'appointment_time',
  service: 'service_id', customer: 'customer_id', amount: 'price',
  payment: 'payment_method_label', private: 'is_private', deleted: 'deleted_at',
  user: 'user_id', excludedServices: ['Andere'], privateServiceNames: ['Privé', 'Prive']
};
