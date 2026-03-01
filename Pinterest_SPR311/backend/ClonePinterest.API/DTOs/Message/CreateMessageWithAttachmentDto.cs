using System.ComponentModel.DataAnnotations;

namespace ClonePinterest.API.DTOs.Message;

public class CreateMessageWithAttachmentDto
{
    [Required]
    public int RecipientId { get; set; }

    [MaxLength(2000)]
    public string? Content { get; set; }
}

