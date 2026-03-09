// Tipos para el sistema financiero

export type TransactionType = 'gasto' | 'ingreso';

export type AnalysisPeriod = 'diario' | 'semanal' | 'mensual' | 'bimestral' | 'semestral' | 'anual';

export type SuggestionPriority = 'baja' | 'media' | 'alta';

export type Category =
  | 'Comida'
  | 'Ocio'
  | 'Gasolina/Transporte'
  | 'Gastos del hogar'
  | 'Ropa'
  | 'Viajes'
  | 'Servicios'
  | 'Salud'
  | 'Educacion'
  | 'Salario'
  | 'Bonificacion'
  | 'Freelance'
  | 'Otro';

export interface Transaction {
  id: string;
  descripcion: string;
  cantidad: number;
  tipo: TransactionType;
  categoria: Category;
  fecha: string;
  confianza: number;
  notas?: string;
}

export interface CategoryData {
  total: number;
  porcentaje: number;
  transacciones: number;
}

export interface Analysis {
  periodo: AnalysisPeriod;
  ingresos_totales: number;
  gastos_totales: number;
  balance: number;
  por_categoria: Record<string, CategoryData>;
  transacciones_totales: number;
  promedio_gasto_diario: number;
}

export interface Suggestion {
  titulo: string;
  descripcion: string;
  prioridad: SuggestionPriority;
  ahorro_estimado?: number;
}

export interface ProcessAudioResponse {
  success: boolean;
  transaccion: Transaction | null;
  confianza: number;
  keywords: string[];
  advertencias: string[];
  debug_info?: Record<string, unknown>;
  metodo: 'ia' | 'fallback';
  error?: string;
}

export interface HealthResponse {
  status: string;
  ollama_available?: boolean;
  ai_available?: boolean;
  ai_provider?: string;
  timestamp: string;
}

export interface TransactionsResponse {
  success: boolean;
  total: number;
  transactions: Transaction[];
  error?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: Analysis;
  error?: string;
}

export interface SuggestionsResponse {
  success: boolean;
  suggestions: Suggestion[];
  error?: string;
}

export interface AnalysisWithSuggestionsResponse {
  success: boolean;
  analysis: Analysis;
  suggestions: Suggestion[];
  error?: string;
}

export interface ClearTransactionsResponse {
  success: boolean;
  message: string;
  deleted: number;
  error?: string;
}

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
