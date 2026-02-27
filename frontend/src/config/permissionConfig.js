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