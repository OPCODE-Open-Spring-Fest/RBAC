import Role from '../models/Role.model.js'
import Permission from "../models/Permission.model.js";

export const createRole = async (name, permissions = []) => {
  const role = new Role({ name, permissions });
  return await role.save();
};

export const getRoles = async () => {
  return await Role.find().populate("permissions");
};

export const getRoleById = async (id) => {
  return await Role.findById(id).populate("permissions");
};

export const updateRole = async (id, data) => {
  return await Role.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRole = async (id) => {
  return await Role.findByIdAndDelete(id);
};

export const assignPermissions = async (roleId, permissionIds) => {
  const role = await Role.findById(roleId);
  role.permissions = permissionIds;
  return await role.save();
};
