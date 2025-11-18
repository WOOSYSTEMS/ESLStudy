import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  MessageSquare,
  Share2,
  Settings,
  Grid,
  Maximize,
  Volume2,
  Hand,
  Monitor,
  PenTool,
  Send
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isAudioOn: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  role: 'teacher' | 'student';
}

const VideoConference: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'gallery' | 'speaker'>('speaker');
  const [handRaised, setHandRaised] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [participants] = useState<Participant[]>([]);

  const [chatMessages] = useState<any[]>([]);

  const classInfo = {
    title: 'Video Conference',
    duration: '00:00',
    recordingStatus: 'Not Recording',
    participantCount: 0
  };

  useEffect(() => {
    if (isInCall) {
      // Request camera and microphone access
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Error accessing media devices:', err);
        });
    } else {
      // Clean up stream when leaving call
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    }
  }, [isInCall]);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  if (!isInCall) {
    return (
      <div className="video-conference">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Video Conference</h1>
          <p className="text-secondary">Join or schedule virtual classes</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
            <div className="space-y-3">
              <div className="text-center py-8">
                <p className="text-secondary">No scheduled classes</p>
                <p className="text-sm text-muted mt-2">Schedule a new class to get started</p>
              </div>
            </div>
          </div>

          {/* Class Settings */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
              <button className="btn btn-primary w-full mb-3">
                <Video size={16} />
                Start Instant Meeting
              </button>
              <button className="btn btn-secondary w-full">
                <Users size={16} />
                Schedule New Class
              </button>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Meeting Settings</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Start with video on</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Start with audio muted</span>
                  <input type="checkbox" className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Record sessions automatically</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Enable virtual backgrounds</span>
                  <input type="checkbox" className="toggle" />
                </label>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Recent Recordings</h2>
              <div className="text-center py-4">
                <p className="text-sm text-secondary">No recordings available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // In-call interface
  return (
    <div className="video-conference in-call">
      <div className="video-container">
        {/* Header */}
        <div className="video-header">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{classInfo.title}</h2>
            <span className="text-sm text-secondary">{classInfo.duration}</span>
            <span className="text-xs px-2 py-1 bg-error text-white rounded">
              {classInfo.recordingStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayoutMode(layoutMode === 'gallery' ? 'speaker' : 'gallery')}
              className="tool-btn"
            >
              <Grid size={18} />
            </button>
            <button className="tool-btn">
              <Maximize size={18} />
            </button>
            <button className="tool-btn">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="video-main">
          <div className="video-grid">
            {/* Local Video */}
            <div className="video-tile main-speaker">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
                style={{ transform: 'scaleX(-1)' }}
              />
              <div className="video-overlay">
                <span className="name-badge">You (Teacher)</span>
                {isMuted && <MicOff size={16} className="muted-indicator" />}
              </div>
            </div>

            {/* Participant Videos */}
            {participants.slice(1, layoutMode === 'speaker' ? 2 : 5).map(participant => (
              <div key={participant.id} className="video-tile">
                {participant.isVideoOn ? (
                  <div className="video-placeholder">
                    <Users size={32} className="text-muted" />
                  </div>
                ) : (
                  <div className="video-off">
                    <div className="w-16 h-16 rounded-full bg-surface border flex items-center justify-center text-xl font-medium">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                )}
                <div className="video-overlay">
                  <span className="name-badge">{participant.name}</span>
                  <div className="flex items-center gap-1">
                    {!participant.isAudioOn && <MicOff size={14} />}
                    {participant.isHandRaised && <Hand size={14} className="text-warning" />}
                    {participant.isSpeaking && <Volume2 size={14} className="text-success" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Bar */}
        <div className="video-controls">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleMute}
              className={`control-btn ${isMuted ? 'btn-danger' : ''}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`control-btn ${!isVideoOn ? 'btn-danger' : ''}`}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`control-btn ${isScreenSharing ? 'btn-active' : ''}`}
            >
              <Monitor size={20} />
            </button>
            <button className="control-btn">
              <PenTool size={20} />
            </button>
            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`control-btn ${handRaised ? 'btn-active' : ''}`}
            >
              <Hand size={20} />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`control-btn ${showChat ? 'btn-active' : ''}`}
            >
              <MessageSquare size={20} />
            </button>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`control-btn ${showParticipants ? 'btn-active' : ''}`}
            >
              <Users size={20} />
              <span className="participant-count">{classInfo.participantCount}</span>
            </button>
            <button
              onClick={() => setIsInCall(false)}
              className="control-btn btn-danger"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Side Panels */}
        {showParticipants && (
          <div className="side-panel participants-panel">
            <h3 className="panel-title">Participants ({participants.length})</h3>
            <div className="participant-list">
              {participants.map(participant => (
                <div key={participant.id} className="participant-item">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-surface border flex items-center justify-center text-xs font-medium">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{participant.name}</div>
                      <div className="text-xs text-muted">{participant.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.isHandRaised && <Hand size={14} className="text-warning" />}
                    {participant.isSpeaking && <Volume2 size={14} className="text-success" />}
                    {!participant.isAudioOn && <MicOff size={14} className="text-muted" />}
                    {!participant.isVideoOn && <VideoOff size={14} className="text-muted" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showChat && (
          <div className="side-panel chat-panel">
            <h3 className="panel-title">Chat</h3>
            <div className="chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className="chat-message">
                  <div className="flex items-start gap-2">
                    <span className={`text-xs font-medium ${msg.role === 'teacher' ? 'text-accent' : 'text-secondary'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-xs text-muted">{msg.time}</span>
                  </div>
                  <p className="text-sm mt-1">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                className="input"
              />
              <button className="btn btn-primary">
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConference;