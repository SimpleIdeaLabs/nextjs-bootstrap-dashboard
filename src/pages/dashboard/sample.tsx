import dynamic from 'next/dynamic';

export const Sample = dynamic(() => import('./_dynamicSample'), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <Sample />
    </div>
  );
}
