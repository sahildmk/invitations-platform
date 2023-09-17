import { db } from "../db/db";

export const getErrorCodes = async () => {
  return await db.query.errorCode.findMany({
    with: {
      tenantModule: true,
    },
  });
};

export const getTenantModules = async () => {
  return await db.query.tenantModule.findMany();
};
