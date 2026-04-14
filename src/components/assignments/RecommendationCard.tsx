import React from 'react';
import { EmployeeRecommendation } from '../../types/models';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface RecommendationCardProps {
  recommendation: EmployeeRecommendation;
  onAccept: () => void;
  onReject: () => void;
  isAccepted?: boolean;
}

const getConfidenceVariant = (confidence: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    high: 'success',
    medium: 'warning',
    low: 'danger',
  };
  return variants[confidence] || 'default';
};

export default function RecommendationCard({ recommendation, onAccept, onReject, isAccepted }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const shouldTruncate = recommendation.reasoning.length > 200;

  const displayReasoning = shouldTruncate && !isExpanded
    ? `${recommendation.reasoning.substring(0, 200)}...`
    : recommendation.reasoning;

  return (
    <div className={`p-4 border rounded-lg transition-all ${isAccepted ? 'border-green-300 bg-green-50' : 'border-primary-200 bg-primary-50'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {isAccepted && (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <h4 className={`font-semibold ${isAccepted ? 'text-green-900' : 'text-gray-900'}`}>{recommendation.employeeName}</h4>
          <Badge variant={getConfidenceVariant(recommendation.confidence)} size="sm">
            {recommendation.confidence} confidence
          </Badge>
        </div>
        {!isAccepted && (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onReject}>
              Reject
            </Button>
            <Button size="sm" onClick={onAccept}>
              Accept
            </Button>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-2">{displayReasoning}</p>
      {shouldTruncate && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-xs text-primary-600 hover:text-primary-700"
        >
          Read more
        </button>
      )}

      {recommendation.skillMatch.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Matched Skills:</p>
          <div className="flex flex-wrap gap-1">
            {recommendation.skillMatch.map((skill) => (
              <span
                key={skill}
                className="inline-block px-2 py-0.5 bg-white text-gray-700 rounded text-xs border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
