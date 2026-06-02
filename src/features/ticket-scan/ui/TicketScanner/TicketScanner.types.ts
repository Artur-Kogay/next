export interface ScanResultView {
  status: 'success' | 'error';
  title: string;
  details?: string[];
}
