import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { InvoiceResponse } from '@/interfaces/invoice-interfaces';
import { InvoiceStatusDisplay } from '@/constants/invoice-constants';
import { prefetch } from 'fetchwire';
import { useState } from 'react';
import { getInvoiceByIdApi } from '@/apis/invoice-apis';
import { generateLocalePriceFormat, formatDateRange } from '@/utils/generator-helpers';
import { useRouter } from 'expo-router';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { useNavigationStore } from '@/hooks/use-navigation-store';

interface InvoiceCardProps {
  invoice?: InvoiceResponse;
  totalRemaining?: number;
}

export function InvoiceCard({ invoice, totalRemaining }: InvoiceCardProps) {
  const router = useRouter();
  const { setIsNavigating } = useNavigationStore();
  const [isShowingPrice, setIsShowingPrice] = useState(false);

  const getInvoiceInfoText = () => {
    if (!invoice) return '';
    if (invoice.organizationCustomer) {
      return invoice.organizationCustomer.name || '';
    }
    return invoice.externalCustomerName || invoice.externalOrganizationName || '—';
  };

  const togglePrice = () => {
    setIsShowingPrice(!isShowingPrice);
  };

  const navigateToDetail = async (invoiceId: string) => {
    setIsNavigating(true);
    try {
      await prefetch(() => getInvoiceByIdApi(invoiceId), {
        fetchKey: `organization-invoice-${invoiceId}`,
      });
    } catch {
      // Fallback to normal navigation if prefetch fails.
    }
    router.push({
      pathname: '/(protected)/invoice-detail/[invoiceId]',
      params: { invoiceId, invoiceTypeCode: invoice?.invoiceType?.code },
    });
    setIsNavigating(false);
  };

  if (!invoice) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>Không có dữ liệu</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerHeader}>
        <View style={styles.left}>
          <Text style={styles.dateRangeText}>{formatDateRange(invoice.startDate, invoice.endDate)}</Text>
          <PressableOpacity onPress={togglePrice}>
            <Text
              style={[
                styles.equalSignText,
                isShowingPrice && styles.equalSignActive,
              ]}
            >
              =
            </Text>
          </PressableOpacity>
          {isShowingPrice && (
            <Text style={styles.invoiceTotalAmountText}>
              {generateLocalePriceFormat(totalRemaining ?? 0, 'vi-VN')}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <Text style={styles.statusText}>
            {InvoiceStatusDisplay[invoice.status]}
          </Text>
        </View>
      </View>
      <Pressable onPress={() => navigateToDetail(invoice.id)}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{invoice.description}</Text>
            </View>
            <Text style={styles.codeText}>{invoice.code}</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
              {getInvoiceInfoText()}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  innerHeader: {
    marginVertical: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  left: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  right: {},
  dateRangeText: {
    fontSize: 15,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
  },
  equalSignText: {
    fontSize: 20,
    lineHeight: 20,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: COLORS.vinaupTeal,
    backgroundColor: COLORS.vinaupWhite,
    overflow: 'hidden',
  },
  equalSignActive: {
    backgroundColor: 'transparent',
  },
  invoiceTotalAmountText: {
    fontSize: 16,
    flexShrink: 0,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  codeText: {
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
    marginLeft: 8,
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.vinaupDarkGray,
  },
  totalAmountText: {
    fontSize: 16,
    flexShrink: 0,
    marginLeft: 8,
  },
});
