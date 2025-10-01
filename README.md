# Sprint4Mottu - Mobile (Expo + React Native)

Este app é a entrega intermediária da 3ª Sprint, com:
- Login, Cadastro e Logout
- Três funcionalidades completas integradas com a API (Motos, Mecânicos e Depósitos): Listar, Criar, Editar, Excluir
- Validações de formulários, mensagens de erro e indicadores de carregamento
- Tema claro/escuro e componentes reutilizáveis
- Arquitetura organizada (contexts, services, navigation, screens, components)

## Estrutura
- `src/config/env.ts` – configuração do `baseURL` da API
- `src/services/api.ts` – cliente Axios com interceptor de token
- `src/contexts/AuthContext.tsx` – autenticação, persistência de token, login/cadastro/logout
- `src/theme/` – tema claro/escuro e hook `useTheme`
- `src/navigation/` – navegação: Auth stack + App tabs + formulários
- `src/screens/` – telas de Auth, Veículos, Aluguéis
- `src/components/` – componentes de UI temáticos

## Backend/API
O link informado foi o Swagger: `https://localhost:7054/swagger/index.html`. Ajuste o `baseURL` para acessar o backend a partir do dispositivo/emulador.

- Android emulador (AVD): use `http://10.0.2.2:7054`
- Android emulador (Genymotion): `http://10.0.3.2:7054`
- Android device físico: use o IP do seu PC, por ex. `http://192.168.0.10:7054`
- iOS Simulator: `https://localhost:7054` pode funcionar se o certificado for confiável
- Web: `https://localhost:7054` exige CORS e certificado confiável

Defina via variável pública do Expo: `EXPO_PUBLIC_API_BASE_URL`. Ex.:

```
$env:EXPO_PUBLIC_API_BASE_URL="http://10.0.2.2:7054"; $env:EXPO_PUBLIC_AUTH_MODE="local"; npm run start
```

No código, os endpoints foram alinhados ao seu Swagger:
- Moto: `/api/Moto` e `/api/Moto/{id}` (CRUD)
- Mecânico: `/api/Mecanico` e `/api/Mecanico/{id}` (CRUD)
- Depósito: `/api/Deposito` e `/api/Deposito/{id}` (CRUD)
- Auth: fallback local por padrão (`EXPO_PUBLIC_AUTH_MODE=local`), pois sua API não expõe endpoints de autenticação.

## Rodando o app
1. Instale dependências: `npm install`
2. Configure `EXPO_PUBLIC_API_BASE_URL` conforme seu ambiente
3. Inicie: `npm run start`
4. Abra no Android (`a`), iOS (`i`) ou Web (`w`).

## Observações sobre HTTPS local
Se seu backend usa HTTPS com certificado autoassinado, o app no dispositivo pode não confiar.
- Prefira HTTP somente no ambiente de desenvolvimento
- Ou instale um certificado confiável no emulador/dispositivo

## Melhorias futuras
- Listas de seleção (ex.: buscar veículos para escolher no formulário de Aluguéis)
- Testes unitários e E2E
- Internacionalização e acessibilidade