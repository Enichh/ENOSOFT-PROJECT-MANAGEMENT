import React from 'react';
import { useRecommendationsStore } from '../../stores/recommendationsStore';
import RecommendationCard from '../assignments/RecommendationCard';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface RecommendationsPanelProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onAcceptEmployee: (employeeId: string) => void;
}

export default function RecommendationsPanel({
  projectId,
  projectName,
  isOpen,
  onClose,
  onAcceptEmployee,
}: RecommendationsPanelProps) {
  const { currentRecommendations, isLoading, error, fetchRecommendations, acceptRecommendation } =
    useRecommendationsStore();

  React.useEffect(() => {
    if (isOpen && currentRecommendations.length === 0) {
      fetchRecommendations(projectId);
    }
  }, [isOpen, projectId, currentRecommendations.length, fetchRecommendations]);

  const handleAccept = (employeeId: string) => {
    acceptRecommendation(employeeId);
    onAcceptEmployee(employeeId);
  };

  const handleReject = (employeeId: string) => {
    acceptRecommendation(employeeId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`AI Recommendations - ${projectName}`}>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Analyzing project requirements...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchRecommendations(projectId)} variant="secondary">
              Retry
            </Button>
          </div>
        ) : currentRecommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recommendations available</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.employeeId}
                  recommendation={recommendation}
                  onAccept={() => handleAccept(recommendation.employeeId)}
                  onReject={() => handleReject(recommendation.employeeId)}
                  isAccepted={false}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button onClick={onClose} variant="secondary">
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
