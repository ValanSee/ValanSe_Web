import { useState } from 'react';

const ageOptions = ['10대', '20대', '30대', '40대']
const genderOptions = ['여성', '남성']

const OnBoarding = () => {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  // const [mbti, setMbti] = useState('');

  const handleSubmit = () => {
    console.log('Nickname:', nickname);
    console.log('Gender:', gender);
    console.log('Age:', age);
    // console.log('MBTI:', mbti);

    // TODO: 유효성 검사 && API 호출
  };

  return (
    <div className="px-6 py-10">
      <h1 className="text-xl font-bold mb-9 mt-10">이것만 작성해주세요!</h1>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력해주세요"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">성별</label>
        <div className="flex gap-4">
          {genderOptions.map((option) => (
            <button
              key={option}
              onClick={() => setGender(option)}
              className={`flex-1 border border-gray-300 py-2 rounded-md`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">나이</label>
        <div className="flex gap-2">
          {ageOptions.map((option) => (
            <button
              key={option}
              onClick={() => setAge(option)}
              className={`flex-1 border border-gray-300 py-2 rounded-md`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">MBTI</label>
        <div className="text-sm border border-gray-300 px-4 py-3 rounded-md">
          MBTI를 알려주세요
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-md border border-gray-300 mt-8">
        완료
      </button>
    </div>
  )
}

export default OnBoarding
