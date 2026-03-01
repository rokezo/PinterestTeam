using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClonePinterest.API.Models;

[Table("Messages")]
public class Message
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int SenderId { get; set; }

    [Required]
    public int RecipientId { get; set; }

    [MaxLength(2000)]
    public string? Content { get; set; }

    [MaxLength(500)]
    public string? AttachmentUrl { get; set; }

    [MaxLength(20)]
    public string? AttachmentType { get; set; } // image, video

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;

    [ForeignKey(nameof(SenderId))]
    public virtual User Sender { get; set; } = null!;

    [ForeignKey(nameof(RecipientId))]
    public virtual User Recipient { get; set; } = null!;
}

