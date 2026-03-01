import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/auth";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import GeneralSettings from "./GeneralSettings";
import RecommendationSettings from "./RecommendationSettings";
import ConnectedAccounts from "./ConnectedAccounts";
import PrivacySettings from "./PrivacySettings";
import "./Settings.css";

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="settings-page inspira-settings-page">
        <Navbar />
        <div className="home-layout">
          <Sidebar />
          <div className="settings-main-container inspira-settings-main" style={{ flex: 1 }}>
            <div className="inspira-settings-panel" style={{ margin: 32 }}>
              <h1>Налаштування</h1>
              <p>Будь ласка, увійдіть, щоб переглянути налаштування.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const settingsMenuItems = [
    { id: "profile", label: "Редагування профілю", path: "/settings", icon: "profile" },
    { id: "account", label: "Керування обліковими записами", path: "/settings/account", icon: "account" },
    { id: "visibility", label: "Видимість профілю", path: "/settings/visibility", icon: "visibility" },
    { id: "recommendations", label: "Налаштуйте рекомендації", path: "/settings/recommendations", icon: "recommendations" },
    { id: "notifications", label: "Сповіщення", path: "/settings/notifications", icon: "notifications" },
    { id: "brand", label: "Контент бренда", path: "/settings/brand", icon: "brand" },
    { id: "security", label: "Безпека", path: "/settings/security", icon: "security" },
    { id: "privacy", label: "Конфіденційність і дані", path: "/settings/privacy", icon: "privacy" },
    { id: "help", label: "Get help", path: "/settings/help", icon: "help" },
  ];

  const getIcon = (iconName) => {
    const icons = {
      profile: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      account: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      visibility: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      recommendations: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      notifications: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      brand: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        </svg>
      ),
      connect: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      ),
      security: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      privacy: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      help: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  const handleItemClick = (item) => navigate(item.path);

  const isActive = (path) => {
    if (path === "/settings") return location.pathname === "/settings";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="settings-page inspira-settings-page">
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <div className="settings-main-container inspira-settings-main">
          <div className="settings-menu-container inspira-settings-menu">
            <h2 className="inspira-settings-title">Налаштування</h2>
            {settingsMenuItems.map((item) => (
              <button
                key={item.id}
                className={`settings-menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                <span className="settings-menu-icon">{getIcon(item.icon)}</span>
                <span className="settings-menu-label">{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="settings-arrow">
                  <path d="M9 18l6-6-6-6"></path>
                </svg>
              </button>
            ))}
            <div className="inspira-settings-gear">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
              </svg>
            </div>
          </div>

          <div className="settings-content-wrapper inspira-settings-content">
            <Routes>
              <Route path="/" element={<GeneralSettings />} />
              <Route path="/account" element={<AccountManagement />} />
              <Route path="/visibility" element={<ProfileVisibilityPlaceholder />} />
              <Route path="/recommendations" element={<RecommendationSettings />} />
              <Route path="/notifications" element={<NotificationsSettings />} />
              <Route path="/brand" element={<BrandContentPlaceholder />} />
              <Route path="/connected" element={<ConnectedAccounts />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/privacy" element={<PrivacySettings />} />
              <Route path="/help" element={<HelpSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountManagement = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeError, setTypeError] = useState("");
  const [typeSuccess, setTypeSuccess] = useState("");

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await authService.getCurrentUser();
        setEmail(data?.email ?? "");
        setRole(data?.role ?? "User");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword.length < 6) {
      setPasswordError("Новий пароль має містити щонайменше 6 символів");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Паролі не збігаються");
      return;
    }
    try {
      await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess("Пароль успішно змінено");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Не вдалося змінити пароль");
    }
  };

  const handleChangeType = async () => {
    setTypeError("");
    setTypeSuccess("");
    const nextType = role === "Corporate" ? "User" : "Corporate";
    try {
      await authService.changeAccountType(nextType === "Corporate" ? "corporate" : "personal");
      setRole(nextType);
      setTypeSuccess(nextType === "Corporate" ? "Обліковий запис переведено на корпоративний" : "Обліковий запис переведено на звичайний");
      await updateUser();
      setTimeout(() => {
        setShowTypeModal(false);
        setTypeSuccess("");
      }, 1500);
    } catch (err) {
      setTypeError(err.response?.data?.message || "Не вдалося змінити тип");
    }
  };

  const handleDeactivate = async () => {
    setDeactivateLoading(true);
    try {
      await authService.deactivateAccount();
      logout();
      navigate("/");
    } catch (err) {
      setDeactivateLoading(false);
      alert(err.response?.data?.message || "Не вдалося деактивувати обліковий запис");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");
    if (!deletePassword.trim()) {
      setDeleteError("Введіть пароль");
      return;
    }
    setDeleteLoading(true);
    try {
      await authService.deleteAccount(deletePassword);
      logout();
      navigate("/");
    } catch (err) {
      setDeleteLoading(false);
      setDeleteError(err.response?.data?.message || "Невірний пароль або помилка видалення");
    }
  };

  if (loading) {
    return (
      <div className="inspira-settings-panel">
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="inspira-settings-panel">
      <h1>Керування обліковими записами</h1>
      <p className="section-desc">Ви можете змінити персональні дані або тип облікового запису.</p>

      <div className="inspira-settings-block">
        <h3>Ваш обліковий запис</h3>
        <div className="form-row">
          <label>Електронна пошта</label>
          <input type="text" value={email} readOnly className="inspira-input" />
        </div>
        <div className="form-row actions-row">
          <span>Пароль</span>
          <button type="button" className="inspira-btn-primary" onClick={() => setShowPasswordModal(true)}>
            Змінити
          </button>
        </div>
      </div>

      <div className="inspira-settings-block">
        <h3>Перетворіть звичайний обліковий запис на корпоративний</h3>
        <p>З корпоративним обліковим записом ви матимете доступ до таких інструментів, як реклама й аналітика, щоб розвивати свій бізнес у Inspira.</p>
        <button
          type="button"
          className="inspira-btn-primary"
          onClick={() => { setShowTypeModal(true); setTypeError(""); setTypeSuccess(""); }}
        >
          Змінити тип
        </button>
        {role === "Corporate" && <p className="status">Поточний тип: корпоративний</p>}
      </div>

      <div className="inspira-settings-block">
        <h3>Деактивація та видалення</h3>
        <p>Тимчасово приховайте свій профіль, піни й дошки.</p>
        <button
          type="button"
          className="inspira-btn-primary"
          onClick={() => setShowDeactivateModal(true)}
        >
          Деактивувати обліковий запис
        </button>
        <p>Остаточно видаліть свої дані й усе, що пов'язано з вашим обліковим записом</p>
        <button
          type="button"
          className="inspira-btn-primary inspira-btn-danger"
          onClick={() => { setShowDeleteModal(true); setDeletePassword(""); setDeleteError(""); }}
        >
          Видалити обліковий запис
        </button>
      </div>

      {/* Модалка зміни пароля */}
      {showPasswordModal && (
        <div className="inspira-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="inspira-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Змінити пароль</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-row">
                <label>Поточний пароль</label>
                <input
                  type="password"
                  className="inspira-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Новий пароль</label>
                <input
                  type="password"
                  className="inspira-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div className="form-row">
                <label>Підтвердіть новий пароль</label>
                <input
                  type="password"
                  className="inspira-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && <p className="form-error">{passwordError}</p>}
              {passwordSuccess && <p className="form-success">{passwordSuccess}</p>}
              <div className="inspira-modal-actions">
                <button type="button" className="inspira-modal-cancel" onClick={() => setShowPasswordModal(false)}>Скасувати</button>
                <button type="submit" className="inspira-modal-primary">Зберегти</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модалка зміни типу */}
      {showTypeModal && (
        <div className="inspira-modal-overlay" onClick={() => setShowTypeModal(false)}>
          <div className="inspira-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Змінити тип облікового запису</h3>
            <p>
              {role === "Corporate"
                ? "Перетворити корпоративний обліковий запис назад на звичайний?"
                : "Перетворити обліковий запис на корпоративний? Ви матимете доступ до інструментів реклами та аналітики."}
            </p>
            {typeError && <p className="form-error">{typeError}</p>}
            {typeSuccess && <p className="form-success">{typeSuccess}</p>}
            <div className="inspira-modal-actions">
              <button type="button" className="inspira-modal-cancel" onClick={() => setShowTypeModal(false)}>Скасувати</button>
              <button type="button" className="inspira-modal-primary" onClick={handleChangeType}>
                {role === "Corporate" ? "Звичайний обліковий запис" : "Корпоративний обліковий запис"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка деактивації */}
      {showDeactivateModal && (
        <div className="inspira-modal-overlay" onClick={() => !deactivateLoading && setShowDeactivateModal(false)}>
          <div className="inspira-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Деактивувати обліковий запис?</h3>
            <p>Ваш профіль, піни та дошки будуть приховані. Ви не зможете увійти, доки обліковий запис не буде відновлено.</p>
            <div className="inspira-modal-actions">
              <button type="button" className="inspira-modal-cancel" onClick={() => setShowDeactivateModal(false)} disabled={deactivateLoading}>Скасувати</button>
              <button type="button" className="inspira-btn-danger" onClick={handleDeactivate} disabled={deactivateLoading}>
                {deactivateLoading ? "Виконується…" : "Деактивувати"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка видалення */}
      {showDeleteModal && (
        <div className="inspira-modal-overlay" onClick={() => !deleteLoading && setShowDeleteModal(false)}>
          <div className="inspira-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Видалити обліковий запис</h3>
            <p>Цю дію не можна скасувати. Усі ваші дані, піни та дошки будуть видалені назавжди.</p>
            <form onSubmit={handleDelete}>
              <div className="form-row">
                <label>Введіть пароль для підтвердження</label>
                <input
                  type="password"
                  className="inspira-input"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Пароль"
                  required
                />
              </div>
              {deleteError && <p className="form-error">{deleteError}</p>}
              <div className="inspira-modal-actions">
                <button type="button" className="inspira-modal-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>Скасувати</button>
                <button type="submit" className="inspira-btn-danger" disabled={deleteLoading}>
                  {deleteLoading ? "Видалення…" : "Видалити обліковий запис"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileVisibilityPlaceholder = () => (
  <div className="inspira-settings-panel">
    <h1>Видимість профілю</h1>
    <p>Керуйте тим, як інші можуть переглядати ваш профіль у Inspira і за межами платформи.</p>
    <div className="inspira-settings-block">
      <h3>Приватний профіль</h3>
      <p>Якщо у вас приватний профіль, лише схвалені вами люди можуть переглядати ваш профіль, а також піни, дошки, відгуки і групи. <a href="#">Дізнайтеся</a></p>
    </div>
    <div className="inspira-settings-block">
      <h3>Конфіденційність у пошукових системах</h3>
      <p>Приховуйте профіль від пошукових систем (наприклад, Google). <a href="#">Дізнайтеся</a></p>
    </div>
  </div>
);

const defaultNotificationSettings = {
  likes: true,
  comments: true,
  follows: true,
  newPins: true,
  saves: true,
  system: true,
  emailSummary: "daily", // daily | weekly | never
};

const loadNotificationSettings = () => {
  try {
    const saved = localStorage.getItem("notificationSettings");
    if (saved) {
      return { ...defaultNotificationSettings, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return defaultNotificationSettings;
};

const NotificationsSettings = () => {
  const [settings, setSettings] = useState(loadNotificationSettings);
  const [savedAt, setSavedAt] = useState(null);

  const updateSetting = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      localStorage.setItem("notificationSettings", JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
    setSavedAt(new Date());
  };

  const handleCheckbox = (key) => (e) => {
    updateSetting(key, e.target.checked);
  };

  const handleEmailChange = (e) => {
    updateSetting("emailSummary", e.target.value);
  };

  return (
    <div className="inspira-settings-panel">
      <h1>Сповіщення</h1>
      <p className="section-desc">
        Налаштуйте, які сповіщення ви хочете бачити в Inspira та як часто отримувати email‑дайджести.
      </p>

      <div className="inspira-settings-block">
        <h3>Сповіщення в застосунку</h3>
        <p>Ці сповіщення показуються у вкладці «Сповіщення» та у верхньому правому куті.</p>
        <label className="settings-toggle-row">
          <input
            type="checkbox"
            checked={settings.likes}
            onChange={handleCheckbox("likes")}
          />
          <span>
            Вподобання ваших пінів
            <span className="settings-toggle-desc">Коли хтось ставить «лайк» на ваш пін.</span>
          </span>
        </label>
        <label className="settings-toggle-row">
          <input
            type="checkbox"
            checked={settings.comments}
            onChange={handleCheckbox("comments")}
          />
          <span>
            Коментарі до пінів
            <span className="settings-toggle-desc">Коли хтось коментує ваш пін.</span>
          </span>
        </label>
        <label className="settings-toggle-row">
          <input
            type="checkbox"
            checked={settings.follows}
            onChange={handleCheckbox("follows")}
          />
          <span>
            Нові підписники
            <span className="settings-toggle-desc">Коли хтось підписується на вас.</span>
          </span>
        </label>
        <label className="settings-toggle-row">
          <input
            type="checkbox"
            checked={settings.newPins}
            onChange={handleCheckbox("newPins")}
          />
          <span>
            Нові піни ваших підписок
            <span className="settings-toggle-desc">Коли автори, на яких ви підписані, публікують нові піни.</span>
          </span>
        </label>
        <label className="settings-toggle-row">
          <input
            type="checkbox"
            checked={settings.saves}
            onChange={handleCheckbox("saves")}
          />
          <span>
            Збереження ваших пінів
            <span className="settings-toggle-desc">Коли хтось зберігає ваш пін на свою дошку.</span>
          </span>
        </label>
        <label className="settings-toggle-row">
          <input
            type="checkbox"
            checked={settings.system}
            onChange={handleCheckbox("system")}
          />
          <span>
            Сервісні сповіщення
            <span className="settings-toggle-desc">Оновлення сервісу, безпека, важливі зміни в акаунті.</span>
          </span>
        </label>
      </div>

      <div className="inspira-settings-block">
        <h3>Email‑сповіщення</h3>
        <p>Отримуйте короткі дайджести активності у вас в Inspira.</p>
        <div className="settings-radio-group">
          <label>
            <input
              type="radio"
              name="emailSummary"
              value="daily"
              checked={settings.emailSummary === "daily"}
              onChange={handleEmailChange}
            />
            Щоденний дайджест
          </label>
          <label>
            <input
              type="radio"
              name="emailSummary"
              value="weekly"
              checked={settings.emailSummary === "weekly"}
              onChange={handleEmailChange}
            />
            Щотижневий дайджест
          </label>
          <label>
            <input
              type="radio"
              name="emailSummary"
              value="never"
              checked={settings.emailSummary === "never"}
              onChange={handleEmailChange}
            />
            Не надсилати email‑сповіщення
          </label>
        </div>
        {savedAt && (
          <p className="form-success">
            Налаштування збережено {savedAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}.
          </p>
        )}
      </div>
    </div>
  );
};

const BrandContentPlaceholder = () => (
  <div className="inspira-settings-panel">
    <h1>Контент бренда</h1>
    <p>Програма «Контент бренда» Inspira – послуга, що дає авторам змогу отримати спонсорську підтримку від брендів.</p>
    <h3>Реєстрація в програмі «Контент бренда»</h3>
    <p>Ми зробимо все можливе, щоб допомогти вам знайти потрібні бренди, але реєстрація не гарантує отримання пропозицій від них.</p>
    <button className="inspira-btn-primary">Зареєструватися</button>
  </div>
);

const loadSessions = () => {
  try {
    const raw = localStorage.getItem("security.sessions");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  const deviceName = navigator.platform || "Цей пристрій";
  const ua = navigator.userAgent || "";
  const browser =
    ua.includes("Chrome") ? "Chrome" :
    ua.includes("Firefox") ? "Firefox" :
    ua.includes("Safari") ? "Safari" :
    "Браузер";
  const initial = [
    {
      id: `sess_${Date.now()}`,
      deviceName,
      browser,
      lastActive: new Date().toISOString(),
      current: true,
    },
  ];
  try {
    localStorage.setItem("security.sessions", JSON.stringify(initial));
  } catch {
    // ignore
  }
  return initial;
};

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    try {
      return localStorage.getItem("security.twoFactorEnabled") === "true";
    } catch {
      return false;
    }
  });
  const [twoFactorSavedAt, setTwoFactorSavedAt] = useState(null);
  const [sessions, setSessions] = useState(loadSessions);
  const [sessionsOpen, setSessionsOpen] = useState(false);

  const saveSessions = (next) => {
    setSessions(next);
    try {
      localStorage.setItem("security.sessions", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const toggleTwoFactor = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    try {
      localStorage.setItem("security.twoFactorEnabled", next ? "true" : "false");
    } catch {
      // ignore
    }
    setTwoFactorSavedAt(new Date());
  };

  const handleEndSession = (id) => {
    const next = sessions.filter((s) => s.id !== id);
    saveSessions(next);
  };

  const handleEndAllOther = (currentId) => {
    const next = sessions.filter((s) => s.id === currentId);
    saveSessions(next);
  };

  return (
    <div className="inspira-settings-panel">
      <h1>Безпека</h1>
      <p>
        Використовуйте додаткові заходи безпеки, наприклад, увімкніть двофакторну автентифікацію та
        перевірте список підключених пристроїв, щоб захистити обліковий запис, піни та дошки.
      </p>

      <div className="inspira-settings-block">
        <h3>Вхід у додатки</h3>
        <p>
          Стежте за тим, де ви використовували для входу свій профіль Inspira. У цій версії програми
          підключені додатки ще не налаштовані.
        </p>
        <p className="status">Ви не створили жодного додатка</p>
      </div>

      <div className="inspira-settings-block">
        <h3>Двофакторна автентифікація</h3>
        <p>
          Це забезпечує додатковий захист вашого облікового запису. Після ввімкнення Inspira може
          запитувати додатковий код під час входу.
        </p>
        <label className="settings-toggle-row">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={toggleTwoFactor}
          />
          <span>
            Увімкнути двофакторну автентифікацію
            <span className="settings-toggle-desc">
              Рекомендується для кращого захисту облікового запису.
            </span>
          </span>
        </label>
        {twoFactorSavedAt && (
          <p className="form-success">
            Налаштування оновлено{" "}
            {twoFactorSavedAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}.
          </p>
        )}
      </div>

      <div className="inspira-settings-block">
        <h3>Підключені пристрої</h3>
        <p>
          Ось список пристроїв, з яких ви входили у ваш обліковий запис. Якщо ви не впізнаєте
          пристрій, завершіть сеанс.
        </p>
        <button
          type="button"
          className="inspira-btn-primary"
          onClick={() => setSessionsOpen(true)}
        >
          Показати сеанси
        </button>
      </div>

      {sessionsOpen && (
        <div className="inspira-modal-overlay" onClick={() => setSessionsOpen(false)}>
          <div className="inspira-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Активні сеанси</h3>
            {sessions.length === 0 ? (
              <p>Немає активних сеансів.</p>
            ) : (
              <div className="sessions-list">
                {sessions.map((s) => (
                  <div key={s.id} className="session-item">
                    <div className="session-main">
                      <div className="session-title">
                        {s.deviceName || "Пристрій"}
                        {s.current && <span className="session-badge">Цей пристрій</span>}
                      </div>
                      <div className="session-sub">
                        {s.browser && <span>{s.browser}</span>}
                        {s.lastActive && (
                          <span>
                            Остання активність:{" "}
                            {new Date(s.lastActive).toLocaleString("uk-UA", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="inspira-btn-outline"
                      onClick={() => handleEndSession(s.id)}
                    >
                      Завершити сеанс
                    </button>
                  </div>
                ))}
                {sessions.length > 1 && (
                  <button
                    type="button"
                    className="inspira-btn-primary"
                    onClick={() => {
                      const current = sessions.find((s) => s.current) || sessions[0];
                      handleEndAllOther(current.id);
                    }}
                  >
                    Завершити всі інші сеанси
                  </button>
                )}
              </div>
            )}
            <div className="inspira-modal-actions" style={{ marginTop: 16 }}>
              <button
                type="button"
                className="inspira-modal-cancel"
                onClick={() => setSessionsOpen(false)}
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const helpTopics = [
  {
    id: "get-account",
    section: "start",
    title: "Отримайте обліковий запис Inspira",
    body: [
      "Щоб повністю користуватися Inspira (зберігати піни, створювати дошки, писати повідомлення), потрібен обліковий запис.",
      "Для реєстрації вам знадобиться робоча електронна пошта та унікальне ім'я користувача.",
    ],
    steps: [
      "Перейдіть на головну сторінку та натисніть «Увійти / Зареєструватися».",
      "Обери «Створити обліковий запис» і введіть email, пароль та ім'я користувача.",
      "Підтвердьте реєстрацію (якщо на пошті прийде лист-підтвердження).",
      "Після входу налаштуйте профіль у розділі «Редагування профілю».",
    ],
  },
  {
    id: "find-profile",
    section: "start",
    title: "Знайдіть свій профіль",
    body: [
      "Ваш профіль містить усі створені та збережені піни, дошки та підписників.",
    ],
    steps: [
      "У верхній панелі натисніть на аватар праворуч.",
      "У меню оберіть пункт з вашим ім'ям користувача — ви перейдете на сторінку профілю.",
      "Посилання на профіль можна скопіювати з адресного рядка браузера та поділитися з друзями.",
    ],
  },
  {
    id: "update-app",
    section: "start",
    title: "Оновіть програму Inspira",
    body: [
      "Ми регулярно додаємо нові можливості та виправлення. Радимо користуватися останньою версією.",
    ],
    steps: [
      "Якщо ви у браузері — просто перезавантажте сторінку (Ctrl+F5), щоб отримати найсвіжішу збірку.",
      "Якщо Inspira встановлена як PWA, перевстановіть ярлик через меню браузера.",
    ],
  },
  {
    id: "login-logout",
    section: "account",
    title: "Вхід та вихід із Inspira",
    body: [
      "Щоб змінити обліковий запис або завершити сеанс на спільному комп'ютері, використовуйте вихід із профілю.",
    ],
    steps: [
      "Натисніть на аватар у верхньому правому куті.",
      "Оберіть пункт «Вийти».",
      "Щоб увійти знову, натисніть «Увійти» і введіть email та пароль.",
    ],
  },
  {
    id: "cant-login",
    section: "account",
    title: "Не можу увійти в Inspira",
    body: [
      "Найчастіша причина — неправильний пароль або помилка в електронній пошті.",
    ],
    steps: [
      "Перевірте, що ви ввели email без помилок (особливо домен: @gmail.com тощо).",
      "Спробуйте змінити мову розкладки та переконатися, що Caps Lock вимкнений.",
      "Якщо пароль забуто — скористайтеся опцією скидання паролю в формі входу (якщо вона реалізована у вашій версії додатку).",
    ],
  },
  {
    id: "personalization",
    section: "account",
    title: "Змінити налаштування персоналізації",
    body: [
      "Inspira показує рекомендації на основі ваших дій і налаштувань.",
    ],
    steps: [
      "Перейдіть до «Налаштування → Конфіденційність і дані».",
      "У блоці рекомендацій вимкніть або увімкніть персоналізовані рекомендації та рекламу.",
      "Зміни застосовуються до майбутніх рекомендацій у стрічці.",
    ],
  },
  {
    id: "reset-password",
    section: "account",
    title: "Скинути або змінити пароль",
    body: [
      "Регулярна зміна пароля — хороша практика безпеки.",
    ],
    steps: [
      "Перейдіть у «Налаштування → Керування обліковими записами».",
      "У блоці «Ваш обліковий запис» натисніть «Змінити» навпроти пароля.",
      "Введіть поточний пароль, а потім новий та підтвердження.",
      "Збережіть зміни. Після цього вхід буде можливий лише з новим паролем.",
    ],
  },
  {
    id: "open-pins",
    section: "discover",
    title: "Відкрийте піни або дошки",
    body: [
      "Піни — це картки з ідеями. Дошки — колекції пінів на одну тему.",
    ],
    steps: [
      "На головній сторінці прокручуйте стрічку та натискайте на пін, щоб відкрити деталі.",
      "Щоб відкрити дошку автора — натисніть назву дошки під піном.",
    ],
  },
  {
    id: "upload-media",
    section: "discover",
    title: "Завантажити зображення або відео",
    body: [
      "Ви можете ділитися власними ідеями, завантажуючи зображення або відео у вигляді пінів.",
    ],
    steps: [
      "Натисніть кнопку «Створити» зліва та оберіть «Пін».",
      "Виберіть зображення (чи відео, якщо ця функція доступна у вашій збірці) зі свого пристрою.",
      "Додайте заголовок, опис і виберіть дошку для збереження.",
      "Натисніть «Опублікувати».",
    ],
  },
  {
    id: "explore-inspira",
    section: "discover",
    title: "Обстежте Inspira",
    body: [
      "Щоб знаходити нові ідеї, використовуйте пошук та тематичні рекомендації.",
    ],
    steps: [
      "Вгорі сторінки введіть ключові слова (наприклад, «дизайн інтер'єру», «фітнес»).",
      "Перейдіть на вкладку, яка вас цікавить, або просто прокручуйте стрічку.",
      "Зберігайте піни на свої дошки, щоб не загубити цікаві ідеї.",
    ],
  },
  {
    id: "save-video",
    section: "discover",
    title: "Збереження відео на дошці",
    body: [
      "Відео‑піни зберігаються так само, як і звичайні зображення.",
    ],
    steps: [
      "відкрийте відео‑пін, який вам сподобався.",
      "Натисніть кнопку «Зберегти» і оберіть дошку.",
      "Відео з'явиться на дошці разом з іншими пін‑картками.",
    ],
  },
];

const HelpSettings = () => {
  const [search, setSearch] = useState("");
  const [activeTopicId, setActiveTopicId] = useState("get-account");

  const filteredTopics = helpTopics.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.body.some((p) => p.toLowerCase().includes(q))
    );
  });

  const getTopicsBySection = (section) =>
    filteredTopics.filter((t) => t.section === section);

  const active =
    helpTopics.find((t) => t.id === activeTopicId) ||
    filteredTopics[0] ||
    helpTopics[0];

  const renderTopicLinks = (section, label) => {
    const topics = getTopicsBySection(section);
    if (topics.length === 0) {
      return null;
    }
    return (
      <div className="help-category">
        <h4>{label}</h4>
        <ul>
          {topics.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={`help-link ${t.id === activeTopicId ? "active" : ""}`}
                onClick={() => setActiveTopicId(t.id)}
              >
                {t.title}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="inspira-btn-outline"
          onClick={() => setActiveTopicId(topics[0].id)}
        >
          Більше
        </button>
      </div>
    );
  };

  return (
    <div className="inspira-settings-panel inspira-help-panel">
      <h1>Потрібна допомога?</h1>
      <input
        type="text"
        placeholder="Як ми можемо допомогти?"
        className="inspira-search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="help-categories">
        {renderTopicLinks("start", "Почніть")}
        {renderTopicLinks("account", "Керування обліковим записом та налаштуваннями")}
        {renderTopicLinks("discover", "Знайдіть і збережіть")}
      </div>

      {active && (
        <div className="help-topic">
          <h2>{active.title}</h2>
          {active.body.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
          {active.steps && active.steps.length > 0 && (
            <>
              <h3>Кроки</h3>
              <ol>
                {active.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
