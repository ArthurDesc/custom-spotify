import React, { useState } from 'react';
import { MusicPlayerCard } from './MusicPlayerCard';
import { MusicDetailModal } from './MusicDetailModal';
import { Track, PlaybackState } from '../types/spotify';

interface MusicPlayerWithModalProps {
  currentTrack?: Track | null;
  playbackState?: PlaybackState | null;
  onPlaylistPress: () => void;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
  isInLayout?: boolean;
  playbackMethod?: string;
}

export const MusicPlayerWithModal: React.FC<MusicPlayerWithModalProps> = ({
  currentTrack,
  playbackState,
  onPlaylistPress,
  onPause,
  onResume,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onVolumeChange,
  isInLayout = false,
  playbackMethod,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleTrackPress = () => {
    if (currentTrack) {
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handlePlayPause = () => {
    if (playbackState?.is_playing) {
      onPause();
    } else {
      onResume();
    }
  };

  return (
    <>
      <MusicPlayerCard
        currentTrack={currentTrack}
        playbackState={playbackState}
        onPlaylistPress={onPlaylistPress}
        onPause={onPause}
        onResume={onResume}
        onNext={onNext}
        onPrevious={onPrevious}
        onToggleShuffle={onToggleShuffle}
        onTrackPress={handleTrackPress}
        isInLayout={isInLayout}
        playbackMethod={playbackMethod}
      />
      
      <MusicDetailModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        currentTrack={currentTrack}
        playbackState={playbackState}
        onPlayPause={handlePlayPause}
        onNext={onNext}
        onPrevious={onPrevious}
        onToggleShuffle={onToggleShuffle}
        onToggleRepeat={onToggleRepeat}
        onSeek={onSeek}
        onVolumeChange={onVolumeChange}
      />
    </>
  );
}; 