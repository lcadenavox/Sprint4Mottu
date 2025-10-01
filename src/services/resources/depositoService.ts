import { httpDelete, httpGet, httpPost, httpPut } from '../http';

type ApiDeposito = {
  Id?: number;
  Nome?: string;
  Endereco?: string;
  id?: number;
  nome?: string;
  endereco?: string;
};

export type Deposito = {
  id: number;
  nome: string;
  endereco: string;
};

export type DepositoCreate = Omit<Deposito, 'id'>;
export type DepositoUpdate = DepositoCreate;

const base = '/api/Deposito';

const fromApi = (d: ApiDeposito): Deposito => ({
  id: (d.id ?? d.Id) as number,
  nome: (d.nome ?? d.Nome) as string,
  endereco: (d.endereco ?? d.Endereco) as string,
});

const toApi = (d: DepositoCreate | Deposito): { nome: string; endereco: string } => ({
  nome: d.nome,
  endereco: d.endereco,
});

export const depositoService = {
  list: async (): Promise<Deposito[]> => {
    const data = await httpGet<ApiDeposito[]>(base);
    return data.map(fromApi);
  },
  get: async (id: number): Promise<Deposito> => {
    const data = await httpGet<ApiDeposito>(`${base}/${id}`);
    return fromApi(data);
  },
  create: async (data: DepositoCreate): Promise<Deposito> => {
    const created = await httpPost<ReturnType<typeof toApi>, ApiDeposito>(base, toApi(data));
    return fromApi(created);
  },
  update: async (id: number, data: DepositoUpdate): Promise<Deposito> => {
    const updated = await httpPut<ReturnType<typeof toApi>, ApiDeposito>(`${base}/${id}`, toApi(data));
    return fromApi(updated);
  },
  remove: (id: number) => httpDelete(`${base}/${id}`),
};
