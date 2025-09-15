import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Role } from "../../entity/Role";

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);

    // Check if roles already exist
    const existingRoles = await roleRepository.count();
    if (existingRoles > 0) {
      console.log("Roles already seeded, skipping...");
      return;
    }

    console.log("Seeding roles...");

    // Create viewer role first (no dependencies)
    const viewerRole = roleRepository.create({
      name: "viewer",
      description: "Can view data",
      children: [],
    });
    await roleRepository.save(viewerRole);

    // Create admin role (inherits from viewer)
    const adminRole = roleRepository.create({
      name: "admin",
      description: "Can manage data",
      children: [viewerRole],
    });
    await roleRepository.save(adminRole);

    // Create owner role (inherits from admin and viewer)
    const ownerRole = roleRepository.create({
      name: "owner",
      description: "Full system access",
      children: [adminRole, viewerRole],
    });
    await roleRepository.save(ownerRole);

    console.log("Roles seeded successfully");
  }
}
