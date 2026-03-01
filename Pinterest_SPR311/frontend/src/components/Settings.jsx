import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
      <div className="settings-page">
        <Navbar />
        <div className="settings-container">
          <div className="settings-content">
            <h1>Налаштування</h1>
            <p>Будь ласка, увійдіть, щоб переглянути налаштування.</p>
          </div>
        </div>
      </div>
    );
  }

  const settingsMenuItems = [
    {
      id: "general",
      label: "Налаштування",
      path: "/settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
        </svg>
      ),
    },
    {
      id: "recommendations",
      label: "Настройка рекомендаций",
      path: "/settings/recommendations",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      ),
    },
    {
      id: "connected",
      label: "Связано с Pinterest",
      path: "/settings/connected",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      ),
    },
    {
      id: "privacy",
      label: "Центр жалоб и сообщений о нарушениях",
      path: "/settings/privacy",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
    },
    {
      id: "app",
      label: "Установить приложение Windows",
      path: "#",
      external: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
    },
    {
      id: "beta",
      label: "Стать бета-тестером",
      path: "#",
      external: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      ),
    },
  ];

  const supportItems = [
    {
      id: "help",
      label: "Справочный центр",
      path: "#",
      external: true,
    },
    {
      id: "widget",
      label: "Создать виджет",
      path: "#",
      external: true,
    },
    {
      id: "copyright",
      label: "Авторские права",
      path: "#",
      external: true,
    },
    {
      id: "ads",
      label: "Персонализированные объявления",
      path: "#",
      external: true,
    },
    {
      id: "privacy-rights",
      label: "Ваши права на конфиденциальность",
      path: "#",
      external: true,
    },
    {
      id: "privacy-policy",
      label: "Политика конфиденциальности",
      path: "#",
      external: true,
    },
    {
      id: "terms",
      label: "Условия использования",
      path: "#",
      external: true,
    },
  ];

  const resourceItems = [
    { id: "about", label: "О нас", path: "#", external: true },
    { id: "news", label: "Новости", path: "#", external: true },
    { id: "organizations", label: "Для организаций", path: "#", external: true },
    { id: "vacancies", label: "Вакансии", path: "#", external: true },
  ];

  const handleItemClick = (item) => {
    if (item.external) {
      // Відкрити в новій вкладці або показати повідомлення
      alert(`${item.label} - функція в розробці`);
      return;
    }
    navigate(item.path);
  };

  const isActive = (path) => {
    if (path === "/settings") {
      return location.pathname === "/settings";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <div className="settings-main-container">
          <div className="settings-menu-container">
            <div className="settings-menu-header">
              <button
                className="settings-close-button"
                onClick={() => navigate("/")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <h2 className="settings-menu-title">Настройки и поддержка</h2>
            </div>

            <div className="settings-menu-section">
              <div className="settings-section-header">Настройки</div>
              {settingsMenuItems.map((item) => (
                <button
                  key={item.id}
                  className={`settings-menu-item ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => handleItemClick(item)}
                >
                  <span className="settings-menu-icon">{item.icon}</span>
                  <span className="settings-menu-label">{item.label}</span>
                  {item.external && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="external-icon"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="settings-menu-section">
              <div className="settings-section-header">Служба поддержки</div>
              {supportItems.map((item) => (
                <button
                  key={item.id}
                  className="settings-menu-item external"
                  onClick={() => handleItemClick(item)}
                >
                  <span className="settings-menu-label">{item.label}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="external-icon"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </button>
              ))}
            </div>

            <div className="settings-menu-section">
              <div className="settings-section-header">Ресурсы</div>
              {resourceItems.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  className="settings-menu-item external resource-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="settings-content-wrapper">
            <Routes>
              <Route path="/" element={<GeneralSettings />} />
              <Route path="/recommendations" element={<RecommendationSettings />} />
              <Route path="/connected" element={<ConnectedAccounts />} />
              <Route path="/privacy" element={<PrivacySettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
