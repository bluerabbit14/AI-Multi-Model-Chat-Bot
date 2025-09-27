import React, { useState, useEffect, useRef } from 'react'
import './ChatDashboard.css'

export default function ChatDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [inputValue, setInputValue] = useState('')
  const sidebarRef = useRef(null)

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close on mobile screens (<960px)
      if (window.innerWidth < 960 && sidebarExpanded) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setSidebarExpanded(false)
        }
      }
    }

    const handleResize = () => {
      // Close sidebar when switching to desktop view
      if (window.innerWidth >= 960) {
        setSidebarExpanded(false)
      }
    }

    if (sidebarExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
  }, [sidebarExpanded])

  // Auto-resize textarea on mount and when inputValue changes
  useEffect(() => {
    const textarea = document.querySelector('.input-field')
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }, [inputValue])

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }


  const aiModels = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' }
  ]


  return (
    <div className="App">
      {/* Mobile backdrop */}
      {sidebarExpanded && window.innerWidth < 960 && (
        <div className="mobile-backdrop" onClick={() => setSidebarExpanded(false)}></div>
      )}
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef} 
        className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}
      >
        <div className="hamburger-menu sidebar-hamburger" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </div>
        {/* Navbar items will be added here as needed */}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="hamburger-menu header-hamburger" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </div>
          <div className="header-left">
            <div className="app-title">PolyChat</div>
            <div className="model-selector">
              <select value={selectedModel} onChange={handleModelChange}>
                {aiModels.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="greeting">
            <span className="greeting-main">Hello, there</span>
            <span className="greeting-sub">How can I help you today?</span>
          </div>
          
          <div className="input-container">
            <div className="input-field-wrapper">
              <div className="input-grid">
                <textarea
                  className="input-field"
                  placeholder="Ask PolyChat"
                  value={inputValue}
                  onChange={handleInputChange}
                  rows="1"
                />
                <div className="voice-icon-wrapper">
                  {!inputValue.trim() && (
                    <i className="fas fa-microphone voice-icon"></i>
                  )}
                </div>
                <div className="input-icons-wrapper">
                  <i className="fas fa-plus input-icon"></i>
                  <i className="fas fa-link input-icon"></i>
                </div>
                <div className="send-button-wrapper">
                  {inputValue.trim() && (
                    <button className="send-button">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
