using System.ComponentModel.DataAnnotations;

namespace ClonePinterest.API.DTOs.Auth;

public class ChangePasswordDto
{
    [Required(ErrorMessage = "Поточний пароль обов'язковий")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Новий пароль обов'язковий")]
    [MinLength(6, ErrorMessage = "Пароль має містити щонайменше 6 символів")]
    public string NewPassword { get; set; } = string.Empty;
}
