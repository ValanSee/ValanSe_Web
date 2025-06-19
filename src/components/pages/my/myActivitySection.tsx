export default function MyActivitySection() {
    return (
      <section className="bg-white px-4 py-4 text-md">
        <h2 className="text-gray-400 h-10">내 활동</h2>
        <div className="flex flex-col gap-3">
          <div className="h-10 font-bold">내가 만든 밸런스 게임</div>
          <div className="h-10 font-bold">내가 투표한 밸런스 게임</div>
          <div className="h-10 font-bold">내가 작성한 댓글</div>
        </div>
      </section>
    );
  }
  