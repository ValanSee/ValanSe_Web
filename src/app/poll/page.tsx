// 투표페이지
import PollCard from '../../components/pages/poll/pollCard'
import PreviewCommentCard from '../../components/pages/poll/Comment/previewCommentCard'
// todo: mock
const mockComment = {
  username: 'dinopark47',
  time: '8시간 전',
  content: '솔직히 요즘 점심에 돈 쓰기 아까움 회사 돈으로 점심먹으면 개꿀이지',
  commentsNumber: 123,
}

function Poll() {
  return (
    <div>
      <PollCard />
      <PreviewCommentCard {...mockComment} />
    </div>
  )
}
export default Poll
