import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddCustomerIdToOrders1664323707739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "orders",
      new TableColumn({
        name: "customer_id",
        type: "uuid",
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      "orders",
      new TableForeignKey({
        name: "OrdersCustomer",
        columnNames: ["customer_id"],
        referencedTableName: "customers",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL", // O campo customer_id ficará nulo, mas a order será mantida quando um customer for removido.
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // A ordem é importante! Sempre na ordem reversa do que foi feito no up
    await queryRunner.dropForeignKey("orders", "OrdersCustomer");
    await queryRunner.dropColumn("orders", "customer_id");
  }
}
