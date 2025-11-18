import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
// @ts-ignore
import SimplePeer from 'simple-peer';

interface VideoRoomProps {
  language: 'en' | 'ko';
}

const VideoRoom: React.FC<VideoRoomProps> = ({ language }) => {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const translations = {
    en: {
      title: 'Video Practice Room',
      subtitle: 'Practice speaking with video and audio',
      enterRoomId: 'Enter Room ID',
      joinRoom: 'Join Room',
      leaveRoom: 'Leave Room',
      toggleAudio: 'Toggle Audio',
      toggleVideo: 'Toggle Video',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      download: 'Download Recording',
      localVideo: 'You',
      remoteVideo: 'Partner',
      waitingForPartner: 'Waiting for partner to join...',
      solo: 'Solo Practice Mode'
    },
    ko: {
      title: '비디오 연습실',
      subtitle: '비디오와 오디오로 말하기 연습',
      enterRoomId: '방 ID 입력',
      joinRoom: '방 참가',
      leaveRoom: '방 나가기',
      toggleAudio: '오디오 전환',
      toggleVideo: '비디오 전환',
      startRecording: '녹화 시작',
      stopRecording: '녹화 중지',
      download: '녹화 다운로드',
      localVideo: '나',
      remoteVideo: '파트너',
      waitingForPartner: '파트너 대기 중...',
      solo: '혼자 연습 모드'
    }
  };

  const t = translations[language];

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const joinRoomHandler = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socketRef.current = io('http://localhost:5001');
      const userId = Math.random().toString(36).substring(7);

      socketRef.current.emit('join-room', roomId || 'default-room', userId);

      socketRef.current.on('user-connected', (userId: string) => {
        const peer = createPeer(userId, stream);
        peerRef.current = peer;
      });

      socketRef.current.on('offer', handleReceiveCall);
      socketRef.current.on('answer', handleAnswer);
      socketRef.current.on('ice-candidate', handleNewICECandidateMsg);

      setJoined(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const createPeer = (userId: string, stream: MediaStream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (signal: any) => {
      socketRef.current.emit('offer', {
        userToSignal: userId,
        userId: socketRef.current.id,
        signal,
        roomId: roomId || 'default-room'
      });
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    return peer;
  };

  const handleReceiveCall = (data: any) => {
    if (!streamRef.current) return;

    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: streamRef.current
    });

    peer.on('signal', (signal: any) => {
      socketRef.current.emit('answer', {
        signal,
        to: data.userId,
        roomId: roomId || 'default-room'
      });
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.signal(data.signal);
    peerRef.current = peer;
  };

  const handleAnswer = (data: any) => {
    if (peerRef.current) {
      peerRef.current.signal(data.signal);
    }
  };

  const handleNewICECandidateMsg = (data: any) => {
    if (peerRef.current) {
      peerRef.current.signal(data.candidate);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedChunksRef.current.length === 0) return;

    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pronunciation-practice-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const leaveRoom = () => {
    cleanup();
    setJoined(false);
    setRoomId('');
  };

  return (
    <div className="video-room">
      <h2>{t.title}</h2>
      <p className="subtitle">{t.subtitle}</p>

      {!joined ? (
        <div className="join-form">
          <input
            type="text"
            placeholder={t.enterRoomId}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoomHandler}>{t.joinRoom}</button>
          <p className="hint">{t.solo}</p>
        </div>
      ) : (
        <div className="video-container">
          <div className="video-grid">
            <div className="video-wrapper">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="video-element"
              />
              <span className="video-label">{t.localVideo}</span>
            </div>
            <div className="video-wrapper">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="video-element"
              />
              <span className="video-label">{t.remoteVideo}</span>
            </div>
          </div>

          <div className="controls">
            <button
              onClick={toggleAudio}
              className={isAudioEnabled ? 'active' : 'inactive'}
            >
              {isAudioEnabled ? '🎤' : '🔇'} {t.toggleAudio}
            </button>
            <button
              onClick={toggleVideo}
              className={isVideoEnabled ? 'active' : 'inactive'}
            >
              {isVideoEnabled ? '📹' : '📷'} {t.toggleVideo}
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? 'recording' : ''}
            >
              {isRecording ? '⏹' : '⏺'} {isRecording ? t.stopRecording : t.startRecording}
            </button>
            {recordedChunksRef.current.length > 0 && (
              <button onClick={downloadRecording}>
                ⬇️ {t.download}
              </button>
            )}
            <button onClick={leaveRoom} className="leave-btn">
              {t.leaveRoom}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;
