export default function DynamicSample() {
  return (
    <div className="root-timeline">
      <div className="timeline">
        <div className="timeline-container timeline-right">
          <div className="timeline-content">
            <h2>2017</h2>
            <p>Lorem ipsum..</p>
          </div>
        </div>
        <div className="timeline-container timeline-right">
          <div className="timeline-content">
            <h2>2016</h2>
            <p>Lorem ipsum..</p>
          </div>
        </div>
      </div>
      <style>{`
        .root-timeline * {
          box-sizing: border-box;
        }

        body {
          background-color: #474e5d;
          font-family: Helvetica, sans-serif;
        }

        .timeline {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .timeline::after {
          content: '';
          position: absolute;
          width: 6px;
          background-color: white;
          top: 0;
          bottom: 0;
          left: 50%;
          margin-left: -3px;
        }

        .timeline-container {
          padding: 10px 40px;
          position: relative;
          background-color: inherit;
          width: 50%;
        }

        .timeline-container::after {
          content: '';
          position: absolute;
          width: 25px;
          height: 25px;
          right: -17px;
          background-color: black;
          border: 4px solid #FF9F55;
          top: 15px;
          border-radius: 50%;
          z-index: 1;
        }

        .timeline-left {
          left: 0;
        }

        .timeline-right {
          left: 50%;
        }

        .timeline-left::before {
          content: " ";
          height: 0;
          position: absolute;
          top: 22px;
          width: 0;
          z-index: 1;
          right: 30px;
          border: medium solid black;
          border-width: 10px 0 10px 10px;
          border-color: transparent transparent transparent black;
        }

        .timeline-right::before {
          content: " ";
          height: 0;
          position: absolute;
          top: 22px;
          width: 0;
          z-index: 1;
          left: 30px;
          border: medium solid black;
          border-width: 10px 10px 10px 0;
          border-color: transparent black transparent transparent;
        }

        .timeline-right::after {
          left: -16px;
        }

        .timeline-content {
          padding: 20px 30px;
          background-color: black;
          position: relative;
          border-radius: 6px;
        }

        @media screen and (max-width: 600px) {
          .timeline::after {
            left: 31px;
          }

          .timeline-container {
            width: 100%;
            padding-left: 70px;
            padding-right: 25px;
          }

          .timeline-container::before {
            left: 60px;
            border: medium solid white;
            border-width: 10px 10px 10px 0;
            border-color: transparent white transparent transparent;
          }

          .timeline-left::after, .right::after {
            left: 15px;
          }

          .timeline-right {
            left: 0%;
          }
        }
      `}</style>
    </div>
  );
}
