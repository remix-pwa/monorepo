export const clientLoader = async () => {
  console.log('Client loader called in test');
  await fetch('https://hashnode.com', { method: 'POST', mode: 'no-cors' });
  return null;
}

export default function Test() {
  return (
    <div>Test</div>
  )
}
