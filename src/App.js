import { useState } from 'react';
import './App.css';

import arrowIcon from './assets/images/icon-arrow.svg';
import { monthsAndDays } from './constants';
import {isLeapYear} from './functions'

export default function App() {

  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: ''
  })

  const [formErrors, setFormError] = useState({
    day: '',
    month: '',
    year: '',
    generic: ''
  })

  const [output, setOutput] = useState({
    days: '',
    months: '',
    years: ''
  })

  const hasErrors = formErrors.day || formErrors.month || formErrors.year || formErrors.generic

  const dateDiff = (date) => {
    date = date.split('-')
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const yy = parseInt(date[0])
    const mm = parseInt(date[1])
    const dd = parseInt(date[2])
    let years, months, days

    months = month - mm
    if(day < dd) {
      months = months - 1 
    }

    years = year - yy
    if(month * 100 + day < mm * 100 + dd) {
      years = years - 1
      months = months + 12
    }

    days = Math.floor(
      (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
        (24 * 60 * 60 * 1000)
    )
    return {years: years, months: months, days: days}
  }

  const handleSubmit = (day, month, year) => {
    const dayAsNumber = Number(day)
    const monthAsNumber = Number(month)
    const yearAsNumber = Number(year)

    const today = new Date()
    const chosenDate = new Date(year, month -1, day)

    const currentMonth = monthsAndDays.find((item) => item.month === monthAsNumber)
    const validateDaysForFebruary = () => {
      if (monthAsNumber === 2) {
        let maxDays;

        if (isLeapYear(yearAsNumber)) {
          maxDays = currentMonth?.days?.leap
        } else {
          maxDays = currentMonth?.days?.common
        }

        if (dayAsNumber <= maxDays) {
          return true 
        } else {
          return false
        }
      }
      return false
    }

    const isDayInputValid = dayAsNumber >= 1 && 
      ((monthAsNumber !== 2 && dayAsNumber <= (currentMonth?.days || 31)) || 
        validateDaysForFebruary())

        const isMonthInputValid = monthAsNumber >= 1 && monthAsNumber <= 12

        const isYearInputValid = yearAsNumber >= 1 && yearAsNumber <= today.getFullYear()

        const isPastDate = today - chosenDate < 0

        if (!day) {
          setFormError((prevState) => ({
            ...prevState, 
            day: "This field is required",
            month: formErrors.month && isMonthInputValid ? "" : prevState.month,
            year: formErrors.year && isYearInputValid ? "" : prevState.year
          }))
        }

        if (!month) {
          setFormError((prevState) => ({
            ...prevState, 
            day: formErrors.day && isDayInputValid ? "" : prevState.day,
            month: "This field is required",
            year: formErrors.year && isYearInputValid ? "" : prevState.year
          }))
        }

        if (!year) {
          setFormError((prevState) => ({
            ...prevState, 
            day: formErrors.day && isDayInputValid ? "" : prevState.day,
            month: formErrors.month && isMonthInputValid ? "" : prevState.month,
            year: "This field is required"
          }))
        }

        const isPrecheckValid = isDayInputValid && isMonthInputValid && isYearInputValid
        
        if (!isPrecheckValid) {
          if (day && !isDayInputValid) {
              setFormError((prevState) => ({
                ...prevState, 
                day:  "Must be a valid day",
                month: formErrors.month && isMonthInputValid ? "" : prevState.month,
                year: formErrors.year && isYearInputValid ? "" : prevState.year,
                generic: ""
              }))
          }

          if (month && !isMonthInputValid) {
              setFormError((prevState) => ({
                ...prevState, 
                day: formErrors.day && isDayInputValid ? "" : prevState.day,
                month: "Must be a valid month",
                year: formErrors.year && isYearInputValid ? "" : prevState.year,
                generic: ""
              }))
            }

            if (year && !isYearInputValid) {
              setFormError((prevState) => ({
                ...prevState, 
                day: formErrors.day && isDayInputValid ? "" : prevState.day,
                month: formErrors.month && isMonthInputValid ? "" : prevState.month,
                year: "Must be a valid year",
                generic: ""
              }))
            }
          } else if (isPrecheckValid && isPastDate) {
              setFormError(() => ({                
                day: "",
                month: "",
                year: "",
                generic: "Must be a date in the past"
            }))
        } else {
          if (hasErrors) {
            setFormError ({
              day: "",
              month: "",
              year: "",
              generic: ""
            })        
          }
            const formattedDate = `${year}-${month}-${day}`
            const {years, months, days} = dateDiff(formattedDate)

            setOutput({
              days: days,
              months: months,
              years: years
            })
      }
    }

  return (
    <div className="card-container">
      <div className="input-container">

        <div className="input-label-container">
          <label htmlFor="day" style={{
            color: hasErrors ? 'var(--primary-color-light_red)' : 'var(--bg-neutral-smokey_grey)'
          }}>day</label>
          <input 
            id='day' 
            placeholder='DD' 
            min={1} 
            style={{
              border: hasErrors 
              ? '1px solid var(--primary-color-light_red)' 
              : '1px solid var(--bg-neutral-off_white)'
            }}
            value={formData.day} 
            onChange={(e) => setFormData((prevState) => ({...prevState, day: e.target.value}))} 
          />
          {formErrors.day && <p className="error">{formErrors.day}</p>}
        </div>

        <div className="input-label-container">
          <label htmlFor="month" style={{
            color: hasErrors ? 'var(--primary-color-light_red)' : 'var(--bg-neutral-smokey_grey)'
          }}>month</label>
          <input  
            id='month' 
            placeholder='MM' 
            min={1} 
            style={{
              border: hasErrors 
              ? '1px solid var(--primary-color-light_red)' 
              : '1px solid var(--bg-neutral-off_white)'
            }}
            value={formData.month} 
            onChange={(e) => setFormData((prevState) => ({...prevState, month: e.target.value}))} 
          />
          {formErrors.month && <p className="error">{formErrors.month}</p>}
        </div>

        <div className="input-label-container">
          <label htmlFor="year" style={{
            color: hasErrors ? 'var(--primary-color-light_red)' : 'var(--bg-neutral-smokey_grey)'
          }}>year</label>
          <input  
            id='year' 
            placeholder='YYYY' 
            min={1} 
            style={{
              border: hasErrors 
              ? '1px solid var(--primary-color-light_red)' 
              : '1px solid var(--bg-neutral-off_white)'
            }}
            value={formData.year} 
            onChange={(e) => setFormData((prevState) => ({...prevState, year: e.target.value}))} 
          />
          {formErrors.year && <p className="error">{formErrors.year}</p>}
        </div>
      </div>
      {formErrors.generic && (
        <p className='error generic'>{formErrors.generic}</p>
      )}

      <div className="divider-container">
        <div className="divider"></div>
        
        <button className='btn' onClick={() => handleSubmit(formData.day, formData.month, formData.year)}>
          <img src={arrowIcon} alt="arrowIcon" />
        </button>
      </div>

      <div className="output-container">
        <h1>
          <span className="highlighted">
            {output.years === '' ? '--' : output.years}
          </span>
          {output.years === 1 ? 'year' : 'years'}
        </h1>

        <h1>
          <span className="highlighted">
            {output.months === '' ? '--' : output.months}
          </span>
          {output.months === 1 ? 'month' : 'months'}
        </h1>

        <h1>
          <span className="highlighted">
            {output.days === '' ? '--' : output.days}
          </span>
          {output.days === 1 ? 'day' : 'days'}
        </h1>
      </div>
    </div>
    );
  }