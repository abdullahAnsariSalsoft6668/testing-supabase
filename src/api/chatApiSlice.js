import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

function formatChatTime(iso) {
  if (!iso) {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }
  return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

export function resolveParticipantId(p) {
  if (p == null || p === '') {
    return '';
  }
  if (typeof p === 'object' && (p._id != null || p.id != null)) {
    return String(p._id ?? p.id).trim();
  }
  return String(p).trim();
}

export function mapChatMessageToRow(msg, myUserId) {
  const sid = resolveParticipantId(msg?.sender_id ?? msg?.senderId);
  const myId = String(myUserId ?? '').trim();
  const isSent = sid === myId && myId !== '';
  const rawId = msg?._id ?? msg?.id;
  const id =
    rawId != null && String(rawId).trim() !== ''
      ? String(rawId).trim()
      : `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const body =
    msg?.message ?? msg?.text ?? msg?.content ?? (typeof msg?.body === 'string' ? msg.body : '');
  return {
    id,
    message: String(body ?? ''),
    timestamp: formatChatTime(msg?.createdAt ?? msg?.updatedAt),
    sent: isSent,
    seen: Boolean(msg?.seen),
  };
}

function splitDisplayName(fullName) {
  const name = String(fullName ?? 'User').trim() || 'User';
  const parts = name.split(/\s+/);
  const firstName = parts[0] || 'User';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
  return {firstName, lastName, displayName: name};
}

function mapChatListItem(chat) {
  const other = chat?.otherUser && typeof chat.otherUser === 'object' ? chat.otherUser : {};
  const {_id, name, image, online} = other;
  const img = typeof image === 'string' ? image.trim() : '';
  const {firstName, lastName, displayName} = splitDisplayName(name);
  return {
    _id: String(chat?._id ?? ''),
    lastmessage: String(chat?.last_message ?? ''),
    updatedAt: chat?.createdAt ?? chat?.updatedAt ?? '',
    totalunread: Number(chat?.totalunread ?? chat?.total_unread ?? 0) || 0,
    messageType: 'text',
    hasNotification: Boolean(chat?.hasNotification),
    isImportant: Boolean(chat?.isImportant),
    peer: {
      _id: _id != null ? String(_id) : '',
      firstName,
      lastName,
      displayName,
      image: img ? img : null,
      online: Boolean(online),
    },
  };
}

export const chatApi = createApi({
  reducerPath: reducers.path.chat,
  baseQuery,
  endpoints: builder => ({
    getChatList: builder.query({
      query: userId => ({
        url: `${endpoints.chat.chatList.url}/${encodeURIComponent(String(userId))}`,
        method: endpoints.chat.chatList.method,
      }),
      transformResponse: response => {
        const raw = response?.data?.chatsToShow ?? response?.data?.chats ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const chats = list.map(mapChatListItem).filter(c => c._id);
        const total =
          typeof response?.total === 'number' && !Number.isNaN(response.total)
            ? response.total
            : chats.length;
        return {
          chats,
          total,
          status: response?.status,
          message: response?.message,
        };
      },
    }),
    getChatMessages: builder.query({
      query: ({senderId, receiverId}) => {
        const s = encodeURIComponent(String(senderId ?? '').trim());
        const r = encodeURIComponent(String(receiverId ?? '').trim());
        return {
          url: `${endpoints.chat.getMessages.url}?sender_id=${s}&reciever_id=${r}`,
          method: endpoints.chat.getMessages.method,
        };
      },
      transformResponse: (response, _meta, arg) => {
        const myUserId = String(arg?.viewerId ?? arg?.senderId ?? '').trim();
        const raw = response?.data;
        const list = Array.isArray(raw) ? raw.slice() : [];
        list.sort((a, b) => {
          const ta = new Date(a?.createdAt ?? a?.updatedAt ?? 0).getTime();
          const tb = new Date(b?.createdAt ?? b?.updatedAt ?? 0).getTime();
          return tb - ta;
        });
        const messages = list.map(m => mapChatMessageToRow(m, myUserId));
        const total =
          typeof response?.total === 'number' && !Number.isNaN(response.total)
            ? response.total
            : messages.length;
        return {
          messages,
          total,
          status: response?.status,
          message: response?.message,
        };
      },
    }),
  }),
});

export const {useGetChatListQuery, useGetChatMessagesQuery} = chatApi;
