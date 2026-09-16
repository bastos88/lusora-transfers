import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {AppProvider} from '../src/features/AppProvider';
import {getCatalog} from '../src/lib/catalog';
import '../src/styles/global.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={
  metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL??'http://localhost:3000'),
  title:{default:'Lusóra Transfers | Transfer privado no Porto',template:'%s | Lusóra Transfers'},
  description:'Transfers privados de e para o Aeroporto do Porto. Escolha o serviço e a viatura e organize a sua viagem.',
};
export default async function RootLayout({children}:{children:ReactNode}) {
  const catalog=await getCatalog().catch(()=>null);
  return <html lang="pt-PT"><body><AppProvider catalog={catalog}>{children}</AppProvider></body></html>;
}
