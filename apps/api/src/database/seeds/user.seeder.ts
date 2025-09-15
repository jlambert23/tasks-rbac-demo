import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { User } from "../../entity/User";
import { Role } from "../../entity/Role";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log("Users already seeded, skipping...");
      return;
    }

    console.log("Seeding users...");

    // Get roles for assignment
    const viewerRole = await roleRepository.findOne({ where: { name: "viewer" } });
    const adminRole = await roleRepository.findOne({ where: { name: "admin" } });
    const ownerRole = await roleRepository.findOne({ where: { name: "owner" } });

    if (!viewerRole || !adminRole || !ownerRole) {
      throw new Error("Roles not found. Please run role seeder first.");
    }

    // Create test users
    const users = [
      {
        firstName: "John",
        lastName: "Viewer", 
        age: 25,
        role: viewerRole
      },
      {
        firstName: "Jane",
        lastName: "Admin",
        age: 30,
        role: adminRole
      },
      {
        firstName: "Bob",
        lastName: "Owner",
        age: 35,
        role: ownerRole
      }
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${user.firstName} ${user.lastName} with role: ${user.role.name}`);
    }

    console.log("Users seeded successfully");
  }
}