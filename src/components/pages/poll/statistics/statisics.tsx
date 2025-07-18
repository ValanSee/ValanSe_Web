'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import {
  fetchAgeStatistics,
  fetchMBTIStatistics,
  AgeStatisticsResponse,
  MBTIStatisticsResponse,
} from '@/api/comment/statisticsApi'
import type { ChartData } from 'chart.js'
import { ChevronUp, ChevronDown } from 'lucide-react'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
)

interface VoteChartProps {
  voteId: number | string
  showStats: boolean
  setShowStatsAction: (v: boolean) => void
}

export default function VoteChart({
  voteId,
  showStats,
  setShowStatsAction,
}: VoteChartProps) {
  const [ageChartVisible, setAgeChartVisible] = useState(true)
  const [genderChartVisible, setGenderChartVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A')
  const [pieData, setPieData] = useState<ChartData<'pie'> | null>(null)
  const [barData, setBarData] = useState<ChartData<'bar'> | null>(null)

  // 연령별 차트 데이터 패칭
  useEffect(() => {
    if (!ageChartVisible) return
    const fetchData = async () => {
      // TODO: voteId 전달
      const res: AgeStatisticsResponse = await fetchAgeStatistics(1)
      const firstKey = Object.keys(res.ageRatios)[0]
      const ageGroups = res.ageRatios[firstKey]?.ageGroups || {}
      setPieData({
        labels: Object.values(ageGroups).map((g) => g.content),
        datasets: [
          {
            data: Object.values(ageGroups).map((g) => g.voteCount),
            backgroundColor: ['#a1b2c3', '#56789a', '#34567a', '#234567'],
          },
        ],
      })
    }
    fetchData()
  }, [voteId, ageChartVisible])

  // MBTI 차트 데이터 패칭
  useEffect(() => {
    if (ageChartVisible) return
    const fetchData = async () => {
      const mbtiType = activeTab === 'A' ? 'ie' : 'tf'
      // TODO: voteId 전달
      const res: MBTIStatisticsResponse = await fetchMBTIStatistics(1, mbtiType)
      const firstKey = Object.keys(res.mbti_ratios)[0]
      const mbtiArr = res.mbti_ratios[firstKey] || []
      setBarData({
        labels: mbtiArr.map((g) => g.content),
        datasets: [
          {
            label: mbtiType,
            data: mbtiArr.map((g) => g.vote_count),
            backgroundColor: mbtiType === 'ie' ? '#56789a' : '#f89e54',
          },
        ],
      })
    }
    fetchData()
  }, [voteId, ageChartVisible, activeTab])

  return (
    <div className="space-y-4 mt-4">
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-xl shadow  text-[#222] mb-2 transition hover:shadow-md border border-gray-100"
        onClick={() => setShowStatsAction(!showStats)}
      >
        <span>투표 결과 자세히 보기</span>
        {showStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {showStats && (
        <>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gender"
                checked={genderChartVisible}
                onCheckedChange={() => {
                  setGenderChartVisible(true)
                  setAgeChartVisible(false)
                }}
                className="w-5 h-5"
              />
              <label htmlFor="gender" className="font-semibold">
                남자/여자 투표 결과 보기
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="age"
                checked={ageChartVisible}
                onCheckedChange={() => {
                  setAgeChartVisible(true)
                  setGenderChartVisible(false)
                }}
                className="w-5 h-5"
              />
              <label htmlFor="age" className="font-semibold">
                나이대별 투표 결과 보기
              </label>
            </div>
          </div>

          {/* 그래프 렌더링 */}
          {ageChartVisible
            ? pieData && (
                <>
                  <Pie data={pieData} />
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={() => setActiveTab('A')}
                      className={`px-4 py-1 rounded-full text-sm border ${
                        activeTab === 'A'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setActiveTab('B')}
                      className={`px-4 py-1 rounded-full text-sm border ${
                        activeTab === 'B'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      B
                    </button>
                  </div>
                </>
              )
            : barData && (
                <>
                  <Bar data={barData} options={{ responsive: true }} />
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={() => setActiveTab('A')}
                      className={`px-4 py-1 rounded-full text-sm border ${
                        activeTab === 'A'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      E/I
                    </button>
                    <button
                      onClick={() => setActiveTab('B')}
                      className={`px-4 py-1 rounded-full text-sm border ${
                        activeTab === 'B'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      T/F
                    </button>
                  </div>
                </>
              )}
        </>
      )}
    </div>
  )
}
