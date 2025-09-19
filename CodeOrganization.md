
### **1. Directory / File Structure**

The app follows a modular, feature-driven layout using **Expo Router**:

```
app/
├── _layout.tsx              # Root layout, wraps app in AuthProvider
├── index.tsx                # Entry point, redirects based on auth state
├── login.tsx                # Login screen
├── signup.tsx               # Signup screen
├── forgot-password.tsx      # Password reset
├── verification.tsx         # Phone/email verification
└── (tabs)/                  # Tab group (main app after login)
    ├── _layout.tsx          # Tab navigator layout
    ├── home/                # Home feature stack
    │   ├── _layout.tsx      # Home stack navigator
    │   ├── index.tsx        # Home screen
    │   ├── booking.tsx
    │   ├── ride-tracking.tsx
    │   ├── destination.tsx
    │   └── payment.tsx
    ├── activity/            # Activity / trips stack
    │   ├── _layout.tsx
    │   ├── index.tsx        # Trips list
    │   ├── trip-detail.tsx
    │   └── receipt.tsx
    └── account/             # Account / profile stack
        ├── _layout.tsx
        ├── index.tsx        # Account main
        ├── profile.tsx
        ├── settings.tsx
        ├── payment-methods.tsx
        ├── notifications.tsx
        └── help.tsx
```

**Shared types and context:**

```
src/
├── shared/types/navigation.ts   # Common interfaces (e.g., User)
└── core/context/AuthContext.tsx # AuthProvider and useAuth hook
```

---

### **2. Auth Management**

* `AuthContext` holds:

  * `user` state
  * `isAuthenticated` & `isLoading`
  * Actions: `login`, `signup`, `logout`, `updateProfile`
* Stores user data in **AsyncStorage**.
* Wraps the app in **AuthProvider** at root layout (`app/_layout.tsx`) so all children can access auth state.

---

### **3. Routing / Navigation**

* Uses **Expo Router** with a nested layout system:

  * Root: `_layout.tsx` → wraps with AuthProvider
  * `(auth)/_layout.tsx` → login/signup flow
  * `(tabs)/_layout.tsx` → main tab navigator
  * Stack navigators inside each tab (e.g., `home/_layout.tsx`)
* `index.tsx` decides which route to redirect based on `isAuthenticated`.

---

### **4. UI Components**

* Each screen is self-contained (`login.tsx`, `home/index.tsx`, etc.).
* Uses **SafeAreaView**, **StyleSheet**, and functional React components.
* Minimal global state outside AuthContext—screen state is local.

---

### **5. How To Add to The code**

1. **Add New Features / Tabs:**

   * Create a new folder under `(tabs)/` with its own `_layout.tsx` and screens.
2. **Add Screens to Existing Stack:**

   * Add a `.tsx` file inside the stack folder (`home/`, `activity/`, `account/`).
   * Update `_layout.tsx` for the stack if needed.
3. **Add Shared Types or Utils:**

   * Put new types in `src/shared/types/`.
   * Shared functions can go in `src/core/utils/`.
4. **Add Context / State Management:**

   * Add new contexts in `src/core/context/`.
   * Wrap root layout or specific layouts if needed.
5. **Add API Integration:**

   * Mock data can be replaced by real API calls in AuthContext or screen components.
   * AsyncStorage calls can be extended to persist new data types.



LocalRides/
├── App.js                                    # Main entry point
├── app.json                                  # Expo configuration
├── babel.config.js                           # Babel configuration
├── metro.config.js                           # Metro bundler configuration
├── package.json                              # Dependencies and scripts
├── tsconfig.json                             # TypeScript configuration (optional)
└── yarn.lock / package-lock.json             # Lock file

├── src/
│   ├── core/                                 # Core infrastructure and utilities
│   │   ├── api/                              # API layer and networking
│   │   │   ├── client.js                     # Axios/fetch client setup
│   │   │   ├── endpoints.js                  # API endpoint definitions
│   │   │   ├── interceptors.js               # Request/response interceptors
│   │   │   └── types.js                      # API response types
│   │   ├── storage/                          # Data persistence
│   │   │   ├── AsyncStorage.js               # AsyncStorage utilities
│   │   │   ├── SecureStore.js                # Expo SecureStore for sensitive data
│   │   │   └── cache.js                      # Caching mechanisms
│   │   ├── location/                         # Location services
│   │   │   ├── LocationManager.js            # Location tracking and management
│   │   │   ├── PermissionHandler.js          # Location permissions
│   │   │   └── GeolocationUtils.js           # Location utility functions
│   │   ├── navigation/                       # Navigation configuration
│   │   │   ├── RootNavigator.js              # Main navigation container
│   │   │   ├── AuthNavigator.js              # Authentication flow navigation
│   │   │   ├── AppNavigator.js               # Main app navigation
│   │   │   └── navigationRef.js              # Navigation reference for programmatic navigation
│   │   ├── utils/                            # Utility functions and helpers
│   │   │   ├── constants.js                  # App-wide constants
│   │   │   ├── validators.js                 # Form validation utilities
│   │   │   ├── formatters.js                 # Data formatting functions
│   │   │   ├── permissions.js                # Device permissions handling
│   │   │   └── helpers.js                    # General helper functions
│   │   └── context/                          # React Context providers
│   │       ├── AuthContext.js                # Authentication state management
│   │       ├── LocationContext.js            # Location state management
│   │       ├── ThemeContext.js               # Theme and styling context
│   │       └── AppStateContext.js            # Global app state
│   │
│   ├── features/                             # Feature-based organization
│   │   ├── authentication/                   # User authentication
│   │   │   ├── components/                   # Auth-specific components
│   │   │   │   ├── LoginForm.js              # Login form component
│   │   │   │   ├── SignupForm.js             # Registration form component
│   │   │   │   ├── SocialAuthButtons.js      # Social media login buttons
│   │   │   │   └── AuthInput.js              # Custom input for auth forms
│   │   │   ├── screens/                      # Authentication screens
│   │   │   │   ├── LoginScreen.js            # Login screen
│   │   │   │   ├── SignupScreen.js           # Registration screen
│   │   │   │   ├── ForgotPasswordScreen.js   # Password reset screen
│   │   │   │   └── VerificationScreen.js     # Phone/email verification
│   │   │   ├── hooks/                        # Auth-specific hooks
│   │   │   │   ├── useAuth.js                # Authentication hook
│   │   │   │   └── useAuthValidation.js      # Form validation hook
│   │   │   ├── services/                     # Auth API services
│   │   │   │   └── authService.js            # Authentication API calls
│   │   │   └── types/                        # Auth-related types
│   │   │       ├── User.js                   # User model/interface
│   │   │       └── AuthResponse.js           # Auth API response types
│   │   │
│   │   ├── home/                             # Main home and booking feature
│   │   │   ├── components/                   # Home-specific components
│   │   │   │   ├── MapView.js                # Map component wrapper
│   │   │   │   ├── LocationSearch.js         # Location search input
│   │   │   │   ├── RideTypeSelector.js       # Vehicle type selection
│   │   │   │   ├── RideEstimateCard.js       # Price estimate display
│   │   │   │   ├── DriverCard.js             # Driver information card
│   │   │   │   ├── BookingProgress.js        # Booking flow progress indicator
│   │   │   │   └── RideTracker.js            # Live ride tracking component
│   │   │   ├── screens/                      # Home feature screens
│   │   │   │   ├── HomeScreen.js             # Main home screen with map
│   │   │   │   ├── BookingScreen.js          # Ride booking flow
│   │   │   │   ├── RideTrackingScreen.js     # Active ride tracking
│   │   │   │   ├── DestinationScreen.js      # Destination selection
│   │   │   │   └── PaymentScreen.js          # Payment selection
│   │   │   ├── hooks/                        # Home-specific hooks
│   │   │   │   ├── useRideBooking.js         # Ride booking logic
│   │   │   │   ├── useMapInteraction.js      # Map interaction handling
│   │   │   │   ├── useLocationSearch.js      # Location search functionality
│   │   │   │   └── useRideTracking.js        # Real-time ride tracking
│   │   │   ├── services/                     # Home API services
│   │   │   │   ├── rideService.js            # Ride booking/management API
│   │   │   │   ├── mapService.js             # Map and routing services
│   │   │   │   └── estimateService.js        # Price estimation API
│   │   │   └── types/                        # Home-related types
│   │   │       ├── Ride.js                   # Ride model/interface
│   │   │       ├── Driver.js                 # Driver model/interface
│   │   │       ├── Vehicle.js                # Vehicle model/interface
│   │   │       └── RideEstimate.js           # Estimate model/interface
│   │   │
│   │   ├── activity/                         # Trip history and activity
│   │   │   ├── components/                   # Activity-specific components
│   │   │   │   ├── TripHistoryItem.js        # Trip history list item
│   │   │   │   ├── TripStatusBadge.js        # Trip status indicator
│   │   │   │   ├── ReceiptView.js            # Trip receipt component
│   │   │   │   ├── RatingModal.js            # Driver/trip rating modal
│   │   │   │   └── TripFilter.js             # Filter trips by date/status
│   │   │   ├── screens/                      # Activity screens
│   │   │   │   ├── ActivityScreen.js         # Main activity/history screen
│   │   │   │   ├── TripDetailScreen.js       # Individual trip details
│   │   │   │   └── ReceiptScreen.js          # Trip receipt screen
│   │   │   ├── hooks/                        # Activity-specific hooks
│   │   │   │   ├── useTripHistory.js         # Trip history management
│   │   │   │   └── useTripDetails.js         # Trip detail fetching
│   │   │   ├── services/                     # Activity API services
│   │   │   │   └── tripHistoryService.js     # Trip history API calls
│   │   │   └── types/                        # Activity-related types
│   │   │       ├── Trip.js                   # Trip model/interface
│   │   │       ├── TripHistory.js            # Trip history model
│   │   │       └── Receipt.js                # Receipt model/interface
│   │   │
│   │   ├── account/                          # User profile and settings
│   │   │   ├── components/                   # Account-specific components
│   │   │   │   ├── ProfileHeader.js          # Profile header component
│   │   │   │   ├── SettingsItem.js           # Settings menu item
│   │   │   │   ├── PaymentMethodCard.js      # Payment method display
│   │   │   │   ├── ProfilePhotoUpload.js     # Profile photo upload
│   │   │   │   └── PreferenceToggle.js       # Settings toggle component
│   │   │   ├── screens/                      # Account screens
│   │   │   │   ├── AccountScreen.js          # Main account screen
│   │   │   │   ├── ProfileScreen.js          # Profile editing screen
│   │   │   │   ├── SettingsScreen.js         # App settings screen
│   │   │   │   ├── PaymentMethodsScreen.js   # Payment methods management
│   │   │   │   ├── NotificationsScreen.js    # Notification preferences
│   │   │   │   └── HelpScreen.js             # Help and support
│   │   │   ├── hooks/                        # Account-specific hooks
│   │   │   │   ├── useProfile.js             # Profile management
│   │   │   │   ├── useSettings.js            # Settings management
│   │   │   │   └── usePaymentMethods.js      # Payment methods handling
│   │   │   ├── services/                     # Account API services
│   │   │   │   ├── profileService.js         # Profile API calls
│   │   │   │   ├── settingsService.js        # Settings API calls
│   │   │   │   └── paymentService.js         # Payment methods API
│   │   │   └── types/                        # Account-related types
│   │   │       ├── UserProfile.js            # User profile model
│   │   │       ├── Settings.js               # Settings model
│   │   │       └── PaymentMethod.js          # Payment method model
│   │   │
│   │   └── notifications/                    # Push notifications feature
│   │       ├── components/                   # Notification components
│   │       │   ├── NotificationItem.js       # Individual notification
│   │       │   └── NotificationsList.js      # Notifications list
│   │       ├── screens/                      # Notification screens
│   │       │   └── NotificationsScreen.js    # Notifications inbox
│   │       ├── hooks/                        # Notification hooks
│   │       │   └── useNotifications.js       # Notifications management
│   │       ├── services/                     # Notification services
│   │       │   └── notificationService.js    # Push notification handling
│   │       └── types/                        # Notification types
│   │           └── Notification.js           # Notification model
│   │
│   ├── shared/                               # Shared components and utilities
│   │   ├── components/                       # Reusable UI components
│   │   │   ├── ui/                           # Basic UI elements
│   │   │   │   ├── Button.js                 # Custom button component
│   │   │   │   ├── Input.js                  # Custom input component
│   │   │   │   ├── Card.js                   # Card wrapper component
│   │   │   │   ├── Modal.js                  # Modal wrapper component
│   │   │   │   ├── Badge.js                  # Badge/chip component
│   │   │   │   ├── Avatar.js                 # User avatar component
│   │   │   │   ├── Divider.js                # Divider component
│   │   │   │   └── Typography.js             # Text components
│   │   │   ├── layout/                       # Layout components
│   │   │   │   ├── Screen.js                 # Screen wrapper
│   │   │   │   ├── Container.js              # Container component
│   │   │   │   ├── Header.js                 # Screen header
│   │   │   │   ├── TabBar.js                 # Custom tab bar
│   │   │   │   └── SafeAreaWrapper.js        # Safe area wrapper
│   │   │   ├── feedback/                     # User feedback components
│   │   │   │   ├── LoadingSpinner.js         # Loading indicator
│   │   │   │   ├── ErrorMessage.js           # Error display
│   │   │   │   ├── EmptyState.js             # Empty state component
│   │   │   │   ├── Toast.js                  # Toast notifications
│   │   │   │   └── ConfirmDialog.js          # Confirmation dialog
│   │   │   └── forms/                        # Form-related components
│   │   │       ├── FormField.js              # Form field wrapper
│   │   │       ├── ValidationMessage.js      # Validation error display
│   │   │       ├── DatePicker.js             # Date picker component
│   │   │       └── PhoneInput.js             # Phone number input
│   │   ├── hooks/                            # Shared custom hooks
│   │   │   ├── useApi.js                     # Generic API hook
│   │   │   ├── useDebounce.js                # Debounce hook
│   │   │   ├── useKeyboard.js                # Keyboard state hook
│   │   │   ├── useOrientation.js             # Device orientation hook
│   │   │   ├── useAppState.js                # App state (background/foreground)
│   │   │   └── useNetworkStatus.js           # Network connectivity hook
│   │   ├── utils/                            # Shared utility functions
│   │   │   ├── formatting.js                 # Date, currency, text formatting
│   │   │   ├── validation.js                 # Common validation functions
│   │   │   ├── calculations.js               # Distance, time calculations
│   │   │   ├── deviceInfo.js                 # Device information utilities
│   │   │   └── errorHandling.js              # Error handling utilities
│   │   └── types/                            # Shared type definitions
│   │       ├── api.js                        # Common API types
│   │       ├── navigation.js                 # Navigation parameter types
│   │       └── common.js                     # Common shared types
│   │
│   ├── styles/                               # Global styles and theming
│   │   ├── theme.js                          # Theme configuration (colors, fonts, spacing)
│   │   ├── typography.js                     # Typography styles
│   │   ├── colors.js                         # Color palette
│   │   ├── spacing.js                        # Spacing/margin/padding values
│   │   ├── shadows.js                        # Shadow styles
│   │   └── globalStyles.js                   # Global stylesheet
│   │
│   └── config/                               # Configuration files
│       ├── env.js                            # Environment variables
│       ├── firebase.js                       # Firebase configuration
│       ├── maps.js                           # Maps (Google/Apple) configuration
│       ├── payments.js                       # Payment gateway configuration
│       └── app.js                            # App-wide configuration

├── assets/                                   # Static assets
│   ├── images/                               # Image assets
│   │   ├── icons/                            # App icons and small graphics
│   │   ├── illustrations/                    # Larger illustrations
│   │   ├── onboarding/                       # Onboarding screen images
│   │   └── splash/                           # Splash screen assets
│   ├── fonts/                                # Custom fonts
│   ├── sounds/                               # Audio files (notifications, etc.)
│   └── data/                                 # Static data files (mock data, etc.)
│       └── mockData.js                       # Mock data for development

├── docs/                                     # Documentation
│   ├── README.md                             # Project documentation
│   ├── CONTRIBUTING.md                       # Contribution guidelines
│   ├── API.md                                # API documentation
│   └── DEPLOYMENT.md                         # Deployment instructions

└── __tests__/                                # Test files
    ├── __mocks__/                            # Mock files for testing
    ├── components/                           # Component tests
    ├── hooks/                                # Hook tests
    ├── services/                             # Service/API tests
    ├── utils/                                # Utility function tests
    └── setup.js                              # Test setup configuration
