import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/Role.model.js';
import Permission from '../models/Permission.model.js';

dotenv.config();

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const defaultPermissions = [
      { name: 'User Actions', description: 'Perform basic user actions' },
      { name: 'Manage Users', description: 'Admin can manage users' },
      {
        name: 'Manage Roles',
        description: 'Admin can manage roles and permissions',
      },
    ];

    const insertedPermissions = [];
    for (const perm of defaultPermissions) {
      let permission = await Permission.findOne({ name: perm.name });
      if (!permission) {
        permission = await Permission.create(perm);
        console.log(`Created permission: ${perm.name}`);
      }
      insertedPermissions.push(permission._id);
    }

    const roles = [
      {
        name: 'Admin',
        permissions: insertedPermissions, // all permissions
      },
      {
        name: 'User',
        permissions: [insertedPermissions[0]], // only 'User Actions'
      },
    ];

    for (const roleData of roles) {
      const roleExists = await Role.findOne({ name: roleData.name });
      if (!roleExists) {
        await Role.create(roleData);
        console.log(`Created role: ${roleData.name}`);
      } else {
        console.log(`Role already exists: ${roleData.name}`);
      }
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();
