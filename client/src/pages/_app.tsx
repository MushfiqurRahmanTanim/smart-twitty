import '@styles/globals.css';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';
import { useRouter } from 'next/router';
import { LayoutProvider } from '@context/layout.context';
import Layout from '@components/Layout';
import Head from 'next/head';
import { QueryClient } from 'react-query';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SocketProvider } from '@context/socket.context';
import { useEffect } from 'react';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT; // the prefix of the URL only for the client side
axios.defaults.withCredentials = true;

export const client = new QueryClient();

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  useEffect(() => {
     
  }, [pathname])
  return (
    <QueryClientProvider {...{ client }}>
      <SnackbarProvider>
        <SocketProvider>
          <Head>
            <title>Smart-twitty</title>
            <link rel='icon' href='/favicon.png' />
          </Head>

          <LayoutProvider>
            {pathname !== '/auth' ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </LayoutProvider>

          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
        </SocketProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
