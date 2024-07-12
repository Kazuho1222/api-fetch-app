import { useState } from 'react'
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

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    console.log('VITE_USERNAME:', import.meta.env.VITE_USERNAME) // 環境変数の確認
    console.log('VITE_API_KEY:', import.meta.env.VITE_API_KEY)   // 環境変数の確認

    try {
      const response = await fetch('https://intervals.icu/api/v1/athlete/i20699/wellness/2024-07-12', {
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
      <h1>Intervals API APP</h1>
      <div>
        <button onClick={fetchData} disabled={loading}>
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
          <p>データがありません</p>
        )}
      </div>
    </>
  )
}

export default App