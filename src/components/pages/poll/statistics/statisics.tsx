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
  fetchGenderStatistics,
  AgeStatisticsResponse,
  MBTIStatisticsResponse,
  GenderStatisticsResponse,
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
  const [chartType, setChartType] = useState<'gender' | 'age' | 'mbti'>(
    'gender',
  )
  const [activeTab, setActiveTab] = useState<string>('A')
  const [pieData, setPieData] = useState<ChartData<'pie'> | null>(null)
  const [barData, setBarData] = useState<ChartData<'bar'> | null>(null)
  const [availableOptions, setAvailableOptions] = useState<string[]>([])

  // 성별 차트 데이터 패칭
  useEffect(() => {
    if (chartType === 'gender') {
      const fetchData = async () => {
        const gender = activeTab === 'A' ? 'male' : 'female'
        const res: GenderStatisticsResponse = await fetchGenderStatistics(
          voteId,
          gender,
        )

        // 사용 가능한 옵션들 설정 (A, B, C, D 등)
        const options = res.options.map((_, index) =>
          String.fromCharCode(65 + index),
        ) // A, B, C, D...
        setAvailableOptions(options)

        // 첫 번째 옵션을 기본값으로 설정
        if (options.length > 0 && !options.includes(activeTab)) {
          setActiveTab(options[0])
        }

        // 동적 색상 생성 (2-4개 옵션에 맞는 색상)
        const colors = ['#6C8BA7', '#F28C4A', '#10B981', '#8B5CF6']

        setPieData({
          labels: res.options.map((option) => option.content),
          datasets: [
            {
              data: res.options.map(
                (option) => Math.round(option.ratio * 10) / 10,
              ),
              backgroundColor: colors.slice(0, res.options.length),
              borderWidth: 0,
            },
          ],
        })
      }
      fetchData()
    }
  }, [voteId, chartType, activeTab])

  // 연령별 차트 데이터 패칭
  useEffect(() => {
    if (chartType === 'age') {
      const fetchData = async () => {
        const res: AgeStatisticsResponse = await fetchAgeStatistics(voteId)

        // 사용 가능한 옵션들 설정 (A, B, C, D 등)
        const options = Object.keys(res.ageRatios)
        setAvailableOptions(options)

        // 첫 번째 옵션을 기본값으로 설정
        if (options.length > 0 && !options.includes(activeTab)) {
          setActiveTab(options[0])
        }

        const selectedKey = activeTab
        const ageGroups = res.ageRatios[selectedKey]?.ageGroups || {}

        // 나이대 순서 정렬 (10대, 20대, 30대, 40대 이상)
        const ageOrder = ['10대', '20대', '30대', '40대 이상']
        const sortedAgeGroups = ageOrder
          .filter((age) => ageGroups[age])
          .map((age) => ({
            label: age,
            content: ageGroups[age].content,
            voteCount: ageGroups[age].voteCount,
            ratio: ageGroups[age].ratio,
          }))

        // A/B 옵션에 따라 색상 결정
        const isOptionA = selectedKey === 'A'
        const colors = isOptionA
          ? ['#6C8BA7', '#A1B2C3', '#B8C5D1', '#D1DCE6'] // A는 푸른색 계열
          : ['#F28C4A', '#FFB366', '#FFC085', '#FFD1A3'] // B는 주황색 계열

        setPieData({
          labels: sortedAgeGroups.map((g) => g.label),
          datasets: [
            {
              data: sortedAgeGroups.map((g) => Math.round(g.ratio * 10) / 10),
              backgroundColor: colors.slice(0, sortedAgeGroups.length),
              borderWidth: 0,
            },
          ],
        })
      }
      fetchData()
    }
  }, [voteId, chartType, activeTab])

  // MBTI 차트 데이터 패칭
  useEffect(() => {
    if (chartType === 'mbti') {
      const fetchData = async () => {
        const mbtiType = activeTab === 'A' ? 'ie' : 'tf'
        const res: MBTIStatisticsResponse = await fetchMBTIStatistics(
          voteId,
          mbtiType,
        )

        // API 응답 구조에 맞게 데이터 처리
        const firstKey = Object.keys(res.mbti_ratios)[0] // E 또는 T
        const secondKey = Object.keys(res.mbti_ratios)[1] // I 또는 F

        const firstData = res.mbti_ratios[firstKey] || []
        const secondData = res.mbti_ratios[secondKey] || []

        // 투표 옵션들 (소개팅 앱, 지인 소개 등)
        const options = firstData.map((item) => item.content)

        // 각 투표 옵션별로 E/I 또는 T/F 성향의 비율을 데이터셋으로 구성
        const datasets = options.map((option, index) => {
          const firstRatio =
            firstData.find((item) => item.content === option)?.ratio || 0
          const secondRatio =
            secondData.find((item) => item.content === option)?.ratio || 0

          return {
            label: option,
            data: [
              Math.round(firstRatio * 10) / 10,
              Math.round(secondRatio * 10) / 10,
            ],
            backgroundColor: index === 0 ? '#6C8BA7' : '#F28C4A',
            borderRadius: 4,
          }
        })

        setBarData({
          labels: [firstKey, secondKey], // E, I 또는 T, F
          datasets: datasets,
        })
      }
      fetchData()
    }
  }, [voteId, chartType, activeTab])

  // 커스텀 플러그인: 파이 차트 위에 퍼센테이지 표시
  const pieCustomPlugin = {
    id: 'piePercentage',
    afterDraw: (chart: ChartJS) => {
      const ctx = chart.ctx
      const centerX =
        chart.chartArea.left +
        (chart.chartArea.right - chart.chartArea.left) / 2
      const centerY =
        chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        chart.getDatasetMeta(datasetIndex).data.forEach((arc, index) => {
          const data = dataset.data[index]
          const arcElement = arc as unknown as {
            startAngle: number
            endAngle: number
            outerRadius: number
          }
          const angle =
            arcElement.startAngle +
            (arcElement.endAngle - arcElement.startAngle) / 2
          const radius = arcElement.outerRadius * 0.7

          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          ctx.save()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = 'bold 14px Arial'
          ctx.fillStyle = '#FFFFFF'
          ctx.fillText(`${data}%`, x, y)
          ctx.restore()
        })
      })
    },
  }

  // 커스텀 플러그인: Bar 차트 위에 퍼센테이지 표시
  const barCustomPlugin = {
    id: 'barPercentage',
    afterDraw: (chart: ChartJS) => {
      const ctx = chart.ctx
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        chart.getDatasetMeta(datasetIndex).data.forEach((bar, index) => {
          const data = dataset.data[index]
          const x = bar.x
          const y = bar.y - 10 // 바 위에 약간 띄워서 표시

          ctx.save()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'
          ctx.font = '12px Arial'
          ctx.fillStyle = '#333'
          ctx.fillText(`${data}%`, x, y)
          ctx.restore()
        })
      })
    },
  }

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
        <div className="bg-white rounded-xl shadow p-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gender"
                checked={chartType === 'gender'}
                onCheckedChange={() => setChartType('gender')}
                className="w-5 h-5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <label htmlFor="gender" className="font-semibold">
                남자/여자 투표 결과 보기
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="age"
                checked={chartType === 'age'}
                onCheckedChange={() => setChartType('age')}
                className="w-5 h-5 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <label htmlFor="age" className="font-semibold">
                나이대별 투표 결과 보기
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mbti"
                checked={chartType === 'mbti'}
                onCheckedChange={() => setChartType('mbti')}
                className="w-5 h-5 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <label htmlFor="mbti" className="font-semibold">
                MBTI별 투표 결과 보기
              </label>
            </div>
          </div>

          {/* 그래프 렌더링 */}
          {chartType === 'gender' && pieData && (
            <>
              <Pie data={pieData} plugins={[pieCustomPlugin]} />
              <div className="flex justify-center space-x-4 mt-4">
                {availableOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveTab(option)}
                    className={`px-4 py-1 rounded-full text-sm border ${
                      activeTab === option
                        ? 'bg-[#6C8BA7] text-white border-[#6C8BA7]'
                        : 'bg-white text-gray-600 border-[#B0B0B0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          {chartType === 'age' && pieData && (
            <>
              <Pie data={pieData} plugins={[pieCustomPlugin]} />
              <div className="flex justify-center space-x-4 mt-4">
                {availableOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveTab(option)}
                    className={`px-4 py-1 rounded-full text-sm border ${
                      activeTab === option
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          {chartType === 'mbti' && barData && (
            <>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      enabled: false,
                    },
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function (value) {
                          return value + '%'
                        },
                      },
                      grid: {
                        display: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
                plugins={[barCustomPlugin]}
              />
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setActiveTab('A')}
                  className={`px-4 py-1 rounded-full text-sm border ${
                    activeTab === 'A'
                      ? 'bg-[#6C8BA7] text-white border-[#6C8BA7]'
                      : 'bg-white text-gray-600 border-[#B0B0B0]'
                  }`}
                >
                  E/I
                </button>
                <button
                  onClick={() => setActiveTab('B')}
                  className={`px-4 py-1 rounded-full text-sm border ${
                    activeTab === 'B'
                      ? 'bg-[#F28C4A] text-white border-[#F28C4A]'
                      : 'bg-white text-gray-600 border-[#B0B0B0]'
                  }`}
                >
                  T/F
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
