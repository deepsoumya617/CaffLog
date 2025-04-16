export default function Hero() {
  return (
    <>
      <h1>CaffLog — Your Daily Caffeine Journal!</h1>
      <div className="benefits-list">
        <h3 className="font-bolder">
          Try <span className="text-gradient">CaffLog</span> and start....
        </h3>
        <p>✅ Logging every cup you grab</p>
        <p>✅ Tracking when the jitters hit</p>
        <p>✅ Watching your caffeine rise</p>
      </div>
      <div className="card info-card">
        <div>
          <i className="fa-solid fa-circle-info"></i>
          <h3>Did you know...</h3>
        </div>
        <h5>That caffeine&apos;s half-life is about 5 hours?</h5>
        <p>
          This means that after 5 hours, half the caffeine you consumed is still
          in your system, keeping you alert longer! So if you drink a cup of
          coffee with 200 mg of caffeine, 5 hours, later, you&apos;ll still have
          about 100 mg of caffeine in your system.
        </p>
      </div>
    </>
  )
}
