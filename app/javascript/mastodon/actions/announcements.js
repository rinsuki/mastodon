export const NICORU_ANNOUNCEMENT = 'NICORU_ACCOUNCEMENT';
export const TOGGLE_ANNOUNCEMENTS = 'TOGGLE_ANNOUNCEMENTS';
export const UPDATE_ANNOUNCEMENTS = 'UPDATE_ANNOUNCEMENTS';

export function nicoruAnnouncement(id) {
  return {
    type: NICORU_ANNOUNCEMENT,
    id,
  };
};

export function toggleAnnouncements() {
  return {
    type: TOGGLE_ANNOUNCEMENTS,
  };
};
