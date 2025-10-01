import { httpDelete, httpGet, httpPost, httpPut } from '../http';

type ApiMecanico = {
  Id?: number;
  Nome?: string;
  Especialidade?: string;
  id?: number;
  nome?: string;
  especialidade?: string;
};

export type Mecanico = {
  id: number;
  nome: string;
  especialidade: string;
};

export type MecanicoCreate = Omit<Mecanico, 'id'>;
export type MecanicoUpdate = MecanicoCreate;

const base = '/api/Mecanico';

const fromApi = (m: ApiMecanico): Mecanico => ({
  id: (m.id ?? m.Id) as number,
  nome: (m.nome ?? m.Nome) as string,
  especialidade: (m.especialidade ?? m.Especialidade) as string,
});

const toApi = (m: MecanicoCreate | Mecanico): { nome: string; especialidade: string } => ({
  nome: m.nome,
  especialidade: m.especialidade,
});

export const mecanicoService = {
  list: async (): Promise<Mecanico[]> => {
    const data = await httpGet<any>(base);
    const arr: ApiMecanico[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.$values)
      ? data.$values
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.content)
      ? data.content
      : [];
    return arr.map(fromApi);
  },
  get: async (id: number): Promise<Mecanico> => {
    const data = await httpGet<ApiMecanico>(`${base}/${id}`);
    return fromApi(data);
  },
  create: async (data: MecanicoCreate): Promise<Mecanico> => {
    const created = await httpPost<ReturnType<typeof toApi>, ApiMecanico>(base, toApi(data));
    return fromApi(created);
  },
  update: async (id: number, data: MecanicoUpdate): Promise<Mecanico> => {
    const updated = await httpPut<ReturnType<typeof toApi>, ApiMecanico>(`${base}/${id}`, toApi(data));
    return fromApi(updated);
  },
  remove: (id: number) => httpDelete(`${base}/${id}`),
};
