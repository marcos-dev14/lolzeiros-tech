import { QueryClient, QueryClientProvider } from 'react-query';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { ThemeProvider } from "styled-components";
import Routes from "./routes";

import { GlobalStyle } from "./styles";
// import { ModalProvider } from "./context/modal";
import { ContextProvider } from "./context";
import theme from "./styles/theme";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60, // 1 hour
      },
    },
  });

  const localStoragePersistor = createWebStoragePersistor({
    storage: window.localStorage,
  });

  persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <ThemeProvider theme={theme}>
            <Routes />
          <GlobalStyle />
        </ThemeProvider>
      </ContextProvider>
    </QueryClientProvider>
  );
}
