import * as _ from 'lodash';

interface FeatureCardProps {
  title: string;
  link: string;
  color: string;
  textColor: string;
  icon: string;
}

function FeatureCard(props: FeatureCardProps) {
  const { title, color, textColor, icon } = props;

  return (
    <div className="card h-100 feature-card">
      <div className={`card-body d-flex align-items-center justify-content-center ${color} ${textColor}`}>
        <div>
          <i className="bi bi-menu"></i>
          <p className="card-text h3 text-center">
            <i className={`bi ${icon}`}></i> {title}
          </p>
        </div>
      </div>
      <style jsx>{`
        .feature-card {
          transition: filter 0.5s ease;
        }

        .feature-card:hover {
          filter: brightness(80%);
        }
      `}</style>
    </div>
  );
}

export default FeatureCard;
