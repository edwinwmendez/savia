export type AuthStackParamList = {
  Splash: undefined;
  Login: { registrationSuccess?: boolean } | undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type CitizenTabParamList = {
  Home: undefined;
  Alerts: undefined;
  Map: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type CitizenStackParamList = {
  CitizenTabs: undefined;
  SelectAlertType: undefined;
};

export type AgentTabParamList = {
  Home: undefined;
  Alerts: undefined;
  History: undefined;
  Profile: undefined;
};
