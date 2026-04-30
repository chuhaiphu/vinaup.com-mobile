import { InvoiceTypeProvider } from '@/providers/invoice-type-provider';
import { Slot } from 'expo-router';

export default function OrganizationLayout() {
  return (
    <InvoiceTypeProvider>
      <Slot />
    </InvoiceTypeProvider>
  );
}
