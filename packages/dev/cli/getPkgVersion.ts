import { execSync } from 'child_process';

export const getPkgVersion = (pkgName: string) => {
  const pkg = execSync(`npm search ${pkgName} --json`).toString();
  const pkgJson = JSON.parse(pkg);

  return pkgJson[0].version;
};
