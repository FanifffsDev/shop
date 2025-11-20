import { getToken } from "../../utils/authUtils"
import "./startScreen.css"

import { useEffect, useState } from "react"

export default function StartScreen(){
  const [step, setStep] = useState(0)
  const [screen, setScreen] = useState('greeting') // 'greeting', 'student', 'teacher'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    thirdName: '',
    group: '',
    subject: ''
  })
  
  useEffect(() => {
    if (screen === 'greeting') {
      setTimeout(() => setStep(1), 800)
      setTimeout(() => setStep(2), 3500)
      setTimeout(() => setStep(3), 6500)
      setTimeout(() => setStep(4), 9000)
    }
  }, [screen])
  
  const handleNext = () => {
    setScreen('student')
  }
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const isStudentFormValid = () => {
    return formData.firstName && formData.lastName && formData.group
  }
  
  const isTeacherFormValid = () => {
    return formData.firstName && formData.lastName && formData.thirdName && formData.subject
  }
  
  const handleEnd = async () => {
    try {
      const userData = screen === 'student' 
        ? {
            role: 'student',
            firstName: formData.firstName,
            lastName: formData.lastName,
            group: formData.group
          }
        : {
            role: 'teacher',
            firstName: formData.firstName,
            lastName: formData.lastName,
            thirdName: formData.thirdName,
            subject: formData.subject
          }
      
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `tma ${getToken()}`,
        },
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        throw new Error('Registration failed')
      }
      
      const result = await response.json()
      console.log('Registration successful:', result)

      if(result.redirectTo){
        window.location = result.redirectTo;
      }
      
      
    } catch (error) {
      console.error('Error during registration:', error)
      
    }
  }
  
  if (screen === 'greeting') {
    return (
      <div className="container">
        <div className="panel">
          <div className="text">
            <div className={`greetings-1 ${step >= 1 ? "show" : ""} ${step >= 2 ? "move-up" : ""}`}>
              Привет 👋
            </div>
            <div className={`greetings-2 ${step >= 2 ? "show" : ""} ${step >= 3 ? "move-up" : ""}`}>
              Я помогаю со всеми этими очередями для сдачи лаб
            </div>
            <div className={`greetings-3 ${step >= 3 ? "show" : ""} ${step >= 4 ? "move-up" : ""}`}>
              А кто ты? Познакомимся?
            </div>
          </div>
          
          <div 
            className={`next-btn ${step >= 4 ? "show" : ""}`}
            onClick={handleNext}
          >
            <h3>Давай!</h3>
          </div>
          
        </div>
          <div className="gradient"></div>
      </div>
    )
  }
  
  if (screen === 'student') {
    return (
      <div className="container">
        <div className="panel">
          <div className="form-container">
            <h2 className="form-title">Регистрация студента</h2>
            
            <div className="form-group">
              <label>Имя</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
                        handleInputChange('firstName', value);
                    }}
                placeholder="Введите имя"
              />
            </div>
            
            <div className="form-group">
                <label>Фамилия</label>
                <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
                        handleInputChange('lastName', value);
                    }}
                    placeholder="Введите фамилию"
                />
            </div>
            
            <div className="form-group">
              <label>Группа</label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        handleInputChange('group', value);
                    }}
                placeholder="Введите группу"
              />
            </div>
            
            <button 
              className="link-btn"
              onClick={() => {
                setScreen('teacher')
              }}
            >
              Вы преподаватель?
            </button>
          </div>
          
          <button 
            className={`next-btn show ${!isStudentFormValid() ? 'disabled' : ''}`}
            onClick={handleEnd}
            disabled={!isStudentFormValid()}
          >
            <h3>Готово</h3>
          </button>
          
        </div>
        <div className="gradient"></div>
      </div>
    )
  }
  
  if (screen === 'teacher') {
    return (
      <div className="container">
        <div className="panel">
          <div className="form-container">
            <h2 className="form-title">Регистрация преподавателя</h2>
            
            <div className="form-group">
              <label>Имя</label>
              <input
                type="text"
                value={formData.firstName}
                
                onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
                        handleInputChange('firstName', value);
                    }}
                placeholder="Введите имя"
              />
            </div>
            
            <div className="form-group">
              <label>Фамилия</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
                        handleInputChange('lastName', value);
                    }}
                placeholder="Введите фамилию"
              />
            </div>
            
            <div className="form-group">
              <label>Отчество</label>
              <input
                type="text"
                value={formData.thirdName}
                onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
                        handleInputChange('thirdName', value);
                    }}
                placeholder="Введите отчество"
              />
            </div>
            
            <div className="form-group">
              <label>Предмет</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
                        handleInputChange('subject', value);
                    }}
                placeholder="Введите предмет"
              />
            </div>
            
            <button 
              className="link-btn"
              onClick={() => {
                setScreen('student')
              }}
            >
              Вы студент?
            </button>
          </div>
          
          <button 
            className={`next-btn show ${!isTeacherFormValid() ? 'disabled' : ''}`}
            onClick={handleEnd}
            disabled={!isTeacherFormValid()}
          >
            <h3>Готово</h3>
          </button>
          
        </div>
        <div className="gradient"></div>
      </div>
    )
  }
}