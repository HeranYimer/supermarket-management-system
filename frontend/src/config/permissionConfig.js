// src/config/permissionsConfig.js

export const productPermissions = {
  admin: {
    canAdd: true,
    canDelete: true,
    canEdit: true,
    canDeactivate: true,
  },
  manager: {
    canAdd: true,
    canDelete: false,
    canEdit: true,
    canDeactivate: true,
  },
  inventory: {
    canAdd: true,
    canDelete: false,
    canEdit: true,
    canDeactivate: true,
  },
};
export const categoryPermissions = {
  admin: {
    canAdd: true,
    canDelete: true,
    canEdit: true,
  },
  manager: {
    canAdd: true,
    canDelete: false,
    canEdit: true,
  },
  inventory: {
    canAdd: false,
    canDelete: false,
    canEdit: false,
  },
};
export const supplierPermissions = {
  ADMIN: {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  MANAGER: {
    canCreate: true,
    canUpdate: true,
    canDelete: false,
  },
  INVENTORY: {
    canCreate: false,
    canUpdate: true,
    canDelete: false,
  },
};
export const purchaseOrderPermissions = {
  admin: { canCreate: true, canUpdate: true, canDeactivate: true },
  manager: { canCreate: true, canUpdate: true, canDeactivate: true },
  inventory: { canCreate: false, canUpdate: false, canDeactivate: false },
};