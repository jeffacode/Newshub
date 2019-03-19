export const getUserProfileMenu = username => [
  {
    name: 'userProfile_collections',
    icon: 'folder',
    path: `u/${username}`,
    children: [
      {
        name: 'userProfile_saved',
        path: 'saved',
      },
      {
        name: 'userProfile_hidden',
        path: 'hidden',
      },
      {
        name: 'userProfile_upvoted',
        path: 'upvoted',
      },
      {
        name: 'userProfile_downvoted',
        path: 'downvoted',
      },
    ],
  },
];

export const getUserSettingsMenu = () => [
  {
    name: 'userSettings_account',
    icon: 'crown',
    path: 'settings/account',
    children: [
      {
        name: 'userSettings_account_preferences',
        path: 'preferences',
      },
      {
        name: 'userSettings_connected_accounts',
        path: 'connect-accounts',
      },
      {
        name: 'userSettings_deactivate_account',
        path: 'deactivate-account',
      },
    ],
  },
  {
    name: 'userSettings_profile',
    icon: 'profile',
    path: 'settings/profile',
    children: [
      {
        name: 'userSettings_profile_information',
        path: 'information',
      },
      {
        name: 'userSettings_profile_images',
        path: 'images',
      },
      {
        name: 'userSettings_profile_topic',
        path: 'topic',
      },
      {
        name: 'userSettings_profile_adavanced',
        path: 'adavanced',
      },
    ],
  },
  {
    name: 'userSettings_privacy_and_security',
    icon: 'safety',
    path: 'settings/privacy-and-security',
    children: [
      {
        name: 'userSettings_user_privacy',
        path: 'user-privacy',
      },
      {
        name: 'userSettings_advanced_security',
        path: 'advanced-security',
      },
      {
        name: 'userSettings_message_privacy',
        path: 'message-privacy',
      },
    ],
  },
  {
    name: 'userSettings_feed_settings',
    icon: 'inbox',
    path: 'settings/feed-settings',
    children: [
      {
        name: 'userSettings_content_preferences',
        path: 'content-preferences',
      },
    ],
  },
  {
    name: 'userSettings_notifications',
    icon: 'notification',
    path: 'settings/notifications',
    children: [
      {
        name: 'userSettings_inbox_notification',
        path: 'inbox-notification',
      },
      {
        name: 'userSettings_email_notification',
        path: 'email-notification',
      },
      {
        name: 'userSettings_desktop_notifications',
        path: 'desktop-notifications',
      },
      {
        name: 'userSettings_push_notifications',
        path: 'push-notifications',
      },
    ],
  },
  // {
  //   name: 'userSettings_more_stuff',
  //   icon: 'project',
  //   path: 'settings/more-stuff',
  //   children: [
  //     {
  //       name: 'userSettings_read_coins',
  //       path: 'read_coins',
  //     },
  //     {
  //       name: 'userSettings_get_premium',
  //       path: 'get-premium',
  //     },
  //     {
  //       name: 'userSettings_help_center',
  //       path: 'help_center',
  //     },
  //   ],
  // },
];
