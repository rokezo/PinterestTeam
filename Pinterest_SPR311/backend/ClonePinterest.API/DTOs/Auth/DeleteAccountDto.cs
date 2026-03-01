using System.ComponentModel.DataAnnotations;

namespace ClonePinterest.API.DTOs.Auth;

public class DeleteAccountDto
{
    [Required(ErrorMessage = "Введіть пароль для підтвердження")]
    public string Password { get; set; } = string.Empty;
}
