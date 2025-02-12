'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [request, setRequest] = useState<{days?: string, city?: string}>({})
  let [culinary, setCulinary] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  async function hitAPI() {
    if (!request.city || !request.days) return
    setMessage('Building culinary...')
    setLoading(true)
    setCulinary('')

    setTimeout(() => {
      setMessage('Getting closer ...')
    }, 7000)

    setTimeout(() => {
      setMessage('Almost there ...')
    }, 15000)

    const response = await fetch('/api/get-culinary', {
      method: 'POST',
      body: JSON.stringify({
        days: request.days,
        city: request.city
      })
    })
    const json = await response.json()
    
    const response2 = await fetch('/api/get-points-of-interest', {
      method: 'POST',
      body: JSON.stringify({
        pointsOfInterestPrompt: json.pointsOfInterestPrompt,
      })
    })
    const json2 = await response2.json()

    let pointsOfInterest = JSON.parse(json2.pointsOfInterest)
    let culinary = json.culinary

    pointsOfInterest.map(point => {
      // culinary = culinary.replace(point, `<a target="_blank" rel="no-opener" href="https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)}">${point}</a>`)
      culinary = culinary.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)})`)
    })

    setCulinary(culinary)
    setLoading(false)
  }
  
  let days = culinary.split('Day')

  if (days.length > 1) {
    days.shift()
  } else {
    days[0] = "1" + days[0]
  }

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header}>Eatry</h1>
        <div style={styles.formContainer} className="form-container">
          <input style={styles.input}  placeholder="City" onChange={e => setRequest(request => ({
            ...request, city: e.target.value
          }))} />
          <input style={styles.input} placeholder="Days" onChange={e => setRequest(request => ({
            ...request, days: e.target.value
          }))} />
          <button className="input-button"  onClick={hitAPI}>Build Culinary</button>
        </div>
        <div className="results-container">
        {
          loading && (
            <p>{message}</p>
          )
        }
        {
          culinary && days.map((day, index) => (
            // <p
            //   key={index}
            //   style={{marginBottom: '20px'}}
            //   dangerouslySetInnerHTML={{__html: `Day ${day}`}}
            // />
            <div
              style={{marginBottom: '30px'}}
              key={index}
            >
              <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: props => {
                    return <a target="_blank" rel="no-opener" href={props.href}>{props.children}</a>
                }
            }}
              >
                {`Day ${day}`}
                </ReactMarkdown>
            </div>
          ))
        }

        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as 'center',
    marginTop: '60px',
    color: '#FF4500',
    fontWeight: '900',
    fontFamily: 'Poppins',
    fontSize: '68px'
  },
  input: {
    padding: '10px 14px',
    marginBottom: '4px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    borderRadius: '8px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '20px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(198, 131, 255, .2)',
    borderRadius: '10px'
  },
  result: {
    color: 'white'
  }
}
