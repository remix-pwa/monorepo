import { ClientActionFunctionArgs, ClientLoaderFunctionArgs } from "@remix-run/react";

export const workerLoader = () => {
  console.log('Worker loader called in logout');
  return null;
}

export const workerAction = () => {
  console.log('Worker action called in logout');
  return null;
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  console.log('clientAction in logout');
  console.log(request, window.location.pathname)

  await fetch('https://google.com', { method: 'POST', mode: 'no-cors' });

  return null;
}

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  console.log('clientLoader in logout');

  return null;
}

// export default function C( ){
//   return (
//     <div>Logout?</div>
//   )
// }