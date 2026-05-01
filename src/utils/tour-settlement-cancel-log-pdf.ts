import { OrganizationResponse } from '@/interfaces/organization-interfaces';
import { SignatureResponse } from '@/interfaces/signature-interfaces';
import { TourSettlementCancelLogResponse } from '@/interfaces/tour-settlement-interfaces';
import { generateBase64FromUrl } from './generator-helpers';
import {
  buildHtml,
  sharePdf,
  type GroupedReceiptPayment,
  type PdfPageSize,
  type SnapshotTour,
  type TicketSummarySnapshot,
} from './tour-pdf-helpers';

interface TourSettlementCancelLogPdfInput {
  cancelLog: TourSettlementCancelLogResponse;
  organization?: OrganizationResponse;
  snapshotTour: SnapshotTour;
  ticketSummary: TicketSummarySnapshot;
  groupedReceiptPayments: GroupedReceiptPayment[];
  senderSignature?: SignatureResponse;
  receiverSignatures: SignatureResponse[];
  customerName: string;
  totalExpectedCount: number;
  pageSize?: PdfPageSize;
}

export async function createAndShareTourSettlementCancelLogPdf(
  input: TourSettlementCancelLogPdfInput
): Promise<void> {
  const avatarBase64 = await generateBase64FromUrl(input.organization?.avatarUrl);
  const html = buildHtml(
    {
      canceledAt: input.cancelLog.createdAt,
      canceledByUserName: input.cancelLog.canceledByUser?.name ?? null,
      organization: input.organization,
      snapshotTour: input.snapshotTour,
      ticketSummary: input.ticketSummary,
      groupedReceiptPayments: input.groupedReceiptPayments,
      senderSignature: input.senderSignature,
      receiverSignatures: input.receiverSignatures,
      customerName: input.customerName,
      totalExpectedCount: input.totalExpectedCount,
      pageSize: input.pageSize,
      mainTitle: 'Quyết toán',
      summaryHeaderLabel: 'Thực tế',
    },
    avatarBase64
  );
  await sharePdf(html);
}
