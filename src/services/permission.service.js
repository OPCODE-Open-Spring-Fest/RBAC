import Permission from "../models/Permission.model.js";

export const createPermission = async (name, description) => {
  const perm = new Permission({ name, description });
  return await perm.save();
};

export const getPermissions = async () => {
  return await Permission.find();
};

export const getPermissionById = async (id) => {
  return await Permission.findById(id);
};

export const updatePermission = async (id, data) => {
  return await Permission.findByIdAndUpdate(id, data, { new: true });
};

export const deletePermission = async (id) => {
  return await Permission.findByIdAndDelete(id);
};
