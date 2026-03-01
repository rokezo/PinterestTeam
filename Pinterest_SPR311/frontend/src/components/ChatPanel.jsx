import { useState, useRef, useEffect } from "react";
import { messagesService } from "../api/messages";
import { usersService } from "../api/users";
import { useAuth } from "../context/AuthContext";
import "./ChatPanel.css";

const ChatPanel = ({ onClose, initialUserId = null }) => {
  const { user: currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [dialogs, setDialogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingDialogs, setIsLoadingDialogs] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReasons, setReportReasons] = useState({});
  const optionsRef = useRef(null);

  const reportOptions = [
    "Недоречний вміст",
    "Спам",
    "Неприйнятна поведінка, погрози або ненависні висловлювання",
    "Домагання",
    "Імітація чужої особистості",
    "Зображення оголеного тіла",
    "Насильство",
    "Інше",
    "Самогубство або самоушкодження",
  ];

  const loadDialogs = async () => {
    try {
      setIsLoadingDialogs(true);
      const data = await messagesService.getDialogs();
      setDialogs(data || []);
    } catch (err) {
      console.error("Error loading dialogs", err);
    } finally {
      setIsLoadingDialogs(false);
    }
  };

  const loadConversation = async (userId) => {
    try {
      setIsLoadingMessages(true);
      const data = await messagesService.getConversation(userId);
      setMessages(data || []);
    } catch (err) {
      console.error("Error loading conversation", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectDialog = (dialog) => {
    setSelectedUser({
      id: dialog.userId,
      username: dialog.username,
      avatarUrl: dialog.avatarUrl,
    });
    loadConversation(dialog.userId);
  };

  const handleSelectUserById = async (userId) => {
    try {
      const dialog = dialogs.find((d) => d.userId === userId);
      if (dialog) {
        handleSelectDialog(dialog);
        return;
      }

      // Якщо діалогу ще немає – тягнемо справжній профіль користувача,
      // щоб мати його нікнейм та аватар
      const profile = await usersService.getUserProfile(userId);
      setSelectedUser({
        id: profile.id,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
      });
      await loadConversation(userId);
    } catch (err) {
      console.error("Error selecting user by id", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadDialogs();
  }, []);

  // Якщо прийшли з профілю з ?chatWith=ID – одразу відкриваємо діалог,
  // навіть якщо список діалогів наразі порожній (ще не було жодних повідомлень)
  useEffect(() => {
    if (!initialUserId) return;
    const targetId = Number(initialUserId);
    if (!targetId || Number.isNaN(targetId)) return;

    // якщо вже відкритий цей діалог – нічого не робимо
    if (selectedUser && selectedUser.id === targetId) return;

    const existing = dialogs.find((d) => d.userId === targetId);
    if (existing) {
      handleSelectDialog(existing);
    } else {
      handleSelectUserById(targetId);
    }
  }, [initialUserId, dialogs, selectedUser]);

  const handleSend = async () => {
    if (!selectedUser || !message.trim()) return;
    const content = message.trim();
    try {
      const sent = await messagesService.sendMessage(selectedUser.id, content);
      setMessages((prev) => [...prev, sent]);
      setMessage("");
      loadDialogs();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleOptionClick = (action) => {
    setShowOptionsMenu(false);
    if (action === "hide") setShowHideModal(true);
    else if (action === "block") setShowBlockModal(true);
    else if (action === "report") setShowReportModal(true);
  };

  const handleReportSubmit = () => {
    setShowReportModal(false);
    setReportReasons({});
  };

  return (
    <>
      <div className="chat-panel-overlay" onClick={onClose} />
      <div className="chat-panel inspira-chat-panel">
        {/* Left: dialogs list */}
        <div className="chat-dialogs-list">
          <div className="chat-dialogs-header">
            <h3>Повідомлення</h3>
          </div>
          {isLoadingDialogs ? (
            <div className="chat-dialogs-loading">Завантаження...</div>
          ) : dialogs.length === 0 ? (
            <div className="chat-dialogs-empty">Поки немає розмов</div>
          ) : (
            <ul className="chat-dialogs-items">
              {dialogs.map((d) => (
                <li
                  key={d.userId}
                  className={`chat-dialog-item ${selectedUser?.id === d.userId ? "active" : ""}`}
                  onClick={() => handleSelectDialog(d)}
                >
                  <div className="chat-avatar inspira-avatar-small">
                    {d.avatarUrl ? (
                      <img
                        src={
                          d.avatarUrl.startsWith("http") || d.avatarUrl.startsWith("//")
                            ? d.avatarUrl
                            : `http://localhost:5001${d.avatarUrl}`
                        }
                        alt={d.username}
                      />
                    ) : (
                      <span>{d.username?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div className="chat-dialog-info">
                    <span className="chat-user-name">{d.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: messages area */}
        <div className="chat-main">
          <div className="chat-panel-header">
            <button className="chat-back-btn" onClick={onClose} title="Назад">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="chat-header-user">
              {selectedUser ? (
                <>
                  <div className="chat-avatar inspira-avatar-small">
                    {selectedUser.avatarUrl ? (
                      <img
                        src={
                          selectedUser.avatarUrl.startsWith("http") ||
                          selectedUser.avatarUrl.startsWith("//")
                            ? selectedUser.avatarUrl
                            : `http://localhost:5001${selectedUser.avatarUrl}`
                        }
                        alt={selectedUser.username}
                      />
                    ) : (
                      <span>{selectedUser.username?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <span className="chat-user-name">{selectedUser.username}</span>
                </>
              ) : (
                <span className="chat-user-name">Виберіть діалог</span>
              )}
            </div>
            <div className="chat-options-wrapper" ref={optionsRef}>
              <button
                className="chat-options-btn"
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                title="Додаткові опції"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="6" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="18" r="1.5" />
                </svg>
              </button>
              {showOptionsMenu && selectedUser && (
                <div className="chat-options-dropdown">
                  <button onClick={() => handleOptionClick("view")}>Переглянути розмову</button>
                  <button onClick={() => handleOptionClick("hide")}>Приховати розмову</button>
                  <button onClick={() => handleOptionClick("block")}>Заблокувати</button>
                  <button onClick={() => handleOptionClick("report")}>Поскаржитись</button>
                </div>
              )}
            </div>
          </div>

          <div className="chat-messages-area">
            {isLoadingMessages && selectedUser ? (
              <div className="chat-messages-loading">Завантаження...</div>
            ) : !selectedUser ? (
              <div className="chat-placeholder">
                <p>Виберіть користувача, щоб почати розмову</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-placeholder">
                <p>Почніть перше повідомлення з {selectedUser.username}</p>
              </div>
            ) : (
              <div className="chat-messages-list">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-message ${
                      m.senderId === currentUser?.id ? "chat-message-outgoing" : "chat-message-incoming"
                    }`}
                  >
                    {m.content && (
                      <div className="chat-message-content">{m.content}</div>
                    )}
                    <div className="chat-message-time">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Введіть повідомлення..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={!selectedUser}
            />
            <button
              className="chat-send-btn"
              title="Надіслати"
              onClick={handleSend}
              disabled={!selectedUser || !message.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showHideModal && (
        <div className="inspira-modal-overlay" onClick={() => setShowHideModal(false)}>
          <div className="inspira-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Приховати розмову з користувачем Саша?</h3>
            <p>Цей дія не відображатиметься у вашому поштовому ящику, але повідомлення все одно можуть бути відправлені.</p>
            <p>Щоб ви не отримували повідомлення, видаліть розмову або заблокуйте користувача.</p>
            <div className="inspira-modal-actions">
              <button className="inspira-modal-cancel" onClick={() => setShowHideModal(false)}>Скасувати</button>
              <button className="inspira-modal-primary" onClick={() => { setShowHideModal(false); onClose(); }}>Приховати розмову</button>
            </div>
          </div>
        </div>
      )}

      {showBlockModal && (
        <div className="inspira-modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="inspira-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Заблокувати цього користувача [Саша]?</h3>
            <p>Ви не зможете обмінюватися повідомленнями з цим користувачем, і він не зможе надсилати вам повідомлення або бачити ваші повідомлення.</p>
            <div className="inspira-modal-actions">
              <button className="inspira-modal-cancel" onClick={() => setShowBlockModal(false)}>Скасувати</button>
              <button className="inspira-modal-primary" onClick={() => { setShowBlockModal(false); onClose(); }}>Заблокувати</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="inspira-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="inspira-modal inspira-modal-report" onClick={(e) => e.stopPropagation()}>
            <h3>Скарга на розмову</h3>
            <div className="report-options">
              {reportOptions.map((opt) => (
                <label key={opt} className="report-option">
                  <input
                    type="checkbox"
                    checked={reportReasons[opt] || false}
                    onChange={(e) => setReportReasons((prev) => ({ ...prev, [opt]: e.target.checked }))}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <div className="inspira-modal-actions">
              <button className="inspira-modal-cancel" onClick={() => setShowReportModal(false)}>Скасувати</button>
              <button className="inspira-modal-primary" onClick={handleReportSubmit}>Надіслати</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPanel;
