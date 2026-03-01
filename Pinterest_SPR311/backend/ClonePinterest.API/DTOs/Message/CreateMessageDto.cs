using System.ComponentModel.DataAnnotations;

namespace ClonePinterest.API.DTOs.Message;

public class CreateMessageDto
{
    [Required]
    public int RecipientId { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
}

