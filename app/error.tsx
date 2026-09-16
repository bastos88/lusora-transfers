'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="app-panel"><h1>Não foi possível carregar esta página.</h1><button onClick={reset}>Tentar novamente</button></main>;}
