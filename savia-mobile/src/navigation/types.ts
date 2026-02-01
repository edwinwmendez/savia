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
  DescribeAlert: undefined;
  LocateAlert: undefined;
  ConfirmAlert: undefined;
  AlertSuccess: { alertCode: string };
};

export type AgentTabParamList = {
  Home: undefined;
  Alerts: undefined;
  History: undefined;
  Profile: undefined;
};
