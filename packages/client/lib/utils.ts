export function errorBlock(err: unknown) {
  if (typeof err === 'string') {
    return {
      ok: false,
      message: err,
    };
  } else if (err instanceof Error) {
    return {
      ok: false,
      message: err.message,
    };
  } else {
    return {
      ok: false,
      message: 'Unknown error',
    };
  }
}
