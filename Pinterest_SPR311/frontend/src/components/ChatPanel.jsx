import { useState, useRef, useEffect } from "react";
import "./ChatPanel.css";

const ChatPanel = ({ onClose }) => {
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="chat-panel-header">
          <button className="chat-back-btn" onClick={onClose} title="Назад">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="chat-header-user">
            <div className="chat-avatar inspira-avatar-small">
              <span>С</span>
            </div>
            <span className="chat-user-name">Саша</span>
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
            {showOptionsMenu && (
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
          <div className="chat-placeholder">
            <p>Вадим надіслав пін</p>
          </div>
        </div>

        <div className="chat-input-area">
          <button className="chat-attach-btn" title="Додати">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </button>
          <input
            type="text"
            className="chat-input"
            placeholder="Введіть повідомлення..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="chat-send-btn" title="Надіслати">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
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
