import React, { useState, useEffect, useRef } from 'react'
import './ChatDashboard.css'

export default function ChatDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [inputValue, setInputValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const sidebarRef = useRef(null)
  const dropdownRef = useRef(null)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleModelChange = (modelValue) => {
    setSelectedModel(modelValue)
    setDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
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
            <div className="model-selector" ref={dropdownRef}>
              <div className="model-selector-trigger" onClick={toggleDropdown}>
                <span className="selected-model">
                  {aiModels.find(model => model.value === selectedModel)?.label}
                </span>
                <i className={`fas fa-chevron-down dropdown-icon ${dropdownOpen ? 'open' : ''}`}></i>
              </div>
              
              {dropdownOpen && (
                <div className="model-dropdown">
                  <div className="dropdown-header">
                    <span>Choose your model</span>
                  </div>
                  <div className="dropdown-options">
                    {aiModels.map(model => (
                      <div
                        key={model.value}
                        className={`dropdown-option ${selectedModel === model.value ? 'selected' : ''}`}
                        onClick={() => handleModelChange(model.value)}
                      >
                        <div className="option-content">
                          <span className="option-label">{model.label}</span>
                          <span className="option-description">
                            {model.value === 'gpt-4' ? 'Most capable model' : 
                             model.value === 'gpt-3.5-turbo' ? 'Fast and efficient' : 
                             'Advanced reasoning'}
                          </span>
                        </div>
                        {selectedModel === model.value && (
                          <i className="fas fa-check option-check"></i>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
