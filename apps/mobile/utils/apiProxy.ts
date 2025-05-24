// Proxy pour rediriger les appels API vers le serveur local
// Cela permet à l'app mobile d'accéder au serveur Next.js même si NextAuth utilise 127.0.0.1

const LOCAL_SERVER_IP = '192.168.1.148:3000';
const NEXTAUTH_LOOPBACK = '127.0.0.1:3000';

export const createProxyUrl = (originalUrl: string): string => {
  console.log('🔄 Proxy input URL:', originalUrl);
  
  let proxiedUrl = originalUrl;
  
  // Si l'URL contient 127.0.0.1, la remplacer par l'IP locale
  if (proxiedUrl.includes('127.0.0.1:3000')) {
    proxiedUrl = proxiedUrl.replace('127.0.0.1:3000', LOCAL_SERVER_IP);
    console.log('🔄 Converted 127.0.0.1 to local IP:', proxiedUrl);
  }
  
  // Si l'URL contient localhost, la remplacer par l'IP locale
  if (proxiedUrl.includes('localhost:3000')) {
    proxiedUrl = proxiedUrl.replace('localhost:3000', LOCAL_SERVER_IP);
    console.log('🔄 Converted localhost to local IP:', proxiedUrl);
  }
  
  // Gérer les URLs encodées dans les paramètres
  if (proxiedUrl.includes('127%2E0%2E0%2E1%3A3000')) {
    proxiedUrl = proxiedUrl.replace('127%2E0%2E0%2E1%3A3000', encodeURIComponent(LOCAL_SERVER_IP));
    console.log('🔄 Converted encoded 127.0.0.1 to local IP:', proxiedUrl);
  }
  
  console.log('🔄 Proxy output URL:', proxiedUrl);
  return proxiedUrl;
};

export const proxyFetch = async (url: string, options?: RequestInit) => {
  const proxiedUrl = createProxyUrl(url);
  console.log('🔄 Proxy API call:', url, '->', proxiedUrl);
  return fetch(proxiedUrl, options);
}; 