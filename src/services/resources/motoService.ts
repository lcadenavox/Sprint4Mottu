import { httpDelete, httpGet, httpPost, httpPut } from '../http';

// API shape (PascalCase) returned by .NET System.Text.Json by default
type ApiMoto = {
  Id?: number;
  Marca?: string;
  Modelo?: string;
  Ano?: number;
  // Also accept default ASP.NET Core camelCase JSON
  id?: number;
  marca?: string;
  modelo?: string;
  ano?: number;
};

// App shape (camelCase)
export type Moto = {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
};

export type MotoCreate = Omit<Moto, 'id'>;
export type MotoUpdate = MotoCreate;

const base = '/api/Moto';

const fromApi = (m: ApiMoto): Moto => ({
  id: (m.id ?? m.Id) as number,
  marca: (m.marca ?? m.Marca) as string,
  modelo: (m.modelo ?? m.Modelo) as string,
  ano: (m.ano ?? m.Ano) as number,
});

// Send camelCase (ASP.NET Core default System.Text.Json naming policy)
const toApi = (m: MotoCreate | Moto): { marca: string; modelo: string; ano: number } => ({
  marca: m.marca,
  modelo: m.modelo,
  ano: m.ano,
});

export const motoService = {
  list: async (): Promise<Moto[]> => {
    const data = await httpGet<ApiMoto[]>(base);
    return data.map(fromApi);
  },
  get: async (id: number): Promise<Moto> => {
    const data = await httpGet<ApiMoto>(`${base}/${id}`);
    return fromApi(data);
  },
  create: async (data: MotoCreate): Promise<Moto> => {
    const created = await httpPost<ReturnType<typeof toApi>, ApiMoto>(base, toApi(data));
    return fromApi(created);
  },
  update: async (id: number, data: MotoUpdate): Promise<Moto> => {
    const updated = await httpPut<ReturnType<typeof toApi>, ApiMoto>(`${base}/${id}`, toApi(data));
    return fromApi(updated);
  },
  remove: (id: number) => httpDelete(`${base}/${id}`),
};
