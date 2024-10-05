export const workerLoader = async () => {
  console.log('worker loader in test');

  return null;
}

export const clientLoader = async () => {
  console.log('Client loader called in test');
  await fetch('https://hashnode.com', { mode: 'no-cors' });
  return null;
}

export default function Test() {
  return (
    <div>Test</div>
  )
}
