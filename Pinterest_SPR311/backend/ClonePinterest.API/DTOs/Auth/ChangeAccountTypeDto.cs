using System.ComponentModel.DataAnnotations;

namespace ClonePinterest.API.DTOs.Auth;

public class ChangeAccountTypeDto
{
    [Required]
    [RegularExpression("^(User|Corporate)$", ErrorMessage = "Тип має бути User або Corporate")]
    public string AccountType { get; set; } = "User";
}
