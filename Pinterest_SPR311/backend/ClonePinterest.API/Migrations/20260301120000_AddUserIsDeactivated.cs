using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClonePinterest.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIsDeactivated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeactivated",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeactivated",
                table: "Users");
        }
    }
}
