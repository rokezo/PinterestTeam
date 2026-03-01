using System.Security.Claims;
using ClonePinterest.API.Data;
using ClonePinterest.API.DTOs.Message;
using ClonePinterest.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClonePinterest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MessagesController> _logger;

    public MessagesController(ApplicationDbContext context, ILogger<MessagesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private const long MaxVideoSizeBytes = 20 * 1024 * 1024; // 20MB

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;
        if (int.TryParse(userIdClaim, out var id))
        {
            return id;
        }
        return null;
    }

    /// <summary>
    /// Отримати список діалогів (останнє повідомлення з кожним користувачем)
    /// </summary>
    [HttpGet("dialogs")]
    public async Task<ActionResult<IEnumerable<ConversationPreviewDto>>> GetDialogs()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
        {
            return Unauthorized(new { message = "User not authorized" });
        }

        try
        {
            var userId = currentUserId.Value;

            // Всі співрозмовники, з якими є хоч одне повідомлення
            var partnerIdsQuery = _context.Messages
                .Where(m => m.SenderId == userId || m.RecipientId == userId)
                .Select(m => m.SenderId == userId ? m.RecipientId : m.SenderId)
                .Distinct();

            var partnerIds = await partnerIdsQuery.ToListAsync();

            if (!partnerIds.Any())
            {
                return Ok(Array.Empty<ConversationPreviewDto>());
            }

            // Витягуємо останнє повідомлення та кількість непрочитаних
            var dialogs = new List<ConversationPreviewDto>();

            foreach (var partnerId in partnerIds)
            {
                var lastMessage = await _context.Messages
                    .Where(m =>
                        (m.SenderId == userId && m.RecipientId == partnerId) ||
                        (m.SenderId == partnerId && m.RecipientId == userId))
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();

                var unreadCount = await _context.Messages
                    .Where(m =>
                        m.SenderId == partnerId &&
                        m.RecipientId == userId &&
                        !m.IsRead)
                    .CountAsync();

                var partner = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id == partnerId);

                if (partner == null)
                {
                    continue;
                }

                dialogs.Add(new ConversationPreviewDto
                {
                    UserId = partner.Id,
                    Username = partner.Username,
                    AvatarUrl = partner.AvatarUrl,
                    LastMessage = lastMessage?.Content,
                    LastMessageAt = lastMessage?.CreatedAt,
                    UnreadCount = unreadCount
                });
            }

            // Сортуємо по часу останнього повідомлення
            dialogs = dialogs
                .OrderByDescending(d => d.LastMessageAt ?? DateTime.MinValue)
                .ToList();

            return Ok(dialogs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dialogs for user");
            return StatusCode(500, new { message = "Error getting dialogs" });
        }
    }

    /// <summary>
    /// Отримати всі повідомлення з конкретним користувачем
    /// </summary>
    [HttpGet("with/{userId:int}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetConversation(int userId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
        {
            return Unauthorized(new { message = "User not authorized" });
        }

        if (userId == currentUserId)
        {
            return BadRequest(new { message = "Cannot create conversation with yourself" });
        }

        try
        {
            var partner = await _context.Users.FindAsync(userId);
            if (partner == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var me = currentUserId.Value;

            var messages = await _context.Messages
                .Where(m =>
                    (m.SenderId == me && m.RecipientId == userId) ||
                    (m.SenderId == userId && m.RecipientId == me))
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    RecipientId = m.RecipientId,
                    Content = m.Content,
                    CreatedAt = m.CreatedAt,
                    IsRead = m.IsRead,
                    AttachmentUrl = m.AttachmentUrl,
                    AttachmentType = m.AttachmentType
                })
                .ToListAsync();

            // Позначаємо всі вхідні як прочитані
            var unreadMessages = await _context.Messages
                .Where(m =>
                    m.SenderId == userId &&
                    m.RecipientId == me &&
                    !m.IsRead)
                .ToListAsync();

            if (unreadMessages.Any())
            {
                foreach (var msg in unreadMessages)
                {
                    msg.IsRead = true;
                }

                await _context.SaveChangesAsync();
            }

            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation with user {UserId}", userId);
            return StatusCode(500, new { message = "Error getting conversation" });
        }
    }

    /// <summary>
    /// Надіслати повідомлення користувачу
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] CreateMessageDto dto)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
        {
            return Unauthorized(new { message = "User not authorized" });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (dto.RecipientId == currentUserId)
        {
            return BadRequest(new { message = "Cannot send message to yourself" });
        }

        try
        {
            var recipient = await _context.Users.FindAsync(dto.RecipientId);
            if (recipient == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var message = new Message
            {
                SenderId = currentUserId.Value,
                RecipientId = dto.RecipientId,
                Content = dto.Content.Trim(),
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var result = new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                RecipientId = message.RecipientId,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                IsRead = message.IsRead,
                AttachmentUrl = message.AttachmentUrl,
                AttachmentType = message.AttachmentType
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            return StatusCode(500, new { message = "Error sending message" });
        }
    }

    /// <summary>
    /// Надіслати повідомлення з вкладенням (зображення або відео)
    /// </summary>
    [HttpPost("with-attachment")]
    [RequestSizeLimit(MaxVideoSizeBytes * 2)] // невеликий запас
    public async Task<ActionResult<MessageDto>> SendMessageWithAttachment(
        [FromForm] CreateMessageWithAttachmentDto dto,
        IFormFile? file)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == null)
        {
            return Unauthorized(new { message = "User not authorized" });
        }

        if (dto.RecipientId == currentUserId)
        {
            return BadRequest(new { message = "Cannot send message to yourself" });
        }

        if ((file == null || file.Length == 0) && string.IsNullOrWhiteSpace(dto.Content))
        {
            return BadRequest(new { message = "Message must contain text or file" });
        }

        try
        {
            var recipient = await _context.Users.FindAsync(dto.RecipientId);
            if (recipient == null)
            {
                return NotFound(new { message = "User not found" });
            }

            string? attachmentUrl = null;
            string? attachmentType = null;

            if (file != null && file.Length > 0)
            {
                var contentType = file.ContentType.ToLowerInvariant();
                var isImage = contentType.StartsWith("image/");
                var isVideo = contentType.StartsWith("video/");

                if (!isImage && !isVideo)
                {
                    return BadRequest(new { message = "Only image or video files are allowed" });
                }

                if (isVideo && file.Length > MaxVideoSizeBytes)
                {
                    return BadRequest(new { message = "Video size cannot exceed 20MB" });
                }

                var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "messages");
                if (!Directory.Exists(uploadsRoot))
                {
                    Directory.CreateDirectory(uploadsRoot);
                }

                var extension = Path.GetExtension(file.FileName);
                var fileName = $"msg_{currentUserId.Value}_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsRoot, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                attachmentUrl = $"/uploads/messages/{fileName}";
                attachmentType = isImage ? "image" : "video";
            }

            var message = new Message
            {
                SenderId = currentUserId.Value,
                RecipientId = dto.RecipientId,
                Content = string.IsNullOrWhiteSpace(dto.Content) ? null : dto.Content.Trim(),
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                AttachmentUrl = attachmentUrl,
                AttachmentType = attachmentType
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var result = new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                RecipientId = message.RecipientId,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                IsRead = message.IsRead,
                AttachmentUrl = message.AttachmentUrl,
                AttachmentType = message.AttachmentType
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message with attachment");
            return StatusCode(500, new { message = "Error sending message" });
        }
    }
}

