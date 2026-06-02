export interface TicketScanPayload {
  already_used: boolean;
  order_number: number;
  scan_count: number;
  serial_number: string;
}

export interface TicketCheckSuccess {
  ok: true;
  payload: TicketScanPayload;
  status: string;
}

export interface TicketCheckFailure {
  ok: false;
  status: string;
}

export type TicketCheckResult = TicketCheckSuccess | TicketCheckFailure;
