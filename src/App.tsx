import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import './App.css'

interface Data {
  id: string,
  ctl: number,
  atl: number,
  rampRate: number,
  ctlLoad: number,
  atlLoad: number,
  // 他のフィールドを必要に応じて追加
}

function App() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initialDate = new Date()
  const [startDate, setStartDate] = useState(initialDate)
  const handleChange = (date: Date | null) => {
    if (date) {
      setStartDate(date)
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    const formattedDate = formatDate(startDate)

    try {
      const response = await fetch(`https://intervals.icu/api/v1/athlete/i20699/wellness/${formattedDate}`, {
        headers: {
          Authorization: "Basic " + btoa(`${import.meta.env.VITE_USERNAME}:${import.meta.env.VITE_API_KEY}`)
        }
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'データ取得に失敗しました')
        return
      }

      console.log(result) // レスポンスデータをログに出力
      setData(result) // レスポンスデータをセット
    } catch (error) {
      console.log(error)
      setError('データ取得中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className='text-5xl font-bold p-4'>Intervals API APP</h1>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        dateFormat="yyyy - MM - dd"
      />
      <div className='p-4'>
        <button className='rounded-md bg-blue-500 p-2 font-bold mb-4 hover:bg-blue-300 hover:border-2 transition-colors' onClick={fetchData} disabled={loading}>
          {loading ? 'ロード中...' : 'データ取得'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {data ? (
          <ul>
            <li>ID: {data.id}</li>
            <li>CTL: {data.ctl}</li>
            <li>ATL: {data.atl}</li>
            <li>Ramp Rate: {data.rampRate}</li>
            <li>CTL Load: {data.ctlLoad}</li>
            <li>ATL Load: {data.atlLoad}</li>
            {/* 必要に応じて他のフィールドも表示 */}
          </ul>
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export default App