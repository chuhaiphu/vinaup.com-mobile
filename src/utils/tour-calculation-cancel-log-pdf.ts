import { TourCalculationCancelLogResponse } from '@/interfaces/tour-calculation-interfaces';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface TourCalculationSnapshot {
  adultTicketCount?: number;
  childTicketCount?: number;
  adultTicketPrice?: number;
  childTicketPrice?: number;
  taxRate?: number;
  [key: string]: unknown;
}

interface SignatureSnapshot {
  signatureRole?: string;
  targetUser?: {
    name?: string;
  };
  signedByUser?: {
    name?: string;
  };
  isSigned?: boolean;
  signedAt?: string | Date | null;
  url?: string | null;
}

interface ParsedSnapshot {
  tourCalculation: TourCalculationSnapshot;
  signatures: SignatureSnapshot[];
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDateTime(value?: string | Date | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatCurrency(value?: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('vi-VN').format(value);
}

function parseSnapshot(log: TourCalculationCancelLogResponse): ParsedSnapshot {
  const raw = log.snapshotData as Record<string, unknown>;
  const tourCalculation =
    typeof raw?.tourCalculation === 'object' && raw.tourCalculation != null
      ? (raw.tourCalculation as TourCalculationSnapshot)
      : {};
  const signatures = Array.isArray(raw?.signatures)
    ? (raw.signatures as SignatureSnapshot[])
    : [];

  return {
    tourCalculation,
    signatures,
  };
}

function buildHtml(log: TourCalculationCancelLogResponse): string {
  const { tourCalculation, signatures } = parseSnapshot(log);
  const signatureRows = signatures
    .map((signature, index) => {
      const role = escapeHtml(signature.signatureRole || '-');
      const targetName = escapeHtml(signature.targetUser?.name || '-');
      const signedBy = escapeHtml(signature.signedByUser?.name || '-');
      const signedAt = escapeHtml(formatDateTime(signature.signedAt));
      const status = signature.isSigned ? 'Da ky' : 'Chua ky';
      const fileUrl = signature.url ? escapeHtml(signature.url) : '-';

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${role}</td>
          <td>${targetName}</td>
          <td>${signedBy}</td>
          <td>${status}</td>
          <td>${signedAt}</td>
          <td style="word-break: break-all;">${fileUrl}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #1f1f1f;
            padding: 24px;
            line-height: 1.4;
          }
          h1 {
            font-size: 22px;
            margin: 0 0 16px;
          }
          h2 {
            font-size: 16px;
            margin: 24px 0 8px;
          }
          .meta {
            background: #f7f7f7;
            border: 1px solid #e7e7e7;
            border-radius: 8px;
            padding: 12px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px 20px;
          }
          .label {
            color: #686868;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          th,
          td {
            border: 1px solid #d8d8d8;
            font-size: 12px;
            padding: 6px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background: #f5f5f5;
          }
        </style>
      </head>
      <body>
        <h1>Nhat ky huy ky Tour Calculation</h1>

        <div class="meta">
          <div><span class="label">Log ID:</span> ${escapeHtml(log.id)}</div>
          <div><span class="label">Nguoi huy:</span> ${escapeHtml(log.canceledByUser?.name || '-')}</div>
          <div><span class="label">Thoi gian:</span> ${escapeHtml(formatDateTime(log.createdAt))}</div>
        </div>

        <h2>Thong tin Tour Calculation</h2>
        <div class="meta grid">
          <div><span class="label">So ve nguoi lon:</span> ${formatCurrency(tourCalculation.adultTicketCount)}</div>
          <div><span class="label">So ve tre em:</span> ${formatCurrency(tourCalculation.childTicketCount)}</div>
          <div><span class="label">Gia ve nguoi lon:</span> ${formatCurrency(tourCalculation.adultTicketPrice)}</div>
          <div><span class="label">Gia ve tre em:</span> ${formatCurrency(tourCalculation.childTicketPrice)}</div>
          <div><span class="label">Thue (%):</span> ${formatCurrency(tourCalculation.taxRate)}</div>
        </div>

        <h2>Danh sach chu ky tai thoi diem huy</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Vai tro</th>
              <th>Nguoi duoc ky</th>
              <th>Nguoi da ky</th>
              <th>Trang thai</th>
              <th>Thoi gian ky</th>
              <th>Tep dinh kem</th>
            </tr>
          </thead>
          <tbody>
            ${signatureRows || '<tr><td colspan="7">Khong co du lieu</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

export async function createAndShareTourCalculationCancelLogPdf(
  log: TourCalculationCancelLogResponse
): Promise<void> {
  const html = buildHtml(log);
  const { uri } = await Print.printToFileAsync({ html });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Luu hoac chia se file PDF',
  });
}
