import { ClientActionFunctionArgs } from "@remix-run/react";

export const workerLoader = () => {
  console.log('Worker loader called in logout');
  return null;
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  console.log('clientAction in logout');
  console.log(request)

  await fetch('https://google.com', { method: 'POST', mode: 'no-cors' });

  return null;
}

// export default function C( ){
//   return (
//     <div>Logout?</div>
//   )
// }