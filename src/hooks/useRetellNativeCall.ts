// import { useEffect, useRef } from 'react';
// import {
//     AudioSession,
//     AndroidAudioTypePresets,
// } from '@livekit/react-native';
// import {
//     Room,
//     RoomEvent,
//     Track,
//     type RemoteAudioTrack,
//     type RemoteParticipant,
//     type RemoteTrack,
//     type RemoteTrackPublication,
// } from 'livekit-client';

// const RETELL_LIVEKIT_URL = 'wss://retell-ai-4ihahnq7.livekit.cloud';
// const decoder = new TextDecoder();

// export type RetellTranscriptLine = {
//     role: 'user' | 'assistant';
//     text: string;
// };

// type RetellTranscriptUtterance = {
//     role?: string;
//     content?: string;
// };

// function parseRetellTranscript(transcript: unknown): RetellTranscriptLine[] {
//     if (typeof transcript === 'string') {
//         const text = transcript.trim();
//         return text ? [{ role: 'assistant', text }] : [];
//     }

//     if (!Array.isArray(transcript)) return [];

//     return transcript
//         .map((item) => {
//             if (typeof item === 'string') {
//                 const text = item.trim();
//                 return text ? { role: 'assistant' as const, text } : null;
//             }
//             if (!item || typeof item !== 'object') return null;

//             const row = item as RetellTranscriptUtterance;
//             const text = String(row.content ?? '').trim();
//             if (!text) return null;

//             return {
//                 role: row.role === 'user' ? ('user' as const) : ('assistant' as const),
//                 text,
//             };
//         })
//         .filter((line): line is RetellTranscriptLine => line !== null);
// }

// export type RetellNativeCallCallbacks = {
//     onCallStarted?: () => void;
//     onCallEnded?: () => void;
//     onCallReady?: () => void;
//     onTranscriptUpdate?: (lines: RetellTranscriptLine[]) => void;
//     onAgentSpeaking?: (speaking: boolean) => void;
//     onError?: (message: string) => void;
// };

// export function useRetellNativeCall(
//     accessToken: string | undefined,
//     callbacks: RetellNativeCallCallbacks,
// ) {
//     const roomRef = useRef<Room | null>(null);
//     const connectedRef = useRef(false);
//     const callbacksRef = useRef(callbacks);
//     callbacksRef.current = callbacks;

//     useEffect(() => {
//         if (!accessToken) return;

//         let cancelled = false;
//         const room = new Room({
//             audioCaptureDefaults: {
//                 autoGainControl: true,
//                 echoCancellation: true,
//                 noiseSuppression: true,
//                 channelCount: 1,
//             },
//         });
//         roomRef.current = room;

//         const cleanup = async () => {
//             connectedRef.current = false;
//             try {
//                 room.disconnect();
//             } catch {
//                 // ignore
//             }
//             roomRef.current = null;
//             await AudioSession.stopAudioSession();
//         };

//         const onDisconnected = () => {
//             if (!connectedRef.current) return;
//             connectedRef.current = false;
//             callbacksRef.current.onCallEnded?.();
//             void cleanup();
//         };

//         const onDataReceived = (
//             payload: Uint8Array,
//             participant?: RemoteParticipant,
//         ) => {
//             try {
//                 if (participant?.identity !== 'server') return;
//                 const event = JSON.parse(decoder.decode(payload)) as {
//                     event_type?: string;
//                     transcript?: unknown;
//                 };

//                 if (event.event_type === 'update' && event.transcript) {
//                     const lines = parseRetellTranscript(event.transcript);
//                     if (lines.length) {
//                         callbacksRef.current.onTranscriptUpdate?.(lines);
//                     }
//                 } else if (event.event_type === 'agent_start_talking') {
//                     callbacksRef.current.onAgentSpeaking?.(true);
//                 } else if (event.event_type === 'agent_stop_talking') {
//                     callbacksRef.current.onAgentSpeaking?.(false);
//                 }
//             } catch {
//                 // ignore malformed packets
//             }
//         };

//         const onTrackSubscribed = (
//             track: RemoteTrack,
//             publication: RemoteTrackPublication,
//             _participant: RemoteParticipant,
//         ) => {
//             if (
//                 track.kind === Track.Kind.Audio &&
//                 publication.trackName === 'agent_audio'
//             ) {
//                 callbacksRef.current.onCallReady?.();
//                 (track as RemoteAudioTrack).attach();
//             }
//         };

//         room.on(RoomEvent.Disconnected, onDisconnected);
//         room.on(RoomEvent.DataReceived, onDataReceived);
//         room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);

//         const connect = async () => {
//             try {
//                 await AudioSession.configureAudio({
//                     android: {
//                         audioTypeOptions: AndroidAudioTypePresets.communication,
//                     },
//                 });
//                 await AudioSession.startAudioSession();

//                 await room.connect(RETELL_LIVEKIT_URL, accessToken);
//                 if (cancelled) return;

//                 await room.localParticipant.setMicrophoneEnabled(true);
//                 connectedRef.current = true;
//                 callbacksRef.current.onCallStarted?.();
//             } catch (err) {
//                 if (!cancelled) {
//                     const message = err instanceof Error ? err.message : 'Native call failed';
//                     callbacksRef.current.onError?.(message);
//                 }
//                 await cleanup();
//             }
//         };

//         void connect();

//         return () => {
//             cancelled = true;
//             void cleanup();
//         };
//     }, [accessToken]);

//     const stopCall = () => {
//         const room = roomRef.current;
//         if (!room) return;
//         connectedRef.current = false;
//         callbacksRef.current.onCallEnded?.();
//         void room.disconnect();
//     };

//     return { stopCall };
// }



import { useEffect, useRef } from 'react';
import {
  AudioSession,
  AndroidAudioTypePresets,
} from '@livekit/react-native';
import {
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
} from 'livekit-client';

const RETELL_LIVEKIT_URL =
  'wss://retell-ai-4ihahnq7.livekit.cloud';

const decoder = new TextDecoder();

export type RetellTranscriptLine = {
  role: 'user' | 'assistant';
  text: string;
};

type RetellTranscriptUtterance = {
  role?: string;
  content?: string;
};

function parseRetellTranscript(
  transcript: unknown,
): RetellTranscriptLine[] {
  if (typeof transcript === 'string') {
    const text = transcript.trim();

    return text
      ? [{ role: 'assistant', text }]
      : [];
  }

  if (!Array.isArray(transcript)) {
    return [];
  }

  return transcript
    .map((item) => {
      if (typeof item === 'string') {
        const text = item.trim();

        return text
          ? {
              role: 'assistant' as const,
              text,
            }
          : null;
      }

      if (!item || typeof item !== 'object') {
        return null;
      }

      const row = item as RetellTranscriptUtterance;

      const text = String(row.content ?? '').trim();

      if (!text) {
        return null;
      }

      return {
        role:
          row.role === 'user'
            ? ('user' as const)
            : ('assistant' as const),
        text,
      };
    })
    .filter(
      (line): line is RetellTranscriptLine =>
        line !== null,
    );
}

export type RetellNativeCallCallbacks = {
  onCallStarted?: () => void;
  onCallEnded?: () => void;
  onCallReady?: () => void;
  onTranscriptUpdate?: (
    lines: RetellTranscriptLine[],
  ) => void;
  onAgentSpeaking?: (speaking: boolean) => void;
  onError?: (message: string) => void;
};

export function useRetellNativeCall(
  accessToken: string | undefined,
  callbacks: RetellNativeCallCallbacks,
) {
  const roomRef = useRef<Room | null>(null);
  const connectedRef = useRef(false);

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    const room = new Room({
      audioCaptureDefaults: {
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
      },
    });

    roomRef.current = room;

    const cleanup = async () => {
      connectedRef.current = false;

      try {
        room.disconnect();
      } catch {
        // Ignore
      }

      roomRef.current = null;

      try {
        await AudioSession.stopAudioSession();
      } catch {
        // Ignore
      }
    };

    const onDisconnected = () => {
      if (!connectedRef.current) {
        return;
      }

      connectedRef.current = false;

      callbacksRef.current.onCallEnded?.();

      void cleanup();
    };

    const onDataReceived = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
    ) => {
      try {
        if (participant?.identity !== 'server') {
          return;
        }

        const event = JSON.parse(
          decoder.decode(payload),
        ) as {
          event_type?: string;
          transcript?: unknown;
        };

        console.log(
          '[Retell] Event:',
          event.event_type,
        );

        if (
          event.event_type === 'update' &&
          event.transcript
        ) {
          const lines = parseRetellTranscript(
            event.transcript,
          );

          if (lines.length) {
            callbacksRef.current.onTranscriptUpdate?.(
              lines,
            );
          }
        } else if (
          event.event_type === 'agent_start_talking'
        ) {
          callbacksRef.current.onAgentSpeaking?.(
            true,
          );
        } else if (
          event.event_type === 'agent_stop_talking'
        ) {
          callbacksRef.current.onAgentSpeaking?.(
            false,
          );
        }
      } catch (error) {
        console.log(
          '[Retell] Data event parse error:',
          error,
        );
      }
    };

    const onTrackSubscribed = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      console.log(
        '[Retell] Track subscribed:',
        {
          kind: track.kind,
          trackName: publication.trackName,
          participant: participant.identity,
        },
      );

      if (
        track.kind === Track.Kind.Audio &&
        publication.trackName === 'agent_audio'
      ) {
        console.log(
          '[Retell] Agent audio track received',
        );

        // DO NOT USE:
        //
        // track.attach()
        //
        // React Native does not have browser `document`.
        // LiveKit React Native handles native audio.
        callbacksRef.current.onCallReady?.();
      }
    };

    room.on(
      RoomEvent.Disconnected,
      onDisconnected,
    );

    room.on(
      RoomEvent.DataReceived,
      onDataReceived,
    );

    room.on(
      RoomEvent.TrackSubscribed,
      onTrackSubscribed,
    );

    const connect = async () => {
      try {
        console.log(
          '[Retell] Configuring audio...',
        );

        await AudioSession.configureAudio({
          android: {
            audioTypeOptions:
              AndroidAudioTypePresets.communication,
          },
        });

        await AudioSession.startAudioSession();

        console.log(
          '[Retell] Connecting to LiveKit...',
        );

        await room.connect(
          RETELL_LIVEKIT_URL,
          accessToken,
        );

        if (cancelled) {
          return;
        }

        console.log(
          '[Retell] LiveKit connected',
        );

        await room.localParticipant.setMicrophoneEnabled(
          true,
        );

        console.log(
          '[Retell] Microphone enabled',
        );

        connectedRef.current = true;

        callbacksRef.current.onCallStarted?.();
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'Native call failed';

          console.log(
            '[Retell] Error:',
            message,
          );

          callbacksRef.current.onError?.(
            message,
          );
        }

        await cleanup();
      }
    };

    void connect();

    return () => {
      cancelled = true;

      void cleanup();
    };
  }, [accessToken]);

  const stopCall = () => {
    const room = roomRef.current;

    if (!room) {
      return;
    }

    connectedRef.current = false;

    callbacksRef.current.onCallEnded?.();

    void room.disconnect();
  };

  return {
    stopCall,
  };
}