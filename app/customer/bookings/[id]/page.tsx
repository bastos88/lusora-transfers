import {CustomerView} from '../../../../src/features/customer/CustomerView';
export const metadata={title:'Detalhes da reserva',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <CustomerView id={id}/>;}
